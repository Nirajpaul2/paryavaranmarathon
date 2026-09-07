"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the PhonePe QR payment and registration verification work?",
      a: "When you fill out the registration form, you will be taken to our secure payment screen displaying the official PhonePe Merchant QR Code. Scan the QR code using PhonePe (or any UPI app like GPay/Paytm) to pay the registration fee. Once paid, simply enter your 12-digit UTR/Transaction reference number and upload the payment screenshot. Our race team verifies the transaction against the merchant ledger and approves your registration, immediately generating your official Bib Number.",
    },
    {
      q: "How long does it take for my registration to get confirmed?",
      a: "Verifications are usually processed within 2 to 6 hours during working hours (9 AM - 9 PM). You can check your live registration status anytime by clicking 'Check My Registration' and entering your mobile number or email. Once verified, your status changes to CONFIRMED and your printable Digital Registration Card becomes available.",
    },
    {
      q: "When and where do I collect my Race Kit and Bib?",
      a: "The Marathon Bib Expo is held 2 days prior to race day (Friday and Saturday, 10:00 AM – 7:00 PM) at the Central Stadium Convention Hall. Bring your Digital Registration Card (on phone or printed) and a valid photo ID to collect your Bib, safety pins, and Technical Dri-FIT T-shirt.",
    },
    {
      q: "Can someone else collect my Bib on my behalf?",
      a: "Yes. An authorized representative may collect your kit by presenting: (1) A digital or printed copy of your Confirmed Registration Card, (2) A copy of the participant's photo ID, and (3) An authorization letter or SMS from the participant's registered mobile number.",
    },
    {
      q: "Is there a bag deposit / baggage drop counter at the venue?",
      a: "Yes, free secure baggage holding is provided inside the stadium warm-up area. Runners will be given a matching baggage tag tied to their Bib number. Please do not store valuable electronics or cash in the baggage bags.",
    },
    {
      q: "Can I transfer my registration or request a refund?",
      a: "Registration fees are strictly non-refundable as procurement for medals, timing chips, and t-shirts is finalized immediately. Bib transfers without official permission are prohibited for safety and emergency tracking.",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#0d1322] border-t border-slate-800/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Find quick answers to common queries regarding registration, PhonePe payments, and race day.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-colors"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-base font-bold text-white leading-snug">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-orange-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-slate-300 text-xs sm:text-sm leading-relaxed border-t border-slate-800/60">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
