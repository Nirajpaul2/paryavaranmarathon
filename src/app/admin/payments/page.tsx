import React from "react";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import PaymentsClient from "./PaymentsClient";

export const dynamic = "force-dynamic";

export default async function AdminPaymentsPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const payments = await prisma.payment.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      registration: {
        include: {
          participant: true,
        },
      },
    },
  });

  return (
    <AdminLayout adminName={admin.name}>
      <PaymentsClient initialPayments={payments} />
    </AdminLayout>
  );
}
