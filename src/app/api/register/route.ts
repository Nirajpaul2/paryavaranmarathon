import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { RegistrationSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // 1. Validate input payload
    const validationResult = RegistrationSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Validation failed",
          details: validationResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const data = validationResult.data;

    // 2. Load Event Settings
    const settings = await prisma.eventSetting.findFirst();
    const fee = settings?.registrationFee ?? 499;
    const capacity = settings?.participantCapacity ?? 1500;
    const deadline = settings?.registrationDeadline
      ? new Date(settings.registrationDeadline)
      : new Date("2030-01-01");

    // 3. Server-side Deadline Check
    const now = new Date();
    if (now > deadline) {
      return NextResponse.json(
        {
          success: false,
          error: "Registration has officially closed for this marathon event.",
        },
        { status: 403 }
      );
    }

    // 4. Server-side Capacity Check
    const confirmedCount = await prisma.registration.count({
      where: { status: "CONFIRMED" },
    });
    if (confirmedCount >= capacity) {
      return NextResponse.json(
        {
          success: false,
          error: "Registration is currently full. Maximum participant capacity has been reached.",
        },
        { status: 403 }
      );
    }

    // 5. Strict Duplicate Registration Prevention
    const existingParticipant = await prisma.participant.findFirst({
      where: {
        OR: [{ mobile: data.mobile }, { email: data.email }],
      },
      include: {
        registration: true,
      },
    });

    if (existingParticipant && existingParticipant.registration) {
      return NextResponse.json(
        {
          success: false,
          duplicate: true,
          message: "You are already registered for this event.",
          registrationId: existingParticipant.registration.id,
        },
        { status: 409 }
      );
    }

    // 6. Create or update Participant & Registration records in an isolated transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create or update participant
      const participant = await tx.participant.upsert({
        where: { mobile: data.mobile },
        update: {
          fullName: data.fullName,
          email: data.email,
          dob: data.dob,
          gender: data.gender,
          city: data.city,
          state: data.state,
          emergencyName: data.emergencyName,
          emergencyMobile: data.emergencyMobile,
          tshirtSize: data.tshirtSize,
          bloodGroup: data.bloodGroup,
          runningExp: data.runningExp,
        },
        create: {
          fullName: data.fullName,
          mobile: data.mobile,
          email: data.email,
          dob: data.dob,
          gender: data.gender,
          city: data.city,
          state: data.state,
          emergencyName: data.emergencyName,
          emergencyMobile: data.emergencyMobile,
          tshirtSize: data.tshirtSize,
          bloodGroup: data.bloodGroup,
          runningExp: data.runningExp,
        },
      });

      // Create Registration
      const registration = await tx.registration.create({
        data: {
          participantId: participant.id,
          status: "PENDING",
        },
      });

      // Create Initial Pending Payment entry
      await tx.payment.create({
        data: {
          registrationId: registration.id,
          amount: fee,
          status: "PENDING",
        },
      });

      return { registrationId: registration.id };
    });

    return NextResponse.json({
      success: true,
      message: "Registration initiated successfully.",
      registrationId: result.registrationId,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An unexpected server error occurred while processing registration.",
      },
      { status: 500 }
    );
  }
}
