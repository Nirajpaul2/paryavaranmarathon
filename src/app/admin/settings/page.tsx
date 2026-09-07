import React from "react";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import SettingsClient from "./SettingsClient";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const settings = await prisma.eventSetting.findFirst();

  return (
    <AdminLayout adminName={admin.name}>
      <SettingsClient initialSettings={settings} />
    </AdminLayout>
  );
}
