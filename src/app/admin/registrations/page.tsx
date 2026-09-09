import React from "react";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import RegistrationsClient from "./RegistrationsClient";

export const dynamic = "force-dynamic";

export default async function AdminRegistrationsPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const registrations = await prisma.registration.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      participant: true,
      payment: true,
    },
  });

  const eventSettings = await prisma.eventSetting.findFirst();

  return (
    <AdminLayout adminName={admin.name}>
      <RegistrationsClient
        initialRegistrations={registrations}
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
