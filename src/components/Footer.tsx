import React from "react";
import Link from "next/link";
import { Leaf, Phone, MapPin, Award, HeartHandshake } from "lucide-react";

interface FooterProps {
  eventName?: string;
  organizerName?: string;
  contactPhone?: string;
  venue?: string;
}

export default function Footer({
  eventName = "Paryavaran Marathon Samastipur",
  organizerName = "संस्थापक: नीरज स्टार",
  contactPhone = "8340477782",
  venue = "राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी",
}: FooterProps) {
  return (
    <footer className="bg-[#03130c] border-t border-emerald-900/80 text-emerald-200/80 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand & Slogan */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl eco-gradient flex items-center justify-center text-white shadow-md shadow-emerald-600/30">
                <Leaf className="w-5 h-5 fill-white/20" />
              </div>
              <div>
                <span className="text-base font-black text-white block">पर्यावरण मैराथन</span>
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                  Paryavaran Marathon • Samastipur
                </span>
              </div>
            </div>

            <p className="text-sm font-bold text-emerald-300 italic">
              “हर कदम प्रकृति के नाम”
            </p>
            <p className="text-xs leading-relaxed text-emerald-200/70">
              आइए, पर्यावरण को सुरक्षित रखें और स्वस्थ जीवनशैली को अपनाएं !
            </p>

            <div className="flex items-center gap-2 text-xs text-amber-300 font-semibold pt-1">
              <Award className="w-4 h-4" />
              <span>साइकिल • रनिंग शूज • जर्सी • मेडल</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
              त्वरित लिंक (Quick Links)
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/register" className="hover:text-emerald-400 transition-colors">
                  ऑनलाइन रजिस्ट्रेशन (₹99)
                </Link>
              </li>
              <li>
                <Link href="/#prizes" className="hover:text-emerald-400 transition-colors text-amber-300">
                  पुरस्कार सूची (Prize List)
                </Link>
              </li>
              <li>
                <Link href="/lookup" className="hover:text-emerald-400 transition-colors">
                  Check My Registration Status
                </Link>
              </li>
              <li>
                <Link href="/#route" className="hover:text-emerald-400 transition-colors">
                  5 KM दौड़ मार्ग (Route)
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="hover:text-emerald-400 transition-colors">
                  FAQs (अक्सर पूछे जाने वाले सवाल)
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="text-emerald-600 hover:text-emerald-400 transition-colors">
                  Race Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Venue */}
          <div>
            <h4 className="text-white font-bold text-xs tracking-wider uppercase mb-4">
              आयोजन विवरण (Event Details)
            </h4>
            <ul className="space-y-3 text-xs">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{venue}, मालती, समस्तीपुर</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <a href={`tel:${contactPhone}`} className="text-white font-bold hover:text-amber-300">
                  {contactPhone}
                </a>
              </li>
              <li className="flex items-center gap-2.5 text-amber-300 font-bold">
                <HeartHandshake className="w-4 h-4 shrink-0" />
                <span>{organizerName}</span>
              </li>
            </ul>
          </div>

          {/* Environmental Mission Pledge */}
          <div className="space-y-3 bg-[#08291b] p-4 rounded-2xl border border-emerald-800/80">
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-bold uppercase">
              <Leaf className="w-4 h-4 text-emerald-400" />
              पर्यावरण संदेश (Eco Pledge)
            </div>
            <p className="text-[11px] leading-relaxed text-emerald-100/80">
              &quot;हर कदम प्रकृति के नाम&quot; — इस 5 KM दौड़ का मुख्य उद्देश्य समाज में पर्यावरण
              के प्रति जागरूकता बढ़ाना तथा स्वस्थ व सक्रिय जीवनशैली को प्रेरित करना है।
            </p>
            <p className="text-[10px] text-emerald-400 font-bold">
              पर्यावरण मैराथन (5 KM) • 27 सितंबर 2026
            </p>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-900/60 flex flex-col sm:flex-row justify-between items-center text-xs text-emerald-400/70 gap-4">
          <p>© 2026 पर्यावरण मैराथन (Paryavaran Marathon Samastipur). ऑल राइट्स रिजर्व्ड.</p>
          <div className="flex space-x-6">
            <span>दौड़: 5 KM</span>
            <span>शुल्क: ₹99/-</span>
            <span>PhonePe QR Payment</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
