import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { registrationId } = body;

    if (!registrationId || typeof registrationId !== "string") {
      return NextResponse.json(
        { success: false, error: "Registration ID is required" },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        participant: true,
        payment: true,
      },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration record not found" },
        { status: 404 }
      );
    }

    // Must be confirmed to log confirmation action
    if (registration.status !== "CONFIRMED") {
      return NextResponse.json(
        { success: false, error: "Registration must be CONFIRMED to open WhatsApp confirmation" },
        { status: 400 }
      );
    }

    const now = new Date();

    // 1. Update registration record
    const updated = await prisma.registration.update({
      where: { id: registrationId },
      data: {
        whatsappOpenedAt: now,
      },
    });

    // 2. Audit log entry
    await prisma.paymentAuditLog.create({
      data: {
        registrationId,
        adminEmail: admin.email,
        action: "WHATSAPP_LINK_OPENED",
        oldPaymentStatus: registration.payment?.status || null,
        newPaymentStatus: registration.payment?.status || null,
        oldRegStatus: registration.status,
        newRegStatus: registration.status,
        notes: `WhatsApp confirmation link opened for participant ${registration.participant.fullName} (${registration.participant.mobile})`,
        timestamp: now,
      },
    });

    return NextResponse.json({
      success: true,
      whatsappOpenedAt: now.toISOString(),
      message: "WhatsApp link opened timestamp recorded",
    });
  } catch (error) {
    console.error("Failed to record WhatsApp link opened:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
