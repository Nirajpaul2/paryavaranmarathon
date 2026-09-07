import prisma from "./prisma";

export async function generateRegistrationAndBibNumbers() {
  const settings = await prisma.eventSetting.findFirst();
  const regPrefix = settings?.regPrefix || "RUN10K-";
  const bibPrefix = settings?.bibPrefix || "BIB-";

  // Count existing confirmed registrations to calculate the next sequence number
  const confirmedCount = await prisma.registration.count({
    where: {
      status: "CONFIRMED",
      bibNumber: { not: null },
    },
  });

  const nextSeq = confirmedCount + 1;
  const registrationNumber = `${regPrefix}${String(nextSeq).padStart(6, "0")}`;
  const bibNumber = `${bibPrefix}${1000 + nextSeq}`;

  return {
    registrationNumber,
    bibNumber,
  };
}
