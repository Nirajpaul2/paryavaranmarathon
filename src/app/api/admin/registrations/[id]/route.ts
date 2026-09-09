import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const body = await req.json();

    const registration = await prisma.registration.findUnique({
      where: { id },
      include: { participant: true, payment: true },
    });

    if (!registration) {
      return NextResponse.json({ success: false, error: "Registration not found" }, { status: 404 });
    }

    // Handle cancellation
    if (body.action === "CANCEL") {
      const oldStatus = registration.status;
      await prisma.$transaction(async (tx) => {
        await tx.registration.update({
          where: { id },
          data: { status: "CANCELLED" },
        });

        await tx.paymentAuditLog.create({
          data: {
            registrationId: id,
            adminEmail: admin.email,
            action: "REGISTRATION_CANCELLED",
            oldRegStatus: oldStatus,
            newRegStatus: "CANCELLED",
            notes: body.reason || "Cancelled by administrator",
          },
        });
      });

      return NextResponse.json({ success: true, message: "Registration cancelled" });
    }

    // Handle permitted edits: tshirtSize, bloodGroup, emergencyName, emergencyMobile, fullName
    if (body.participant) {
      await prisma.participant.update({
        where: { id: registration.participantId },
        data: {
          fullName: body.participant.fullName || registration.participant.fullName,
          tshirtSize: body.participant.tshirtSize || registration.participant.tshirtSize,
          bloodGroup: body.participant.bloodGroup || registration.participant.bloodGroup,
          emergencyName:
            body.participant.emergencyName !== undefined
              ? body.participant.emergencyName?.trim() || null
              : registration.participant.emergencyName,
          emergencyMobile:
            body.participant.emergencyMobile !== undefined
              ? body.participant.emergencyMobile?.trim() || null
              : registration.participant.emergencyMobile,
        },
      });

      await prisma.paymentAuditLog.create({
        data: {
          registrationId: id,
          adminEmail: admin.email,
          action: "DETAILS_UPDATED",
          oldRegStatus: registration.status,
          newRegStatus: registration.status,
          notes: "Updated participant details by admin",
        },
      });

      return NextResponse.json({ success: true, message: "Participant details updated successfully" });
    }

    return NextResponse.json({ success: false, error: "No valid action supplied" }, { status: 400 });
  } catch (error) {
    console.error("Registration update error:", error);
    return NextResponse.json({ success: false, error: "Failed to update registration" }, { status: 500 });
  }
}
