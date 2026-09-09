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
  Copy,
  Check,
} from "lucide-react";
import {
  normalizeIndianPhoneNumber,
  formatWhatsAppMessage,
  buildWhatsAppUrl,
} from "@/lib/whatsapp";

function WhatsAppIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="24"
      height="24"
      className={className}
      fill="currentColor"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

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
    whatsappOpenedAt?: Date | string | null;
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

interface EventSettingsProp {
  eventName: string;
  eventDate: string;
  venue: string;
  distance: string;
  organizerName: string;
  whatsappTemplate?: string | null;
}

export default function PaymentsClient({
  initialPayments,
  eventSettings,
}: {
  initialPayments: PaymentItem[];
  eventSettings?: EventSettingsProp;
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

  // WhatsApp Preview Modal state
  const [previewWhatsAppItem, setPreviewWhatsAppItem] = useState<PaymentItem | null>(null);
  const [previewMessageText, setPreviewMessageText] = useState<string>("");
  const [whatsAppPhoneError, setWhatsAppPhoneError] = useState<string | null>(null);
  const [copiedMessage, setCopiedMessage] = useState(false);
  const [whatsAppTrackingLoading, setWhatsAppTrackingLoading] = useState(false);

  const handleInitiateWhatsApp = (item: PaymentItem) => {
    // Validate eligibility
    if (
      item.status !== "VERIFIED" ||
      item.registration.status !== "CONFIRMED" ||
      !(item.registration.registrationNumber || item.registration.bibNumber)
    ) {
      setFeedback({
        type: "error",
        message: "WhatsApp confirmation is only available for verified and confirmed registrations.",
      });
      return;
    }

    // Validate phone number
    const phoneValidation = normalizeIndianPhoneNumber(item.registration.participant.mobile);
    if (!phoneValidation.valid || !phoneValidation.normalized) {
      setFeedback({
        type: "error",
        message:
          phoneValidation.error ||
          "Valid mobile number is required to send WhatsApp confirmation.",
      });
      return;
    }

    const regNum =
      item.registration.registrationNumber || item.registration.bibNumber || "001";
    const bibNum =
      item.registration.bibNumber || item.registration.registrationNumber || "001";

    const msg = formatWhatsAppMessage(eventSettings?.whatsappTemplate, {
      participantName: item.registration.participant.fullName,
      eventName: eventSettings?.eventName || "पर्यावरण मैराथन (Paryavaran Marathon 2026)",
      registrationNumber: regNum,
      bibNumber: bibNum,
      distance: eventSettings?.distance || "5 KM",
      eventDate: eventSettings?.eventDate || "27 सितंबर 2026 (रविवार)",
      venue: eventSettings?.venue || "राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी",
      organizerName: eventSettings?.organizerName || "संस्थापक: नीरज स्टार",
      passLink: `https://paryavaranmarathon.nirajpaul.com/card/${item.registration.id}`,
    });

    setPreviewMessageText(msg);
    setWhatsAppPhoneError(null);
    setCopiedMessage(false);
    setPreviewWhatsAppItem(item);
  };

  const handleConfirmOpenWhatsApp = async () => {
    if (!previewWhatsAppItem) return;

    const phoneValidation = normalizeIndianPhoneNumber(
      previewWhatsAppItem.registration.participant.mobile
    );
    if (!phoneValidation.valid || !phoneValidation.normalized) {
      setWhatsAppPhoneError(
        phoneValidation.error ||
          "Valid mobile number is required to send WhatsApp confirmation."
      );
      return;
    }

    const targetUrl = buildWhatsAppUrl(phoneValidation.normalized, previewMessageText);

    // Open WhatsApp in a new browser tab/window
    window.open(targetUrl, "_blank", "noopener,noreferrer");

    // Track status asynchronously without blocking the user
    try {
      setWhatsAppTrackingLoading(true);
      const res = await fetch("/api/admin/whatsapp-opened", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationId: previewWhatsAppItem.registration.id }),
      });
      const data = await res.json();
      if (data.success) {
        const openedAt = data.whatsappOpenedAt || new Date().toISOString();
        setPayments((prev) =>
          prev.map((p) =>
            p.registration.id === previewWhatsAppItem.registration.id
              ? {
                  ...p,
                  registration: {
                    ...p.registration,
                    whatsappOpenedAt: openedAt,
                  },
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Failed to log WhatsApp opened action:", err);
    } finally {
      setWhatsAppTrackingLoading(false);
      setPreviewWhatsAppItem(null);
    }
  };

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
                <th className="px-4 py-3.5">WhatsApp</th>
                <th className="px-4 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
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

                    <td className="px-4 py-4 whitespace-nowrap">
                      {item.status === "VERIFIED" &&
                      item.registration.status === "CONFIRMED" &&
                      (item.registration.bibNumber || item.registration.registrationNumber) ? (
                        <div className="flex flex-col gap-1 items-start">
                          <button
                            type="button"
                            onClick={() => handleInitiateWhatsApp(item)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shadow-sm ${
                              item.registration.whatsappOpenedAt
                                ? "bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30"
                                : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40"
                            }`}
                            title="Open WhatsApp chat with pre-filled confirmation"
                          >
                            <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                            <span>
                              {item.registration.whatsappOpenedAt ? "WhatsApp Opened" : "Send WhatsApp"}
                            </span>
                          </button>
                          {item.registration.whatsappOpenedAt && (
                            <span className="text-[10px] text-slate-500 block pl-0.5">
                              Link opened
                            </span>
                          )}
                        </div>
                      ) : (
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-500 text-[11px] cursor-not-allowed select-none"
                          title="WhatsApp confirmation is available only after payment is verified and confirmed"
                        >
                          <WhatsAppIcon className="w-3 h-3 opacity-30 fill-current" />
                          <span>
                            {item.status === "PENDING"
                              ? "Disabled (Pending)"
                              : item.status === "REJECTED"
                              ? "Disabled (Rejected)"
                              : "Disabled"}
                          </span>
                        </span>
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

      {/* WhatsApp Confirmation Preview Modal */}
      {previewWhatsAppItem && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <WhatsAppIcon className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">
                    WhatsApp Confirmation
                  </h3>
                  <span className="text-[11px] text-slate-400">
                    Official Click-to-Chat Deep Link
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewWhatsAppItem(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Recipient summary */}
            <div className="bg-slate-950/80 rounded-2xl p-3.5 border border-slate-800 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Participant:</span>
                <span className="font-bold text-white">
                  {previewWhatsAppItem.registration.participant.fullName}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mobile Number:</span>
                <span className="font-mono text-emerald-400 font-bold">
                  {(() => {
                    const res = normalizeIndianPhoneNumber(
                      previewWhatsAppItem.registration.participant.mobile
                    );
                    return res.valid ? `+${res.normalized}` : previewWhatsAppItem.registration.participant.mobile;
                  })()}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">BIB / REG NO.:</span>
                <span className="font-mono font-black text-orange-400 text-sm">
                  {previewWhatsAppItem.registration.registrationNumber ||
                    previewWhatsAppItem.registration.bibNumber ||
                    "001"}
                </span>
              </div>
            </div>

            {whatsAppPhoneError && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{whatsAppPhoneError}</span>
              </div>
            )}

            {/* Message Preview */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold uppercase text-slate-300">
                  Confirmation Message Preview (Editable)
                </label>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(previewMessageText);
                    setCopiedMessage(true);
                    setTimeout(() => setCopiedMessage(false), 2000);
                  }}
                  className="text-[11px] font-semibold text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  {copiedMessage ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Message</span>
                    </>
                  )}
                </button>
              </div>
              <textarea
                rows={10}
                value={previewMessageText}
                onChange={(e) => setPreviewMessageText(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-colors leading-relaxed"
              />
              <p className="text-[11px] text-slate-400 mt-1.5 leading-normal">
                Clicking <strong>Open WhatsApp ↗</strong> will launch WhatsApp with this message pre-filled. You will review and tap Send inside WhatsApp.
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setPreviewWhatsAppItem(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmOpenWhatsApp}
                disabled={whatsAppTrackingLoading}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-950/50 flex items-center gap-2 transition-colors disabled:opacity-50"
              >
                <WhatsAppIcon className="w-4 h-4 fill-current" />
                <span>{whatsAppTrackingLoading ? "Opening..." : "Open WhatsApp ↗"}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
