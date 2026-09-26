"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  User,
  Phone,
  Mail,
  Calendar,
  MapPin,
  HeartHandshake,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Loader2,
  ChevronLeft,
  Gift,
  Sparkles,
  ExternalLink,
} from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();

  // Multi-step: 1 = Fill Form, 2 = Review Details
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [duplicateInfo, setDuplicateInfo] = useState<{
    message: string;
    registrationId: string;
  } | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    fullName: "",
    mobile: "",
    email: "",
    dob: "",
    gender: "Male",
    city: "",
    state: "",
    emergencyName: "",
    emergencyMobile: "",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field on input
    if (fieldErrors[name]) {
      setFieldErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};

    if (!formData.fullName.trim() || formData.fullName.trim().length < 2) {
      errors.fullName = "Full name must be at least 2 characters.";
    }

    if (!/^[6-9]\d{9}$/.test(formData.mobile.trim())) {
      errors.mobile = "Please enter a valid 10-digit Indian mobile number.";
    }

    if (
      !formData.email.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())
    ) {
      errors.email = "Please enter a valid email address.";
    }

    if (!formData.dob) {
      errors.dob = "Date of birth is required.";
    } else {
      const birthDate = new Date(formData.dob);
      const ageDifMs = Date.now() - birthDate.getTime();
      const ageDate = new Date(ageDifMs);
      const age = Math.abs(ageDate.getUTCFullYear() - 1970);
      if (age < 12) {
        errors.dob = "Participants must be at least 12 years of age.";
      }
    }

    if (!formData.city.trim()) errors.city = "City is required.";
    if (!formData.state.trim()) errors.state = "State is required.";

    // Emergency contact details are optional
    if (formData.emergencyMobile.trim()) {
      if (!/^[6-9]\d{9}$/.test(formData.emergencyMobile.trim())) {
        errors.emergencyMobile = "Enter a valid 10-digit emergency contact number.";
      } else if (formData.emergencyMobile.trim() === formData.mobile.trim()) {
        errors.emergencyMobile = "Emergency contact should be a different number from your mobile.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setDuplicateInfo(null);
    if (validateStep1()) {
      setStep(2);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleFinalSubmit = async () => {
    setLoading(true);
    setErrorMessage(null);
    setDuplicateInfo(null);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 409 && result.duplicate) {
          setDuplicateInfo({
            message: result.message || "You are already registered for this event.",
            registrationId: result.registrationId,
          });
          setStep(1);
          return;
        }

        if (result.details) {
          const formatted: Record<string, string> = {};
          for (const key in result.details) {
            formatted[key] = result.details[key][0];
          }
          setFieldErrors(formatted);
          setStep(1);
        }

        setErrorMessage(
          result.error || result.message || "Failed to submit registration. Please check fields."
        );
        return;
      }

      // Success: redirect directly to the PhonePe payment page for this registration
      router.push(`/payment/${result.registrationId}`);
    } catch (err) {
      console.error(err);
      setErrorMessage("Network error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col text-slate-100">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Step Indicator */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-slate-800 -z-10" />
            <div
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1 athletic-gradient -z-10 transition-all duration-300"
              style={{ width: step === 1 ? "50%" : "100%" }}
            />

            <div className="flex items-center gap-3 bg-[#0b0f19] pr-4">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  step >= 1
                    ? "athletic-gradient text-white shadow-lg shadow-orange-500/25"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                1
              </div>
              <span className="text-sm font-bold text-white hidden sm:inline">
                Participant Details
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[#0b0f19] px-4">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm ${
                  step === 2
                    ? "athletic-gradient text-white shadow-lg shadow-orange-500/25"
                    : "bg-slate-800 text-slate-400"
                }`}
              >
                2
              </div>
              <span className="text-sm font-bold text-white hidden sm:inline">
                Review &amp; Confirm
              </span>
            </div>

            <div className="flex items-center gap-3 bg-[#0b0f19] pl-4">
              <div className="w-9 h-9 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center font-bold text-sm">
                3
              </div>
              <span className="text-sm font-bold text-slate-500 hidden sm:inline">
                PhonePe Payment
              </span>
            </div>
          </div>
        </div>

        {/* Duplicate Registration Banner */}
        {duplicateInfo && (
          <div className="max-w-3xl mx-auto mb-8 bg-amber-500/10 border-2 border-amber-500/40 rounded-2xl p-6 text-slate-200 shadow-xl">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white">Already Registered!</h3>
                <p className="text-sm text-slate-300">{duplicateInfo.message}</p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <Link
                    href={`/payment/${duplicateInfo.registrationId}`}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg athletic-gradient text-xs font-bold text-white shadow-md hover:opacity-95"
                  >
                    Complete Payment for this Registration
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <Link
                    href="/lookup"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300"
                  >
                    Check My Registration Status
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Generic Error Banner */}
        {errorMessage && (
          <div className="max-w-3xl mx-auto mb-8 bg-rose-500/10 border border-rose-500/40 rounded-2xl p-4 text-rose-300 text-sm flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          {/* Main Form Area */}
          <div className="lg:col-span-8">
            {step === 1 ? (
              <form
                onSubmit={handleProceedToReview}
                className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8"
              >
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    पर्यावरण मैराथन — 5 KM Registration
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Fill out the required information below to reserve your runner slot for the 5 KM Paryavaran Marathon.
                  </p>
                </div>

                {/* Section 1: Personal Details */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 border-b border-slate-800 pb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personal Information
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                        Full Name (as per ID) <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="e.g. Rahul Sharma"
                        className={`w-full bg-slate-950 border ${
                          fieldErrors.fullName ? "border-rose-500" : "border-slate-800"
                        } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                      {fieldErrors.fullName && (
                        <p className="text-xs text-rose-400 mt-1">{fieldErrors.fullName}</p>
                      )}
                    </div>

                    {/* Mobile Number */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                        Mobile Number <span className="text-orange-500">*</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="mobile"
                          maxLength={10}
                          value={formData.mobile}
                          onChange={handleInputChange}
                          placeholder="9876543210"
                          className={`w-full bg-slate-950 border ${
                            fieldErrors.mobile ? "border-rose-500" : "border-slate-800"
                          } rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors`}
                        />
                      </div>
                      {fieldErrors.mobile && (
                        <p className="text-xs text-rose-400 mt-1">{fieldErrors.mobile}</p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                        Email Address <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="rahul@example.com"
                        className={`w-full bg-slate-950 border ${
                          fieldErrors.email ? "border-rose-500" : "border-slate-800"
                        } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                      {fieldErrors.email && (
                        <p className="text-xs text-rose-400 mt-1">{fieldErrors.email}</p>
                      )}
                    </div>

                    {/* DOB */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                        Date of Birth <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleInputChange}
                        className={`w-full bg-slate-950 border ${
                          fieldErrors.dob ? "border-rose-500" : "border-slate-800"
                        } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                      {fieldErrors.dob && (
                        <p className="text-xs text-rose-400 mt-1">{fieldErrors.dob}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                        Gender <span className="text-orange-500">*</span>
                      </label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-orange-500 transition-colors"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                        City <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Mumbai"
                        className={`w-full bg-slate-950 border ${
                          fieldErrors.city ? "border-rose-500" : "border-slate-800"
                        } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                      {fieldErrors.city && (
                        <p className="text-xs text-rose-400 mt-1">{fieldErrors.city}</p>
                      )}
                    </div>

                    {/* State */}
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                        State <span className="text-orange-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        placeholder="e.g. Maharashtra"
                        className={`w-full bg-slate-950 border ${
                          fieldErrors.state ? "border-rose-500" : "border-slate-800"
                        } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                      {fieldErrors.state && (
                        <p className="text-xs text-rose-400 mt-1">{fieldErrors.state}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Section 2: Emergency Contact (Optional) */}
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-orange-400 border-b border-slate-800 pb-2 flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <HeartHandshake className="w-4 h-4" />
                      Emergency Contact Details
                    </span>
                    <span className="text-[10px] text-slate-500 font-normal lowercase tracking-normal">
                      (optional)
                    </span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                        Emergency Contact Name <span className="text-slate-500 text-[10px] font-normal lowercase">(optional)</span>
                      </label>
                      <input
                        type="text"
                        name="emergencyName"
                        value={formData.emergencyName}
                        onChange={handleInputChange}
                        placeholder="e.g. Relative / Friend name"
                        className={`w-full bg-slate-950 border ${
                          fieldErrors.emergencyName ? "border-rose-500" : "border-slate-800"
                        } rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors`}
                      />
                      {fieldErrors.emergencyName && (
                        <p className="text-xs text-rose-400 mt-1">
                          {fieldErrors.emergencyName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-slate-300 mb-1.5">
                        Emergency Contact Phone <span className="text-slate-500 text-[10px] font-normal lowercase">(optional)</span>
                      </label>
                      <div className="relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500">
                          +91
                        </span>
                        <input
                          type="tel"
                          name="emergencyMobile"
                          maxLength={10}
                          value={formData.emergencyMobile}
                          onChange={handleInputChange}
                          placeholder="9870000000"
                          className={`w-full bg-slate-950 border ${
                            fieldErrors.emergencyMobile ? "border-rose-500" : "border-slate-800"
                          } rounded-xl pl-12 pr-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-orange-500 transition-colors`}
                        />
                      </div>
                      {fieldErrors.emergencyMobile && (
                        <p className="text-xs text-rose-400 mt-1">
                          {fieldErrors.emergencyMobile}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit button */}
                <div className="pt-4 border-t border-slate-800 flex justify-end">
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl athletic-gradient text-white font-extrabold text-sm shadow-xl shadow-orange-600/30 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <span>Proceed to Review</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            ) : (
              /* Step 2: Review Details */
              <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    Review Your Registration
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">
                    Please double-check your details before proceeding to PhonePe payment.
                  </p>
                </div>

                {/* Review Cards */}
                <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-6 space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-500 font-semibold uppercase block text-[11px]">
                        Full Name
                      </span>
                      <span className="text-white font-bold text-base">{formData.fullName}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-semibold uppercase block text-[11px]">
                        Mobile Number
                      </span>
                      <span className="text-white font-bold text-base">+91 {formData.mobile}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-semibold uppercase block text-[11px]">
                        Email Address
                      </span>
                      <span className="text-white font-bold">{formData.email}</span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-semibold uppercase block text-[11px]">
                        Date of Birth &amp; Gender
                      </span>
                      <span className="text-white font-bold">
                        {formData.dob} ({formData.gender})
                      </span>
                    </div>

                    <div>
                      <span className="text-slate-500 font-semibold uppercase block text-[11px]">
                        City &amp; State
                      </span>
                      <span className="text-white font-bold">
                        {formData.city}, {formData.state}
                      </span>
                    </div>

                    <div className="sm:col-span-2 pt-2 border-t border-slate-800">
                      <span className="text-slate-500 font-semibold uppercase block text-[11px]">
                        Emergency Contact
                      </span>
                      <span className="text-white font-bold">
                        {formData.emergencyName.trim() || formData.emergencyMobile.trim() ? (
                          <>
                            {formData.emergencyName.trim() || "Contact"}
                            {formData.emergencyMobile.trim() && ` (+91 ${formData.emergencyMobile.trim()})`}
                          </>
                        ) : (
                          <span className="text-slate-400 font-normal">Not provided (Optional)</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Declarations */}
                <div className="space-y-3 bg-slate-950/60 p-4 rounded-xl border border-slate-800 text-xs text-slate-400">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      I declare that I am physically fit and trained for distance running.
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>
                      I understand that registration requires payment verification via PhonePe QR.
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-300 font-bold text-xs hover:bg-slate-700"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Edit Information
                  </button>

                  <button
                    type="button"
                    onClick={handleFinalSubmit}
                    disabled={loading}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl athletic-gradient text-white font-extrabold text-sm shadow-xl shadow-orange-600/30 hover:opacity-95 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing Registration...</span>
                      </>
                    ) : (
                      <>
                        <span>Confirm &amp; Proceed to PhonePe Payment</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar: Registration Summary */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl sticky top-28 space-y-6">
              <h3 className="text-base font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
                Event Summary
              </h3>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Race Distance</span>
                  <span className="font-bold text-white text-sm">5 KM Timed Run</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Flag-off Time</span>
                  <span className="font-bold text-white">06:00 AM IST, 27 Sep 2026</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Venue</span>
                  <div className="text-right max-w-[200px]">
                    <span className="font-bold text-white text-xs block">
                      राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी
                    </span>
                    <a
                      href="https://www.google.com/maps/place/Saurabh+super+store/@25.8315539,85.8138031,13.14z/data=!4m14!1m7!3m6!1s0x39ed910063c15091:0x2892b03bad3d7306!2sSaurabh+super+store!8m2!3d25.8256946!4d85.8242428!16s%2Fg%2F11zx46dyfv!3m5!1s0x39ed910063c15091:0x2892b03bad3d7306!8m2!3d25.8256946!4d85.8242428!16s%2Fg%2F11zx46dyfv?entry=ttu&g_ep=EgoyMDI2MDkyMy4wIKXMDSoASAFQAw%3D%3D"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 underline text-[10px] font-semibold inline-flex items-center gap-1"
                    >
                      <span>Google Location 📍</span>
                    </a>
                  </div>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-slate-800">
                  <span className="text-slate-400">Awards &amp; Prizes</span>
                  <span className="font-bold text-emerald-400">Top 10 Prizes • Top 30 Medals</span>
                </div>
              </div>

              {/* Fee Box */}
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800/80">
                <div className="text-slate-400 text-xs font-semibold mb-1">Registration Fee</div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black text-white">₹99</span>
                  <span className="text-[11px] text-slate-500 font-medium">(All taxes included)</span>
                </div>
              </div>

              {/* Special Participant Bonus: Sanatan Dham App */}
              <div className="bg-gradient-to-br from-amber-500/15 via-slate-950 to-emerald-950/30 p-4 rounded-2xl border border-amber-500/40 space-y-2">
                <div className="flex items-center gap-1.5 text-amber-300 text-[11px] font-black uppercase tracking-wider">
                  <Gift className="w-3.5 h-3.5 text-amber-400" />
                  <span>Free Bonus Included</span>
                </div>
                <div className="text-xs font-bold text-white leading-snug">
                  1 Month Free Service — सनातन धाम App
                </div>
                <p className="text-[11px] text-slate-300 leading-relaxed">
                  प्रत्येक पंजीकृत धावक को सनातन धाम ऐप की 1 महीने की सेवा मुफ्त मिलेगी।
                </p>
                <a
                  href="https://play.google.com/store/apps/details?id=com.aiwazir.sanatan.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 hover:text-amber-300 underline underline-offset-2 pt-0.5"
                >
                  <span>Download on Google Play</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="text-[11px] text-slate-400 flex items-center gap-2 pt-2 border-t border-slate-800">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Zero convenience fees. Manual PhonePe QR verification.</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
