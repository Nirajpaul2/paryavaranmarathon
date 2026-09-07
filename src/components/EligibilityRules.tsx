import React from "react";
import { ShieldCheck, AlertCircle, CheckCircle, Info } from "lucide-react";

export default function EligibilityRules() {
  return (
    <section className="py-20 bg-[#0d1322] border-t border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">
            Fair Play &amp; Safety
          </h2>
          <p className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Eligibility &amp; Race Rules
          </p>
          <p className="mt-4 text-slate-400 text-sm sm:text-base leading-relaxed">
            Please review the race regulations and eligibility criteria to ensure a seamless,
            safe experience on marathon day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eligibility Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase">Participant Eligibility</h3>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Age Requirement:</strong> Participants must be 12 years of age or older as of race day.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Medical Fitness:</strong> Participants must be physically fit and medically cleared for distance running.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Valid Government ID:</strong> Must be presented during the pre-race Bib Expo for verification.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Open Category:</strong> Open to all amateur, semi-pro, master athletes, and fitness enthusiasts.
                </span>
              </li>
            </ul>
          </div>

          {/* Important Rules Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase">Important Instructions &amp; Rules</h3>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-slate-300">
              <li className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Bib Position:</strong> The official race bib with the RFID timing chip must be pinned securely on the front of your running chest at all times.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>No Bib Transfer:</strong> Race bibs are strictly non-transferable. Running under someone else&apos;s bib results in instant disqualification.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Cut-off Enforcement:</strong> Runners not crossing the 5 KM mark within 55 minutes will be guided to safety support vehicles.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>Environmental Cleanliness:</strong> Please dispose of water cups and energy gel sachets in the designated green bins along the aid stations.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
