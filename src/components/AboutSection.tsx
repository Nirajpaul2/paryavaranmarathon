import React from "react";
import { Leaf, Heart, Award, Users, CheckCircle } from "lucide-react";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-[#072116] border-t border-emerald-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
              <Leaf className="w-3.5 h-3.5 text-emerald-400" />
              <span>About The Movement</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
              पर्यावरण मैराथन — समस्तीपुर
              <span className="block text-xl sm:text-2xl text-emerald-400 font-bold mt-1">
                “हर कदम प्रकृति के नाम”
              </span>
            </h2>

            <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed">
              <strong>Paryavaran Marathon</strong> is a community-driven 5 KM running event in Malti,
              Samastipur, organized under the visionary leadership of <strong>संस्थापक: नीरज स्टार</strong>.
              It brings together local youth, students, and fitness enthusiasts to promote healthy
              living while raising environmental awareness.
            </p>

            <p className="text-xs sm:text-sm text-emerald-200/80 leading-relaxed">
              Every step taken during this 5 KM run symbolizes our shared commitment to greener
              neighborhoods, cleaner air, and active community wellness. Join hands with your neighbors
              and run for a healthier, greener tomorrow.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#0a2f1e] p-4 rounded-2xl border border-emerald-800/80 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">स्वस्थ जीवनशैली</h4>
                  <p className="text-xs text-emerald-300/70">शारीरिक स्वास्थ्य, सहनशक्ति एवं ऊर्जा</p>
                </div>
              </div>

              <div className="bg-[#0a2f1e] p-4 rounded-2xl border border-emerald-800/80 flex items-start gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">पर्यावरण संरक्षण</h4>
                  <p className="text-xs text-emerald-300/70">हर कदम प्रकृति के नाम, वृक्षारोपण संदेश</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Card / Quote Box */}
          <div className="lg:col-span-5 bg-gradient-to-br from-[#0a2e1d] to-[#0d3b25] border-2 border-emerald-500/30 rounded-3xl p-8 shadow-2xl text-center space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 mx-auto">
              <Leaf className="w-8 h-8" />
            </div>

            <blockquote className="text-xl sm:text-2xl font-black text-white italic leading-snug">
              &quot;आइए, पर्यावरण को सुरक्षित रखें और स्वस्थ जीवनशैली को अपनाएं !&quot;
            </blockquote>

            <div className="pt-4 border-t border-emerald-800/80 space-y-1">
              <span className="text-sm font-black text-emerald-300 block">
                संस्थापक: नीरज स्टार
              </span>
              <span className="text-xs text-emerald-400/80 block">
                पर्यावरण मैराथन • मालती, समस्तीपुर
              </span>
              <span className="text-xs font-mono font-bold text-amber-300 block pt-1">
                हेल्पलाइन: 8340477782
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
