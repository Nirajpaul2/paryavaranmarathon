"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Settings,
  QrCode,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Save,
  Clock,
  Calendar,
  IndianRupee,
  Users,
} from "lucide-react";

interface EventSettingData {
  id?: string;
  eventName: string;
  eventTagline: string;
  eventDate: string;
  eventTime: string;
  reportingTime: string;
  venue: string;
  distance: string;
  registrationFee: number;
  registrationDeadline: string | Date;
  participantCapacity: number;
  contactEmail: string;
  contactPhone: string;
  organizerName: string;
  phonePeQrPath: string;
  phonePeUpiId: string;
  bibPrefix: string;
  regPrefix: string;
}

export default function SettingsClient({
  initialSettings,
}: {
  initialSettings: EventSettingData | null;
}) {
  const router = useRouter();

  const [formData, setFormData] = useState({
    eventName: initialSettings?.eventName || "10 KM City Marathon 2026",
    eventTagline:
      initialSettings?.eventTagline || "Run 10 KM. Challenge Yourself. Finish Strong.",
    eventDate: initialSettings?.eventDate || "Sunday, October 18, 2026",
    eventTime: initialSettings?.eventTime || "05:30 AM IST",
    reportingTime: initialSettings?.reportingTime || "04:45 AM IST",
    venue: initialSettings?.venue || "Central Stadium Arena & Sports Complex, City Center",
    distance: initialSettings?.distance || "10 KM",
    registrationFee: initialSettings?.registrationFee || 100,
    registrationDeadline: initialSettings?.registrationDeadline
      ? new Date(initialSettings.registrationDeadline).toISOString().slice(0, 16)
      : "2026-10-15T23:59",
    participantCapacity: initialSettings?.participantCapacity || 1500,
    contactEmail: initialSettings?.contactEmail || "support@marathon10k.org",
    contactPhone: initialSettings?.contactPhone || "+91 98765 43210",
    organizerName: initialSettings?.organizerName || "Marathon Sports Association",
    phonePeUpiId: initialSettings?.phonePeUpiId || "marathon10k@phonepe",
    bibPrefix: initialSettings?.bibPrefix || "BIB-",
    regPrefix: initialSettings?.regPrefix || "RUN10K-",
  });

  const [qrPath, setQrPath] = useState(
    initialSettings?.phonePeQrPath || "/images/phonepe-qr.svg"
  );
  const [qrFile, setQrFile] = useState<File | null>(null);
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(
    null
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: "error", message: data.error || "Failed to update settings" });
        return;
      }

      setFeedback({ type: "success", message: "Event settings saved and live on website." });
      router.refresh();
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Network error occurred" });
    } finally {
      setLoading(false);
    }
  };

  const handleQrFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setQrFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setQrPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUploadQr = async () => {
    if (!qrFile) return;

    setQrLoading(true);
    setFeedback(null);

    try {
      const body = new FormData();
      body.append("qrFile", qrFile);

      const res = await fetch("/api/admin/settings", {
        method: "POST",
        body,
      });

      const data = await res.json();

      if (!res.ok) {
        setFeedback({ type: "error", message: data.error || "Failed to upload QR code" });
        return;
      }

      setQrPath(data.qrPath);
      setQrPreview(null);
      setQrFile(null);
      setFeedback({
        type: "success",
        message: "Active PhonePe QR code successfully updated and active on payment page!",
      });
      router.refresh();
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", message: "Network error during QR upload" });
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
          Event Settings &amp; PhonePe QR Management
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Configure live marathon details, ticket prices, runner capacity, and update the active
          PhonePe merchant QR code.
        </p>
      </div>

      {feedback && (
        <div
          className={`p-4 rounded-2xl border text-xs font-semibold flex items-center gap-2 ${
            feedback.type === "success"
              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300"
              : "bg-rose-500/10 border-rose-500/40 text-rose-300"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Grid: Left = Settings Form, Right = PhonePe QR Upload */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Settings Form */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-6">
          <form onSubmit={handleSaveSettings} className="space-y-5 text-xs">
            <h2 className="text-sm font-bold uppercase tracking-wider text-orange-400 flex items-center gap-2 border-b border-slate-800 pb-2">
              <Settings className="w-4 h-4" />
              Event Information
            </h2>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Event Name</label>
              <input
                type="text"
                name="eventName"
                required
                value={formData.eventName}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-sm"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">
                Event Headline / Tagline
              </label>
              <input
                type="text"
                name="eventTagline"
                required
                value={formData.eventTagline}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Event Date</label>
                <input
                  type="text"
                  name="eventDate"
                  required
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  placeholder="Sunday, October 18, 2026"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Start / Flag-off Time
                </label>
                <input
                  type="text"
                  name="eventTime"
                  required
                  value={formData.eventTime}
                  onChange={handleInputChange}
                  placeholder="05:30 AM IST"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Reporting Time
                </label>
                <input
                  type="text"
                  name="reportingTime"
                  required
                  value={formData.reportingTime}
                  onChange={handleInputChange}
                  placeholder="04:45 AM IST"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Registration Fee (₹)
                </label>
                <input
                  type="number"
                  name="registrationFee"
                  required
                  value={formData.registrationFee}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Runner Capacity (Limit)
                </label>
                <input
                  type="number"
                  name="participantCapacity"
                  required
                  value={formData.participantCapacity}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Registration Deadline
                </label>
                <input
                  type="datetime-local"
                  name="registrationDeadline"
                  required
                  value={formData.registrationDeadline}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-bold uppercase mb-1">Venue Address</label>
              <input
                type="text"
                name="venue"
                required
                value={formData.venue}
                onChange={handleInputChange}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Contact Email</label>
                <input
                  type="email"
                  name="contactEmail"
                  required
                  value={formData.contactEmail}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">Contact Phone</label>
                <input
                  type="text"
                  name="contactPhone"
                  required
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Bib Number Prefix
                </label>
                <input
                  type="text"
                  name="bibPrefix"
                  required
                  value={formData.bibPrefix}
                  onChange={handleInputChange}
                  placeholder="BIB-"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold uppercase mb-1">
                  Registration ID Prefix
                </label>
                <input
                  type="text"
                  name="regPrefix"
                  required
                  value={formData.regPrefix}
                  onChange={handleInputChange}
                  placeholder="RUN10K-"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white font-mono"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl athletic-gradient text-white text-xs font-bold shadow-lg shadow-orange-600/30 hover:opacity-95 disabled:opacity-50 transition-all"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>Save All Settings</span>
              </button>
            </div>
          </form>
        </div>

        {/* Active PhonePe QR Code Upload & Preview Card */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
            <QrCode className="w-4 h-4 text-orange-400" />
            <h2 className="text-sm font-bold uppercase tracking-wider text-white">
              PhonePe QR Management
            </h2>
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Upload the client&apos;s official PhonePe QR image file here. It will instantly be rendered
            on the payment page for all participants.
          </p>

          {/* Current Active QR Display */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">
              Active PhonePe QR
            </span>
            <div className="relative mx-auto max-w-[200px] bg-white p-2 rounded-xl border border-slate-700 shadow-md">
              <Image
                src={qrPreview || qrPath}
                alt="Active PhonePe QR"
                width={200}
                height={260}
                className="w-full h-auto object-contain rounded-lg"
              />
            </div>
            <span className="text-[10px] text-slate-500 font-mono block truncate">
              {qrPath}
            </span>
          </div>

          {/* File Upload Selector */}
          <div className="space-y-3">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-800 hover:border-orange-500/60 rounded-xl p-4 cursor-pointer bg-slate-950/60 text-center transition-colors">
              <UploadCloud className="w-6 h-6 text-orange-400 mb-1" />
              <span className="text-xs font-semibold text-slate-300">
                {qrFile ? qrFile.name : "Select new PhonePe QR image"}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">PNG, JPG, SVG, WebP</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleQrFileSelect}
                className="hidden"
              />
            </label>

            {qrFile && (
              <button
                type="button"
                onClick={handleUploadQr}
                disabled={qrLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl athletic-gradient text-white text-xs font-bold shadow-md hover:opacity-95 disabled:opacity-50 transition-all"
              >
                {qrLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Uploading QR...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Update Active PhonePe QR</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
