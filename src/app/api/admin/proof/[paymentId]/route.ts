import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import fs from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { paymentId: string } }
) {
  try {
    // 1. Authenticate Admin
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized. Admin access required.", { status: 401 });
    }

    const { paymentId } = params;

    // 2. Fetch payment record
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });

    if (!payment || !payment.proofPath) {
      return new NextResponse("Payment proof screenshot not found.", { status: 404 });
    }

    // 3. Security: ensure the file path is within the allowed uploads directory
    const uploadsDir = path.resolve(process.cwd(), "uploads");
    const resolvedPath = path.resolve(payment.proofPath);

    if (!resolvedPath.startsWith(uploadsDir)) {
      return new NextResponse("Forbidden file access path.", { status: 403 });
    }

    // 4. Read file buffer
    const fileBuffer = await fs.readFile(resolvedPath);

    // Determine content type
    let contentType = "image/jpeg";
    if (resolvedPath.endsWith(".png")) contentType = "image/png";
    else if (resolvedPath.endsWith(".webp")) contentType = "image/webp";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, no-cache, no-store, must-revalidate",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (error) {
    console.error("Error reading proof image:", error);
    return new NextResponse("Image could not be retrieved.", { status: 500 });
  }
}
