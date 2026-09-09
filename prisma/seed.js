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
        eventName: "पर्यावरण मैराथन (Paryavaran Marathon 2026)",
        eventTagline: "हर कदम प्रकृति के नाम • Fit For a Greener Tomorrow",
        eventDate: "27 सितंबर 2026 (रविवार)",
        eventTime: "06:00 AM IST",
        reportingTime: "05:15 AM IST",
        venue: "राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी",
        distance: "5 KM",
        registrationFee: 99,
        registrationDeadline: deadline,
        participantCapacity: 1500,
        contactEmail: "support@paryavaranmarathon.org",
        contactPhone: "8340477782",
        organizerName: "संस्थापक: नीरज स्टार",
        phonePeQrPath: "/images/phonepe-qr.svg",
        phonePeUpiId: "7367050371@ybl",
        bibPrefix: "BIB-",
        regPrefix: "RUN5K-",
      },
    });
    console.log("Default Event Settings created.");
  } else {
    console.log("Event Settings already exist.");
  }

  // 2. Seed Default SuperAdmin
  const adminEmail = "sourav.com";
  const existingAdmin = await prisma.adminUser.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const passwordHash = await bcrypt.hash("Admin@2026", 10);
    await prisma.adminUser.create({
      data: {
        email: adminEmail,
        passwordHash,
        name: "Saurabh Kumar",
        role: "SUPERADMIN",
      },
    });
    console.log(`Default SuperAdmin created: ${adminEmail}`);
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
