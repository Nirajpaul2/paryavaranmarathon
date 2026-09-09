import prisma from "./prisma";
import { Prisma } from "@prisma/client";

/**
 * Format sequence integer into minimum 3-digit zero-padded string.
 * Examples:
 * 1   -> "001"
 * 9   -> "009"
 * 10  -> "010"
 * 99  -> "099"
 * 100 -> "100"
 * 105 -> "105"
 * 999 -> "999"
 * 1000 -> "1000"
 */
export function formatRegistrationNumber(seq: number): string {
  const safeSeq = Math.max(1, Math.floor(seq));
  return String(safeSeq).padStart(3, "0");
}

type PrismaTransactionClient = Omit<
  typeof prisma,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

/**
 * Concurrency-safe generator for sequential 3-digit registration numbers.
 * Enforces per-event sequence, atomic increment, and database uniqueness.
 */
export async function getNextSequentialNumber(
  client?: PrismaTransactionClient,
  eventId: string = "default"
): Promise<string> {
  const db = client || prisma;

  // 1. Find the current highest numeric registration number among confirmed registrations
  const confirmed = await db.registration.findMany({
    where: {
      status: "CONFIRMED",
      registrationNumber: { not: null },
    },
    select: { registrationNumber: true },
  });

  let maxConfirmedSeq = 0;
  for (const reg of confirmed) {
    if (reg.registrationNumber) {
      const parsed = parseInt(reg.registrationNumber, 10);
      if (!isNaN(parsed) && parsed > maxConfirmedSeq) {
        maxConfirmedSeq = parsed;
      }
    }
  }

  // 2. Ensure the RegistrationSequence record exists for this event
  const seqRecord = await db.registrationSequence.findUnique({
    where: { eventId },
  });

  if (!seqRecord) {
    await db.registrationSequence.create({
      data: {
        eventId,
        lastSeq: maxConfirmedSeq,
      },
    });
  } else if (seqRecord.lastSeq < maxConfirmedSeq) {
    await db.registrationSequence.update({
      where: { eventId },
      data: { lastSeq: maxConfirmedSeq },
    });
  }

  // 3. Atomically increment the sequence
  const updated = await db.registrationSequence.update({
    where: { eventId },
    data: {
      lastSeq: { increment: 1 },
    },
  });

  let candidateSeq = updated.lastSeq;
  let formatted = formatRegistrationNumber(candidateSeq);

  // 4. Guarantee uniqueness: check if candidate is already occupied, and increment if needed
  while (
    await db.registration.findFirst({
      where: { registrationNumber: formatted },
    })
  ) {
    const bumped = await db.registrationSequence.update({
      where: { eventId },
      data: {
        lastSeq: { increment: 1 },
      },
    });
    candidateSeq = bumped.lastSeq;
    formatted = formatRegistrationNumber(candidateSeq);
  }

  return formatted;
}

/**
 * Migration & backfill utility for existing confirmed registrations.
 * Inspects all CONFIRMED records, preserves valid 3+ digit numbers,
 * and assigns sequential numbers to unassigned/legacy records in confirmation order.
 */
export async function backfillRegistrationNumbers(
  client?: PrismaTransactionClient,
  eventId: string = "default"
): Promise<{ migrated: number; totalConfirmed: number }> {
  const db = client || prisma;

  const confirmedRegistrations = await db.registration.findMany({
    where: { status: "CONFIRMED" },
    include: { payment: true },
    orderBy: [{ createdAt: "asc" }],
  });

  let migratedCount = 0;
  let maxSeq = 0;

  for (const reg of confirmedRegistrations) {
    const isSequential3Digit =
      reg.registrationNumber && /^\d{3,}$/.test(reg.registrationNumber);

    if (isSequential3Digit) {
      const num = parseInt(reg.registrationNumber!, 10);
      if (num > maxSeq) {
        maxSeq = num;
      }
      // Ensure bibNumber matches registrationNumber
      if (reg.bibNumber !== reg.registrationNumber) {
        await db.registration.update({
          where: { id: reg.id },
          data: { bibNumber: reg.registrationNumber },
        });
      }
    } else {
      // Assign next sequence
      maxSeq += 1;
      const formatted = formatRegistrationNumber(maxSeq);
      await db.registration.update({
        where: { id: reg.id },
        data: {
          registrationNumber: formatted,
          bibNumber: formatted,
        },
      });
      migratedCount += 1;
    }
  }

  // Synchronize sequence table
  await db.registrationSequence.upsert({
    where: { eventId },
    update: { lastSeq: maxSeq },
    create: { eventId, lastSeq: maxSeq },
  });

  return {
    migrated: migratedCount,
    totalConfirmed: confirmedRegistrations.length,
  };
}
