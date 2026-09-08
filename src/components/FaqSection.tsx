"use client";

import React, { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: "पर्यावरण मैराथन का रजिस्ट्रेशन शुल्क कितना है और भुगतान कैसे करें?",
      a: "रजिस्ट्रेशन शुल्क मात्र ₹99/- है। फॉर्म भरने के बाद स्क्रीन पर प्रदर्शित आधिकारिक PhonePe स्कैनर को स्कैन करके ₹99 का भुगतान करें और प्राप्त 12-अंकों का UTR / Transaction ID सबमिट करें।",
    },
    {
      q: "दौड़ के विजेता प्रतिभागियों के लिए क्या-क्या पुरस्कार हैं?",
      a: "आकर्षक पुरस्कार सूची के अनुसार: प्रथम पुरस्कार (1st Prize) साइकिल 🚲, द्वितीय पुरस्कार (2nd Prize) रनिंग शूज 👟, तृतीय पुरस्कार (3rd Prize) रनिंग जर्सी 🎽, टॉप 10 तक विशेष उपहार (Top 10 tak prize) 🏆 तथा टॉप 30 तक आधिकारिक मेडल (Top 30 tak Medal) 🎖️ प्रदान किया जाएगा।",
    },
    {
      q: "दौड़ की तारीख, दिन और स्थान क्या है?",
      a: "दौड़ 27 सितंबर 2026 (रविवार) को आयोजित होगी। स्थान: राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी (मालती, समस्तीपुर)।",
    },
    {
      q: "दौड़ की दूरी कितनी है?",
      a: "यह पर्यावरण मैराथन 5 किलोमीटर की दौड़ (5 KM Run) है।",
    },
    {
      q: "रजिस्ट्रेशन के बाद अपना स्टेटस कैसे चेक करें?",
      a: "वेबसाइट के शीर्ष पर 'Check Status' बटन पर क्लिक करके अपना पंजीकृत मोबाइल नंबर दर्ज करें। सत्यापन उपरांत आपका डिजिटल पास एवं बिब नंबर दिखाई देगा।",
    },
    {
      q: "क्या सभी प्रतिभागियों को कोई विशेष उपहार मिलेगा?",
      a: "हाँ! प्रत्येक पंजीकृत धावक को 'सनातन धाम' (Sanatan Dham) ऐप की 1 महीने की सेवा बिल्कुल मुफ्त (Free) दी जाएगी। आप ऐप को Google Play Store से डाउनलोड कर सकते हैं।",
    },
    {
      q: "अधिक जानकारी या सहायता के लिए किससे संपर्क करें?",
      a: "किसी भी जानकारी के लिए आधिकारिक मोबाइल नंबर 8340477782 पर संपर्क कर सकते हैं (संस्थापक: नीरज स्टार)।",
    },
  ];

  return (
    <section id="faq" className="py-20 bg-[#072116] border-t border-emerald-900/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Frequently Asked Questions</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            अक्सर पूछे जाने वाले प्रश्न (FAQs)
          </h2>
          <p className="text-emerald-200/80 text-sm sm:text-base leading-relaxed">
            पर्यावरण मैराथन, 5 KM दौड़ एवं पुरस्कारों से संबंधित महत्वपूर्ण प्रश्नों के उत्तर।
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="bg-[#08291b] border border-emerald-800/80 rounded-2xl overflow-hidden transition-colors shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
                >
                  <span className="text-sm sm:text-base font-bold text-white leading-snug">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-6 pt-1 text-emerald-100/80 text-xs sm:text-sm leading-relaxed border-t border-emerald-800/60">
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
