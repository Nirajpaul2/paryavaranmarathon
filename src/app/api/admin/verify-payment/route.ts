import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { PaymentVerificationSchema } from "@/lib/validations";
import { generateRegistrationAndBibNumbers } from "@/lib/bibGenerator";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, error: "Unauthorized: Admin login required" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const parseResult = PaymentVerificationSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: parseResult.error.errors[0]?.message || "Invalid payload",
        },
        { status: 400 }
      );
    }

    const { registrationId, action, rejectionReason } = parseResult.data;

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { payment: true, participant: true },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration not found" },
        { status: 404 }
      );
    }

    const oldPaymentStatus = registration.payment?.status || "PENDING";
    const oldRegStatus = registration.status;

    if (action === "APPROVE") {
      // Generate Bib and Registration Numbers
      const { registrationNumber, bibNumber } = await generateRegistrationAndBibNumbers();

      await prisma.$transaction(async (tx) => {
        // Update Payment
        await tx.payment.upsert({
          where: { registrationId },
          update: {
            status: "VERIFIED",
            rejectionReason: null,
            verifiedAt: new Date(),
            verifiedBy: admin.email,
          },
          create: {
            registrationId,
            amount: 100,
            status: "VERIFIED",
            verifiedAt: new Date(),
            verifiedBy: admin.email,
          },
        });

        // Update Registration
        await tx.registration.update({
          where: { id: registrationId },
          data: {
            status: "CONFIRMED",
            registrationNumber: registration.registrationNumber || registrationNumber,
            bibNumber: registration.bibNumber || bibNumber,
          },
        });

        // Audit Log Entry
        await tx.paymentAuditLog.create({
          data: {
            registrationId,
            adminEmail: admin.email,
            action: "PAYMENT_APPROVED",
            oldPaymentStatus,
            newPaymentStatus: "VERIFIED",
            oldRegStatus,
            newRegStatus: "CONFIRMED",
            notes: `Approved payment for participant ${registration.participant.fullName}. Bib: ${registration.bibNumber || bibNumber}`,
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: "Payment successfully verified and Registration confirmed with Bib assigned.",
      });
    } else {
      // REJECT ACTION
      await prisma.$transaction(async (tx) => {
        // Update Payment
        await tx.payment.upsert({
          where: { registrationId },
          update: {
            status: "REJECTED",
            rejectionReason: rejectionReason?.trim(),
            verifiedAt: new Date(),
            verifiedBy: admin.email,
          },
          create: {
            registrationId,
            amount: 100,
            status: "REJECTED",
            rejectionReason: rejectionReason?.trim(),
            verifiedAt: new Date(),
            verifiedBy: admin.email,
          },
        });

        // Update Registration
        await tx.registration.update({
          where: { id: registrationId },
          data: {
            status: "REJECTED",
          },
        });

        // Audit Log Entry
        await tx.paymentAuditLog.create({
          data: {
            registrationId,
            adminEmail: admin.email,
            action: "PAYMENT_REJECTED",
            oldPaymentStatus,
            newPaymentStatus: "REJECTED",
            oldRegStatus,
            newRegStatus: "REJECTED",
            notes: `Rejected with reason: ${rejectionReason?.trim()}`,
          },
        });
      });

      return NextResponse.json({
        success: true,
        message: "Payment rejected and participant notified with reason.",
      });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred during verification" },
      { status: 500 }
    );
  }
}
