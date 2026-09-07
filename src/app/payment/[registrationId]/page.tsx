import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import prisma from "@/lib/prisma";
import PaymentFormClient from "./PaymentFormClient";
import { ShieldCheck, QrCode, Clock, Info, AlertTriangle } from "lucide-react";

interface PaymentPageProps {
  params: {
    registrationId: string;
  };
}

export default async function PaymentPage({ params }: PaymentPageProps) {
  const { registrationId } = params;

  const registration = await prisma.registration.findUnique({
    where: { id: registrationId },
    include: {
      participant: true,
      payment: true,
    },
  });

  if (!registration || !registration.participant) {
    notFound();
  }

  const settings = await prisma.eventSetting.findFirst();
  const fee = registration.payment?.amount || settings?.registrationFee || 100;
  const qrImage = settings?.phonePeQrPath || "/images/phonepe-qr.svg";
  const upiId = settings?.phonePeUpiId || "marathon10k@phonepe";

  return (
    <div className="min-h-screen bg-[#0b0f19] flex flex-col text-slate-100">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Verification Alert Banner */}
        <div className="mb-8 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4 sm:p-5 text-slate-200 flex items-start gap-3.5 shadow-lg">
          <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm space-y-1">
            <span className="font-bold text-amber-300 block">
              Official Manual Payment Verification Notice
            </span>
            <p className="text-slate-300">
              Your payment will be manually verified by the marathon race director against our
              PhonePe merchant settlement records. Your registration status will remain{" "}
              <strong className="text-amber-300">PENDING</strong> until reviewed and approved.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: PhonePe QR Scanner Card */}
          <div className="lg:col-span-6 space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl text-center space-y-6">
              {/* Fee Announcement */}
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-orange-400 block mb-1">
                  Registration Fee
                </span>
                <div className="text-4xl sm:text-5xl font-black text-white">
                  ₹{fee}
                </div>
                <span className="text-[11px] text-slate-400 block mt-1">
                  Participant: <strong className="text-white">{registration.participant.fullName}</strong>
                </span>
              </div>

              {/* Prominent Instruction */}
              <div className="bg-[#5f259f]/15 border border-[#5f259f]/40 py-2.5 px-4 rounded-xl">
                <span className="text-sm font-black text-purple-300 uppercase tracking-wide flex items-center justify-center gap-2">
                  <QrCode className="w-4 h-4 text-purple-400" />
                  Scan &amp; Pay Using PhonePe App
                </span>
                <span className="text-[11px] text-purple-200/80 block mt-0.5">
                  Or scan with Google Pay, Paytm, BHIM, or any UPI app
                </span>
              </div>

              {/* Scannable PhonePe QR Image Container */}
              <div className="relative mx-auto max-w-[320px] bg-white p-4 rounded-2xl shadow-2xl border-4 border-purple-500/20 group">
                <Image
                  src={qrImage}
                  alt="Official PhonePe QR Code"
                  width={300}
                  height={390}
                  className="w-full h-auto object-contain rounded-xl"
                  priority
                />
              </div>

              {/* Merchant UPI ID display */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-400 flex items-center justify-between">
                <span>Merchant UPI ID:</span>
                <span className="font-mono font-bold text-orange-400 select-all">{upiId}</span>
              </div>

              <p className="text-[11px] text-slate-500">
                Tip: Keep the PhonePe receipt open or copy the 12-digit UTR/Ref number to submit
                in the form.
              </p>
            </div>
          </div>

          {/* Right Column: Payment Submission Form */}
          <div className="lg:col-span-6">
            <PaymentFormClient
              registrationId={registration.id}
              participantName={registration.participant.fullName}
              fee={fee}
              currentStatus={registration.payment?.status || "PENDING"}
              existingTxId={registration.payment?.transactionId || ""}
              rejectionReason={registration.payment?.rejectionReason}
            />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
