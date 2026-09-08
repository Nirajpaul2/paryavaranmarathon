"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  AlertTriangle,
  UploadCloud,
  FileCheck,
  ArrowRight,
  Loader2,
  Clock,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";

interface PaymentFormClientProps {
  registrationId: string;
  participantName: string;
  fee: number;
  currentStatus: string; // PENDING, VERIFIED, REJECTED
  existingTxId?: string;
  rejectionReason?: string | null;
}

export default function PaymentFormClient({
  registrationId,
  participantName,
  fee,
  currentStatus: initialStatus,
  existingTxId = "",
  rejectionReason = null,
}: PaymentFormClientProps) {
  const [transactionId, setTransactionId] = useState(existingTxId);
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(Boolean(existingTxId && initialStatus === "PENDING"));

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    // Validate size (< 5MB)
    if (selected.size > 5 * 1024 * 1024) {
      setErrorMessage("File size must be under 5 MB");
      return;
    }

    setFile(selected);
    setErrorMessage(null);

    // Generate local preview URL
    const reader = new FileReader();
    reader.onloadend = () => {
      setFilePreview(reader.result as string);
    };
    reader.readAsDataURL(selected);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!transactionId.trim() || transactionId.trim().length < 6) {
      setErrorMessage("Please enter a valid Transaction / UTR reference ID (at least 6 characters).");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("registrationId", registrationId);
      formData.append("transactionId", transactionId.trim());
      if (file) {
        formData.append("screenshot", file);
      }

      const res = await fetch("/api/payment", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMessage(data.error || "Failed to submit payment details.");
        return;
      }

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setErrorMessage("A network error occurred while submitting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto">
          <Clock className="w-7 h-7 animate-pulse" />
        </div>

        <div className="text-center space-y-2">
          <span className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold uppercase tracking-wider">
            Payment Status: Pending Verification
          </span>
          <h2 className="text-2xl font-black text-white uppercase">Details Submitted!</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-md mx-auto">
            Thank you, <strong className="text-white">{participantName}</strong>. Your payment
            reference <code className="bg-slate-950 px-2 py-0.5 rounded text-orange-400 font-mono">{transactionId}</code>{" "}
            has been received.
          </p>
        </div>

        {/* Verification explanation card */}
        <div className="bg-slate-950 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-3 text-xs text-slate-400">
          <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            What Happens Next?
          </div>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
            <li>Our race operations team checks the UTR against the PhonePe settlement report.</li>
            <li>Upon verification, your registration is confirmed.</li>
            <li>Your official Marathon Bib Number and Digital Registration Card will be issued.</li>
          </ol>
        </div>

        <div className="pt-2 space-y-3">
          <Link
            href="/lookup"
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl athletic-gradient text-white text-sm font-bold shadow-lg shadow-orange-600/25 hover:opacity-95"
          >
            <span>Check My Registration Status</span>
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            type="button"
            onClick={() => setSubmitted(false)}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Update or re-submit UTR reference
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
          Submit Payment Reference
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          After scanning the QR code and completing payment of ₹{fee} on PhonePe, fill out the
          details below.
        </p>
      </div>

      {/* Rejection Alert if applicable */}
      {initialStatus === "REJECTED" && (
        <div className="bg-rose-500/10 border border-rose-500/40 rounded-2xl p-4 text-xs text-rose-300 space-y-1">
          <div className="flex items-center gap-2 font-bold text-rose-400 uppercase">
            <AlertTriangle className="w-4 h-4" />
            Previous Payment Rejected
          </div>
          <p>
            Reason: <strong>{rejectionReason || "Verification failed. Please re-check your UTR."}</strong>
          </p>
          <p className="text-slate-400 pt-1">
            Please enter the correct PhonePe Transaction ID / UTR and upload the clear screenshot receipt.
          </p>
        </div>
      )}

      {errorMessage && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Transaction ID / UTR */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
            UPI / PhonePe / GPay / Paytm UTR Reference ID <span className="text-orange-500">*</span>
          </label>
          <input
            type="text"
            required
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            placeholder="e.g. 12-digit UTR (e.g. 423589102934) or PhonePe Txn ID"
            className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white font-mono placeholder-slate-600 uppercase focus:outline-none focus:border-orange-500 transition-colors"
          />
          <p className="text-[11px] text-slate-500 mt-1">
            Found on the UPI payment success receipt (PhonePe, Google Pay, Paytm, or BHIM).
          </p>
        </div>

        {/* Screenshot Upload */}
        <div>
          <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
            Upload Payment Screenshot <span className="text-slate-500 font-normal">(Optional but recommended)</span>
          </label>

          <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-orange-500/60 rounded-2xl p-6 cursor-pointer bg-slate-950/60 hover:bg-slate-950 transition-all text-center">
            {filePreview ? (
              <div className="space-y-2">
                <img
                  src={filePreview}
                  alt="Payment receipt preview"
                  className="max-h-36 mx-auto rounded-lg border border-slate-700 object-contain shadow-md"
                />
                <span className="text-xs text-emerald-400 font-semibold flex items-center justify-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" />
                  {file?.name}
                </span>
                <span className="text-[10px] text-slate-400 block">Click to change screenshot</span>
              </div>
            ) : (
              <div className="space-y-2">
                <UploadCloud className="w-8 h-8 text-orange-400 mx-auto" />
                <span className="text-xs text-slate-300 font-semibold block">
                  Click or drag payment screenshot here
                </span>
                <span className="text-[11px] text-slate-500 block">
                  Supports JPG, PNG, WebP (Max 5 MB)
                </span>
              </div>
            )}
            <input
              type="file"
              accept="image/png, image/jpeg, image/webp"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {/* "I Have Paid" Action Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-xl athletic-gradient text-white text-base font-extrabold shadow-xl shadow-orange-600/30 hover:opacity-95 active:scale-[0.98] disabled:opacity-50 transition-all"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Submitting Payment Details...</span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-5 h-5" />
              <span>I Have Paid — Submit for Verification</span>
            </>
          )}
        </button>
      </form>

      <div className="text-[11px] text-slate-500 leading-relaxed border-t border-slate-800 pt-4">
        <strong>Privacy Note:</strong> Uploaded payment proof images are stored securely in dedicated
        private storage and accessible only to authorized race directors for verification purposes.
      </div>
    </div>
  );
}
