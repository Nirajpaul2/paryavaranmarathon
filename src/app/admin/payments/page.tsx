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

  const eventSettings = await prisma.eventSetting.findFirst();

  return (
    <AdminLayout adminName={admin.name}>
      <PaymentsClient
        initialPayments={payments}
        eventSettings={
          eventSettings
            ? {
                eventName: eventSettings.eventName,
                eventDate: eventSettings.eventDate,
                venue: eventSettings.venue,
                distance: eventSettings.distance,
                organizerName: eventSettings.organizerName,
                whatsappTemplate: eventSettings.whatsappTemplate,
              }
            : undefined
        }
      />
    </AdminLayout>
  );
}
