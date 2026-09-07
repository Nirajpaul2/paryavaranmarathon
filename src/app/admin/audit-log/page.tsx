import React from "react";
import { redirect } from "next/navigation";
import AdminLayout from "@/components/admin/AdminLayout";
import prisma from "@/lib/prisma";
import { getAuthenticatedAdmin } from "@/lib/auth";
import { History, Shield, CheckCircle2, XCircle, AlertCircle, Clock } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminAuditLogPage() {
  const admin = await getAuthenticatedAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const logs = await prisma.paymentAuditLog.findMany({
    orderBy: { timestamp: "desc" },
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            Administrator Audit Trail
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Immutable log of all payment verification, registration status transitions, and administrative edits.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3.5">Timestamp</th>
                  <th className="px-4 py-3.5">Admin User</th>
                  <th className="px-4 py-3.5">Action</th>
                  <th className="px-4 py-3.5">Participant / Reg Ref</th>
                  <th className="px-4 py-3.5">Status Transition</th>
                  <th className="px-4 py-3.5">Audit Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {logs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-slate-500">
                      No admin actions logged yet. Actions like approving or rejecting payments will be recorded here.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-800/20 transition-colors">
                      <td className="px-4 py-3.5 whitespace-nowrap text-slate-400 font-mono text-[11px]">
                        {new Date(log.timestamp).toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "medium",
                        })}
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap font-medium text-white">
                        <span className="flex items-center gap-1.5">
                          <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          {log.adminEmail}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 whitespace-nowrap">
                        {log.action === "PAYMENT_APPROVED" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Approved
                          </span>
                        )}
                        {log.action === "PAYMENT_REJECTED" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                        )}
                        {log.action === "REGISTRATION_CANCELLED" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-slate-700 text-slate-300 text-[10px] font-bold inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3" />
                            Cancelled
                          </span>
                        )}
                        {log.action === "DETAILS_UPDATED" && (
                          <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-[10px] font-bold">
                            Updated
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3.5">
                        <span className="font-bold text-white block">
                          {log.registration?.participant?.fullName || "Participant"}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">
                          {log.registration?.bibNumber || log.registration?.registrationNumber || log.registrationId.slice(0, 8)}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-400 text-[11px] whitespace-nowrap">
                        <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded text-slate-400">
                          {log.oldRegStatus || "PENDING"}
                        </span>{" "}
                        →{" "}
                        <span className="font-mono bg-slate-950 px-1.5 py-0.5 rounded font-bold text-white">
                          {log.newRegStatus || "CONFIRMED"}
                        </span>
                      </td>

                      <td className="px-4 py-3.5 text-slate-300 text-[11px] max-w-xs truncate" title={log.notes || ""}>
                        {log.notes || "—"}
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
