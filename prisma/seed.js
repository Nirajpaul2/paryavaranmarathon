const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding Marathon database...");

  // 1. Seed Event Settings if not exists
  const existingSettings = await prisma.eventSetting.findFirst();
  if (!existingSettings) {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 45);

    await prisma.eventSetting.create({
      data: {
        id: "default",
        eventName: "10 KM City Marathon 2026",
        eventTagline: "Run 10 KM. Challenge Yourself. Finish Strong.",
        eventDate: "Sunday, October 18, 2026",
        eventTime: "05:30 AM IST",
        reportingTime: "04:45 AM IST",
        venue: "Central Stadium Arena & Sports Complex, City Center",
        distance: "10 KM",
        registrationFee: 100,
        registrationDeadline: deadline,
        participantCapacity: 1500,
        contactEmail: "support@marathon10k.org",
        contactPhone: "+91 98765 43210",
        organizerName: "Athletics & Marathon Association",
        phonePeQrPath: "/images/phonepe-qr.png",
        phonePeUpiId: "marathon10k@phonepe",
        bibPrefix: "BIB-",
        regPrefix: "RUN10K-",
      },
    });
    console.log("Default Event Settings created.");
  } else {
    console.log("Event Settings already exist.");
  }

  // 2. Seed Default SuperAdmin
  const adminEmail = "admin@marathon10k.com";
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin@Marathon2026!", 10);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "Race Director",
        role: "SUPERADMIN",
      },
    });
    console.log(`Default SuperAdmin created: ${adminEmail} / Admin@Marathon2026!`);
  } else {
    console.log("SuperAdmin user already exists.");
  }

  console.log("Seeding completed successfully.");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
