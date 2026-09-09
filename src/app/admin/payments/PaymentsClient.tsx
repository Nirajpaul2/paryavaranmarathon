"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  X,
  AlertTriangle,
  Loader2,
  Filter,
  FileSpreadsheet,
  ExternalLink,
} from "lucide-react";

interface PaymentItem {
  id: string;
  registrationId: string;
  amount: number;
  transactionId: string | null;
  proofPath: string | null;
  proofFileName: string | null;
  status: string;
  rejectionReason: string | null;
  verifiedAt: Date | string | null;
  verifiedBy: string | null;
  createdAt: Date | string;
  registration: {
    id: string;
    registrationNumber: string | null;
    bibNumber: string | null;
    status: string;
    participant: {
      fullName: string;
      mobile: string;
      email: string;
      city: string;
      state: string;
      tshirtSize: string | null;
    };
  };
}

export default function PaymentsClient({
  initialPayments,
}: {
  initialPayments: PaymentItem[];
}) {
  const router = useRouter();
  const [payments, setPayments] = useState<PaymentItem[]>(initialPayments);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("PENDING"); // Default to PENDING for fast triage!

  // Lightbox / Proof View state
  const [selectedProofPaymentId, setSelectedProofPaymentId] = useState<string | null>(null);

  // Reject Modal state
  const [rejectingItem, setRejectingItem] = useState<PaymentItem | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const filteredPayments = payments.filter((p) => {
    // Status Filter
    if (statusFilter !== "ALL" && p.status !== statusFilter) {
      return false;
    }

    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const name = p.registration.participant.fullName.toLowerCase();
      const mobile = p.registration.participant.mobile.toLowerCase();
      const email = p.registration.participant.email.toLowerCase();
      const tx = (p.transactionId || "").toLowerCase();
      const regNum = (p.registration.registrationNumber || "").toLowerCase();
      const bib = (p.registration.bibNumber || "").toLowerCase();

      return (
        name.includes(q) ||
        mobile.includes(q) ||
        email.includes(q) ||
        tx.includes(q) ||
        regNum.includes(q) ||
        bib.includes(q)
      );
    }

    return true;
  });

  const handleApprove = async (item: PaymentItem) => {
    if (
      !confirm(
        `Are you sure you want to approve payment for ${item.registration.participant.fullName}? This will confirm their registration and issue an official Bib number.`
      )
    ) {
      return;
    }

    setActionLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: item.registrationId,
          action: "APPROVE",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: "error", message: data.error || "Approval failed" });
        return;
      }

      const assignedNum = data.bibNumber || data.registrationNumber || "001";

      setFeedback({
        type: "success",
        message: `Payment approved! Participant confirmed with Registration & Bib No. ${assignedNum}.`,
      });

      // Update local state immediately so BIB / REG NO. column updates to the assigned number
      setPayments((prev) =>
        prev.map((p) =>
          p.id === item.id
            ? {
                ...p,
                status: "VERIFIED",
                registration: {
                  ...p.registration,
                  status: "CONFIRMED",
                  bibNumber: assignedNum,
                  registrationNumber: assignedNum,
                },
              }
            : p
        )
      );

      router.refresh();
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Network error during approval" });
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingItem) return;

    if (!rejectionReason.trim() || rejectionReason.trim().length < 3) {
      alert("Please provide a valid rejection reason (minimum 3 characters).");
      return;
    }

    setActionLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          registrationId: rejectingItem.registrationId,
          action: "REJECT",
          rejectionReason: rejectionReason.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: "error", message: data.error || "Rejection failed" });
        return;
      }

      setFeedback({
        type: "success",
        message: `Payment rejected. Participant status updated with reason.`,
      });

      // Update local state
      setPayments((prev) =>
        prev.map((p) =>
          p.id === rejectingItem.id
            ? {
                ...p,
                status: "REJECTED",
                rejectionReason: rejectionReason.trim(),
                registration: {
                  ...p.registration,
                  status: "REJECTED",
                },
              }
            : p
        )
      );

      setRejectingItem(null);
      setRejectionReason("");
      router.refresh();
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Network error during rejection" });
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            PhonePe Payment Verification
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Review participant UTR reference numbers and payment screenshots against your PhonePe
            merchant settlement.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300">
            Total in queue: <strong className="text-orange-400">{filteredPayments.length}</strong>
          </span>
        </div>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/40 text-rose-300"
          }`}
        >
          <span>{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Name, Mobile, UTR..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors"
          />
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs w-full sm:w-auto overflow-x-auto">
          {["PENDING", "VERIFIED", "REJECTED", "ALL"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-colors whitespace-nowrap ${
                statusFilter === st
                  ? "bg-orange-500 text-white shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-4 py-3.5">Participant &amp; Contact</th>
                <th className="px-4 py-3.5">Fee Amount</th>
                <th className="px-4 py-3.5">Transaction ID / UTR</th>
                <th className="px-4 py-3.5">Payment Screenshot</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5">Bib / Reg No.</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-slate-500">
                    No payment records found matching the active filter.
                  </td>
                </tr>
              ) : (
                filteredPayments.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-4 py-4">
                      <span className="font-bold text-white block text-sm">
                        {item.registration.participant.fullName}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {item.registration.participant.mobile} • {item.registration.participant.city}
                      </span>
                    </td>

                    <td className="px-4 py-4 font-bold text-white text-sm">
                      ₹{item.amount}
                    </td>

                    <td className="px-4 py-4">
                      {item.transactionId ? (
                        <span className="font-mono text-xs font-bold text-orange-400 bg-slate-950 px-2 py-1 rounded border border-slate-800 select-all block max-w-fit">
                          {item.transactionId}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic text-[11px]">Not entered yet</span>
                      )}
                      <span className="text-[10px] text-slate-500 block mt-1">
                        {new Date(item.createdAt).toLocaleString("en-IN", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </td>

                    <td className="px-4 py-4">
                      {item.proofPath ? (
                        <button
                          type="button"
                          onClick={() => setSelectedProofPaymentId(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-cyan-400 border border-slate-700 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Proof</span>
                        </button>
                      ) : (
                        <span className="text-slate-500 text-[11px]">No file attached</span>
                      )}
                    </td>

                    <td className="px-4 py-4">
                      {item.status === "VERIFIED" && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Verified
                        </span>
                      )}
                      {item.status === "PENDING" && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Pending Review
                        </span>
                      )}
                      {item.status === "REJECTED" && (
                        <div className="space-y-0.5">
                          <span className="px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1">
                            <XCircle className="w-3 h-3" />
                            Rejected
                          </span>
                          {item.rejectionReason && (
                            <span className="text-[10px] text-rose-400/80 block max-w-xs truncate" title={item.rejectionReason}>
                              {item.rejectionReason}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-4 font-mono text-xs whitespace-nowrap min-w-[110px]">
                      {item.registration.status === "CONFIRMED" && (item.registration.bibNumber || item.registration.registrationNumber) ? (
                        <span className="font-black text-orange-400 block text-sm tracking-wider">
                          {item.registration.bibNumber || item.registration.registrationNumber}
                        </span>
                      ) : (
                        <span className="text-slate-500 italic">Unassigned</span>
                      )}
                    </td>

                    <td className="px-4 py-4 text-right">
                      {item.status === "PENDING" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleApprove(item)}
                            disabled={actionLoading}
                            className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-sm transition-colors disabled:opacity-50"
                          >
                            Approve
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setRejectingItem(item);
                              setRejectionReason("");
                            }}
                            disabled={actionLoading}
                            className="px-3 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-bold transition-colors disabled:opacity-50"
                          >
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-500">
                          {item.verifiedBy ? `By ${item.verifiedBy}` : "Completed"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Lightbox Modal for Payment Screenshot */}
      {selectedProofPaymentId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 space-y-4 shadow-2xl relative animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white uppercase flex items-center gap-2">
                <Eye className="w-4 h-4 text-cyan-400" />
                Protected Payment Screenshot
              </h3>
              <button
                onClick={() => setSelectedProofPaymentId(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-950 rounded-2xl p-2 border border-slate-800 flex items-center justify-center max-h-[70vh] overflow-hidden">
              <img
                src={`/api/admin/proof/${selectedProofPaymentId}`}
                alt="Payment proof screenshot"
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>Secure streaming endpoint: authenticated admins only</span>
              <button
                onClick={() => setSelectedProofPaymentId(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal with Mandatory Reason */}
      {rejectingItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-base font-bold text-rose-400 uppercase flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Reject Payment Submission
              </h3>
              <button
                onClick={() => setRejectingItem(null)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Participant: <strong className="text-white">{rejectingItem.registration.participant.fullName}</strong>
              <br />
              UTR: <span className="font-mono text-orange-400">{rejectingItem.transactionId || "None"}</span>
            </p>

            <form onSubmit={handleConfirmReject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                  Rejection Reason <span className="text-rose-400">*</span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="e.g. UTR not matching our PhonePe statement, invalid screenshot, or incorrect fee amount."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                />
                <span className="text-[11px] text-slate-500 block mt-1">
                  This explanation is recorded in the audit log and displayed to the participant.
                </span>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setRejectingItem(null)}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md disabled:opacity-50 transition-colors"
                >
                  {actionLoading ? "Submitting..." : "Confirm Rejection"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
