import React from "react";
import Link from "next/link";
import { Flame, Mail, Phone, MapPin, ShieldAlert, Award } from "lucide-react";

interface FooterProps {
  eventName?: string;
  organizerName?: string;
  contactEmail?: string;
  contactPhone?: string;
  venue?: string;
}

export default function Footer({
  eventName = "10 KM City Marathon 2026",
  organizerName = "Marathon Sports Association",
  contactEmail = "support@marathon10k.org",
  contactPhone = "+91 98765 43210",
  venue = "Central Stadium Arena, City Center",
}: FooterProps) {
  return (
    <footer className="bg-[#070a12] border-t border-slate-800/80 text-slate-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Mission */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl athletic-gradient flex items-center justify-center text-white">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-lg font-black text-white">{eventName}</span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400">
              A premier 10 KM road race organized to foster athletic excellence, community wellness,
              and endurance running. Open to all amateur and experienced runners.
            </p>
            <div className="flex items-center gap-2 text-xs text-orange-400 font-semibold pt-1">
              <Award className="w-4 h-4" />
              <span>Certified 10 KM Distance &amp; Timing</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/register" className="hover:text-orange-400 transition-colors">
                  Online Registration
                </Link>
              </li>
              <li>
                <Link href="/lookup" className="hover:text-orange-400 transition-colors">
                  Check My Registration
                </Link>
              </li>
              <li>
                <Link href="/#route" className="hover:text-orange-400 transition-colors">
                  10 KM Race Route &amp; Aid Stations
                </Link>
              </li>
              <li>
                <Link href="/#benefits" className="hover:text-orange-400 transition-colors">
                  Race Kit &amp; Finisher Medal
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-orange-400 transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-slate-500 hover:text-slate-300 transition-colors">
                  Race Director Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Race Day Helpdesk */}
          <div>
            <h4 className="text-white font-bold text-sm tracking-wider uppercase mb-4">
              Race Helpdesk
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
                <span>{venue}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{contactPhone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <span>{contactEmail}</span>
              </li>
            </ul>
          </div>

          {/* Safety Advisory */}
          <div className="space-y-3 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase">
              <ShieldAlert className="w-4 h-4" />
              Medical Advisory
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Runners must ensure adequate hydration and medical fitness prior to race day. Fully
              equipped ambulances and medical aid stations will be present along the entire route.
            </p>
            <p className="text-[10px] text-slate-500">
              Organized by {organizerName}. All rights reserved.
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} {eventName}. Isolated Marathon Registration Portal.</p>
          <div className="flex space-x-6">
            <span>Manual PhonePe Verification Active</span>
            <span>Dedicated Database</span>
            <span>Encrypted Submissions</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
