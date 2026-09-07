import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const admin = await getAuthenticatedAdmin();
    if (!admin) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const statusFilter = searchParams.get("status");

    const whereClause: any = {};
    if (statusFilter && statusFilter !== "ALL") {
      whereClause.status = statusFilter;
    }

    const registrations = await prisma.registration.findMany({
      where: whereClause,
      include: {
        participant: true,
        payment: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const headers = [
      "Registration Number",
      "Bib Number",
      "Full Name",
      "Mobile",
      "Email",
      "Gender",
      "Date of Birth",
      "City",
      "State",
      "T-Shirt Size",
      "Blood Group",
      "Running Experience",
      "Emergency Contact Name",
      "Emergency Contact Mobile",
      "Registration Status",
      "Payment Status",
      "Amount Paid",
      "PhonePe Transaction ID / UTR",
      "Registered At",
    ];

    const escapeCsv = (val: any) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = registrations.map((r) => [
      escapeCsv(r.registrationNumber || "N/A"),
      escapeCsv(r.bibNumber || "N/A"),
      escapeCsv(r.participant.fullName),
      escapeCsv(r.participant.mobile),
      escapeCsv(r.participant.email),
      escapeCsv(r.participant.gender),
      escapeCsv(r.participant.dob),
      escapeCsv(r.participant.city),
      escapeCsv(r.participant.state),
      escapeCsv(r.participant.tshirtSize || "N/A"),
      escapeCsv(r.participant.bloodGroup || "N/A"),
      escapeCsv(r.participant.runningExp || "N/A"),
      escapeCsv(r.participant.emergencyName),
      escapeCsv(r.participant.emergencyMobile),
      escapeCsv(r.status),
      escapeCsv(r.payment?.status || "PENDING"),
      escapeCsv(r.payment?.amount || 0),
      escapeCsv(r.payment?.transactionId || "N/A"),
      escapeCsv(r.createdAt.toISOString()),
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const filename = `marathon_participants_${Date.now()}.csv`;

    return new NextResponse(csvContent, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("CSV Export error:", error);
    return new NextResponse("Error generating CSV", { status: 500 });
  }
}
