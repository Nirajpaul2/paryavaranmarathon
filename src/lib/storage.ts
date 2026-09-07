import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/jpg"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function savePaymentProof(file: File): Promise<{
  success: boolean;
  filePath?: string;
  fileName?: string;
  error?: string;
}> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      error: "Invalid file type. Only JPG, PNG, and WebP images are allowed.",
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      success: false,
      error: "File size exceeds the 5 MB limit.",
    };
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadsDir = path.resolve(process.cwd(), "uploads");
    await fs.mkdir(uploadsDir, { recursive: true });

    const ext = file.name.split(".").pop() || "jpg";
    const safeExt = ext.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
    const uniqueId = crypto.randomBytes(16).toString("hex");
    const fileName = `proof_${Date.now()}_${uniqueId}.${safeExt}`;
    const fullPath = path.join(uploadsDir, fileName);

    await fs.writeFile(fullPath, buffer);

    return {
      success: true,
      filePath: fullPath,
      fileName,
    };
  } catch (err) {
    console.error("Failed to save payment proof screenshot:", err);
    return {
      success: false,
      error: "Failed to securely save payment screenshot on server.",
    };
  }
}
