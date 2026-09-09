import React from "react";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminLayout from "@/components/admin/AdminLayout";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import {
  Users,
  CreditCard,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  ArrowRight,
  ShieldCheck,
  FileSpreadsheet,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  // Fetch metrics in parallel
  const [
    totalRegistrations,
    pendingRegistrations,
    confirmedParticipants,
    pendingPayments,
    verifiedPayments,
    rejectedPayments,
    verifiedPaymentsSum,
    recentRegistrations,
  ] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({ where: { status: "PENDING" } }),
    prisma.registration.count({ where: { status: "CONFIRMED" } }),
    prisma.payment.count({ where: { status: "PENDING" } }),
    prisma.payment.count({ where: { status: "VERIFIED" } }),
    prisma.payment.count({ where: { status: "REJECTED" } }),
    prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: "VERIFIED" },
    }),
    prisma.registration.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: {
        participant: true,
        payment: true,
      },
    }),
  ]);

  const totalCollection = verifiedPaymentsSum._sum.amount || 0;

  return (
    <AdminLayout adminName={admin.name}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
              Event Operations Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Live registrations, PhonePe payment verification queue, and revenue summary.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/admin/payments"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl athletic-gradient text-white text-xs font-bold shadow-md hover:opacity-95"
            >
              <CreditCard className="w-4 h-4" />
              <span>Verify Payments ({pendingPayments})</span>
            </Link>
            <Link
              href="/api/admin/export"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700"
            >
              <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
              <span>Export CSV</span>
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Total Registrations */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Total Registered</span>
              <Users className="w-4 h-4 text-orange-400" />
            </div>
            <div className="text-3xl font-black text-white">{totalRegistrations}</div>
            <span className="text-[11px] text-slate-500 block">All participants in database</span>
          </div>

          {/* Card 2: Confirmed Runners */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-emerald-400">Confirmed Runners</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-400">{confirmedParticipants}</div>
            <span className="text-[11px] text-slate-500 block">Bibs issued &amp; ready to run</span>
          </div>

          {/* Card 3: Pending Payments */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-amber-400">Pending Review</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-400">{pendingPayments}</div>
            <span className="text-[11px] text-slate-500 block">Awaiting PhonePe UTR check</span>
          </div>

          {/* Card 4: Total Revenue */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-slate-400">Verified Revenue</span>
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white">₹{totalCollection.toLocaleString("en-IN")}</div>
            <span className="text-[11px] text-slate-500 block">{verifiedPayments} verified receipts</span>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Pending Registrations</span>
            <span className="text-lg font-bold text-amber-400">{pendingRegistrations}</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Rejected Submissions</span>
            <span className="text-lg font-bold text-rose-400">{rejectedPayments}</span>
          </div>
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">Database Isolation</span>
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Standalone Marathon DB
            </span>
          </div>
        </div>

        {/* Recent Registrations Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Recent Registrations
            </h2>
            <Link
              href="/admin/registrations"
              className="text-xs font-semibold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              <span>View All Registrations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Participant</th>
                  <th className="px-4 py-3">Contact</th>
                  <th className="px-4 py-3">Bib / Reg No.</th>
                  <th className="px-4 py-3">Payment Status</th>
                  <th className="px-4 py-3">Reg Status</th>
                  <th className="px-4 py-3">UTR Reference</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {recentRegistrations.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-4 py-8 text-center text-slate-500">
                      No registrations recorded yet. Submit a test registration from the website!
                    </td>
                  </tr>
                ) : (
                  recentRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className="font-bold text-white block">{reg.participant.fullName}</span>
                        <span className="text-[10px] text-slate-500">
                          {reg.participant.city}, {reg.participant.state}
                        </span>
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="block">{reg.participant.mobile}</span>
                        <span className="text-[10px] text-slate-500">{reg.participant.email}</span>
                      </td>

                      <td className="px-4 py-3.5 font-mono min-w-[110px]">
                        {reg.status === "CONFIRMED" && (reg.bibNumber || reg.registrationNumber) ? (
                          <span className="font-bold text-orange-400 block text-sm">
                            {reg.bibNumber || reg.registrationNumber}
                          </span>
                        ) : (
                          <span className="text-slate-500 italic text-xs">Unassigned</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        {reg.payment?.status === "VERIFIED" && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                            VERIFIED
                          </span>
                        )}
                        {reg.payment?.status === "PENDING" && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold">
                            PENDING
                          </span>
                        )}
                        {reg.payment?.status === "REJECTED" && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold">
                            REJECTED
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span
                          className={`font-semibold ${
                            reg.status === "CONFIRMED"
                              ? "text-emerald-400"
                              : reg.status === "REJECTED"
                              ? "text-rose-400"
                              : "text-amber-400"
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 font-mono text-[11px]">
                        {reg.payment?.transactionId ? (
                          <span className="text-slate-300">{reg.payment.transactionId}</span>
                        ) : (
                          <span className="text-slate-600">None</span>
                        )}
                      </td>

                      <td className="px-4 py-3.5 text-right">
                        <Link
                          href="/admin/payments"
                          className="px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-orange-400 font-semibold text-[11px]"
                        >
                          Review
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
