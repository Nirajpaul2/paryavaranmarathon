import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export async function GET() {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const settings = await prisma.eventSetting.findFirst();
    return NextResponse.json({ success: true, settings });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      // Handle QR Code image replacement
      const formData = await req.formData();
      const qrFile = formData.get("qrFile") as File | null;

      if (!qrFile) {
        return NextResponse.json({ success: false, error: "No file provided" }, { status: 400 });
      }

      const bytes = await qrFile.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const publicImagesDir = path.resolve(process.cwd(), "public/images");
      await fs.mkdir(publicImagesDir, { recursive: true });

      const ext = qrFile.name.split(".").pop() || "png";
      const safeFileName = `phonepe-qr-active.${ext}`;
      const filePath = path.join(publicImagesDir, safeFileName);

      await fs.writeFile(filePath, buffer);

      const updated = await prisma.eventSetting.updateMany({
        data: {
          phonePeQrPath: `/images/${safeFileName}?v=${Date.now()}`,
        },
      });

      return NextResponse.json({
        success: true,
        message: "PhonePe QR image updated successfully.",
        qrPath: `/images/${safeFileName}`,
      });
    } else {
      // Handle standard settings JSON update
      const body = await req.json();

      const existing = await prisma.eventSetting.findFirst();

      const updated = await prisma.eventSetting.upsert({
        where: { id: existing?.id || "default" },
        update: {
          eventName: body.eventName,
          eventTagline: body.eventTagline,
          eventDate: body.eventDate,
          eventTime: body.eventTime,
          reportingTime: body.reportingTime,
          venue: body.venue,
          registrationFee: Number(body.registrationFee),
          participantCapacity: Number(body.participantCapacity),
          registrationDeadline: new Date(body.registrationDeadline),
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          organizerName: body.organizerName,
          phonePeUpiId: body.phonePeUpiId,
          bibPrefix: body.bibPrefix,
          regPrefix: body.regPrefix,
        },
        create: {
          id: "default",
          eventName: body.eventName,
          eventTagline: body.eventTagline,
          eventDate: body.eventDate,
          eventTime: body.eventTime,
          reportingTime: body.reportingTime,
          venue: body.venue,
          registrationFee: Number(body.registrationFee),
          participantCapacity: Number(body.participantCapacity),
          registrationDeadline: new Date(body.registrationDeadline),
          contactEmail: body.contactEmail,
          contactPhone: body.contactPhone,
          organizerName: body.organizerName,
          phonePeUpiId: body.phonePeUpiId,
          bibPrefix: body.bibPrefix,
          regPrefix: body.regPrefix,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Event settings updated successfully.",
        settings: updated,
      });
    }
  } catch (error) {
    console.error("Settings update error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update event settings" },
      { status: 500 }
    );
  }
}
