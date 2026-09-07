import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { identifier } = await req.json();

    if (!identifier || typeof identifier !== "string" || identifier.trim().length < 4) {
      return NextResponse.json(
        {
          success: false,
          error: "Please enter a valid Mobile Number, Email, or Registration Number.",
        },
        { status: 400 }
      );
    }

    const query = identifier.trim();

    // Query participant or registration
    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { registrationNumber: query.toUpperCase() },
          { id: query },
          { participant: { mobile: query } },
          { participant: { email: query.toLowerCase() } },
        ],
      },
      include: {
        participant: true,
        payment: true,
      },
    });

    if (!registration || !registration.participant) {
      return NextResponse.json(
        {
          success: false,
          error: "No registration found matching your details. Please check your mobile or email.",
        },
        { status: 404 }
      );
    }

    const settings = await prisma.eventSetting.findFirst();

    // Return only non-sensitive participant information
    return NextResponse.json({
      success: true,
      data: {
        registrationId: registration.id,
        registrationNumber: registration.registrationNumber,
        bibNumber: registration.bibNumber,
        registrationStatus: registration.status,
        fullName: registration.participant.fullName,
        mobile: `+91 ******${registration.participant.mobile.slice(-4)}`,
        city: registration.participant.city,
        state: registration.participant.state,
        tshirtSize: registration.participant.tshirtSize,
        bloodGroup: registration.participant.bloodGroup,
        paymentStatus: registration.payment?.status || "PENDING",
        paymentAmount: registration.payment?.amount || settings?.registrationFee || 499,
        transactionId: registration.payment?.transactionId
          ? `${registration.payment.transactionId.slice(0, 4)}****${registration.payment.transactionId.slice(-4)}`
          : null,
        rejectionReason: registration.payment?.rejectionReason,
        eventDate: settings?.eventDate || "Sunday, October 18, 2026",
        eventTime: settings?.eventTime || "05:30 AM IST",
        venue: settings?.venue || "Central Stadium Arena, City Center",
      },
    });
  } catch (error) {
    console.error("Lookup error:", error);
    return NextResponse.json(
      { success: false, error: "An error occurred while looking up registration." },
      { status: 500 }
    );
  }
}
