import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { savePaymentProof } from "@/lib/storage";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const registrationId = formData.get("registrationId") as string;
    const transactionId = formData.get("transactionId") as string;
    const screenshot = formData.get("screenshot") as File | null;

    if (!registrationId) {
      return NextResponse.json(
        { success: false, error: "Registration ID is required" },
        { status: 400 }
      );
    }

    if (!transactionId || transactionId.trim().length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: "A valid Transaction ID / UTR reference (at least 6 characters) is required.",
        },
        { status: 400 }
      );
    }

    const cleanTransactionId = transactionId.trim().toUpperCase();

    // Verify registration exists
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: { payment: true, participant: true },
    });

    if (!registration) {
      return NextResponse.json(
        { success: false, error: "Registration record not found" },
        { status: 404 }
      );
    }

    // Check if another payment has already registered this transaction ID
    const duplicateTx = await prisma.payment.findFirst({
      where: {
        transactionId: cleanTransactionId,
        NOT: { registrationId },
      },
    });

    if (duplicateTx) {
      return NextResponse.json(
        {
          success: false,
          error:
            "This Transaction ID / UTR has already been submitted for another registration. Please enter the unique UTR from your PhonePe receipt.",
        },
        { status: 400 }
      );
    }

    // Handle payment screenshot file upload if supplied
    let savedFilePath: string | undefined = undefined;
    let savedFileName: string | undefined = undefined;

    if (screenshot && screenshot.size > 0) {
      const uploadResult = await savePaymentProof(screenshot);
      if (!uploadResult.success) {
        return NextResponse.json(
          { success: false, error: uploadResult.error },
          { status: 400 }
        );
      }
      savedFilePath = uploadResult.filePath;
      savedFileName = uploadResult.fileName;
    }

    // Update Payment record
    await prisma.payment.upsert({
      where: { registrationId },
      update: {
        transactionId: cleanTransactionId,
        proofPath: savedFilePath ?? registration.payment?.proofPath,
        proofFileName: savedFileName ?? registration.payment?.proofFileName,
        status: "PENDING",
        rejectionReason: null,
      },
      create: {
        registrationId,
        amount: 499,
        transactionId: cleanTransactionId,
        proofPath: savedFilePath,
        proofFileName: savedFileName,
        status: "PENDING",
      },
    });

    // Update Registration record
    await prisma.registration.update({
      where: { id: registrationId },
      data: { status: "PENDING" },
    });

    return NextResponse.json({
      success: true,
      message:
        "Your payment details have been submitted. Your payment will be manually verified by event organizers before confirmation.",
      registrationId,
    });
  } catch (error) {
    console.error("Payment submission error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "An error occurred while submitting payment details.",
      },
      { status: 500 }
    );
  }
}
