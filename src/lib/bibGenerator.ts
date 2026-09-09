import prisma from "./prisma";
import { getNextSequentialNumber, formatRegistrationNumber } from "./sequenceGenerator";

/**
 * Generates the next sequential 3-digit registration and bib numbers (e.g. 001, 002, 100, 105).
 * Synchronizes registrationNumber and bibNumber to the exact sequential 3-digit value.
 */
export async function generateRegistrationAndBibNumbers(tx?: any) {
  const db = tx || prisma;
  const settings = await db.eventSetting.findFirst();
  const eventId = settings?.id || "default";

  const sequentialNumber = await getNextSequentialNumber(db, eventId);

  return {
    registrationNumber: sequentialNumber,
    bibNumber: sequentialNumber,
  };
}

export { formatRegistrationNumber, getNextSequentialNumber };
