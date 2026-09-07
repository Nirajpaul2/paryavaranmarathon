import React from "react";
import { Mail, Phone, MapPin, Clock, MessageSquare } from "lucide-react";

interface ContactSectionProps {
  contactEmail: string;
  contactPhone: string;
  venue: string;
  organizerName: string;
}

export default function ContactSection({
  contactEmail,
  contactPhone,
  venue,
  organizerName,
}: ContactSectionProps) {
  return (
    <section id="contact" className="py-20 bg-[#090e1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-bold uppercase tracking-wider mb-3">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Race Helpdesk</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            Contact Event Organizers
          </h2>
          <p className="mt-3 text-slate-400 text-sm sm:text-base leading-relaxed">
            Need assistance with your registration or have questions about race day logistics?
            Our event support team is here to assist.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 border border-orange-500/30 text-orange-400 mx-auto flex items-center justify-center">
              <Phone className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase">Phone Helpline</h3>
            <p className="text-xs text-slate-400">Available Mon-Sat (9 AM - 7 PM)</p>
            <p className="text-sm font-semibold text-white">{contactPhone}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase">Email Support</h3>
            <p className="text-xs text-slate-400">Queries answered within 24 hours</p>
            <p className="text-sm font-semibold text-white break-all">{contactEmail}</p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
              <MapPin className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white uppercase">Race Arena</h3>
            <p className="text-xs text-slate-400">{organizerName}</p>
            <p className="text-sm font-semibold text-white">{venue}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
