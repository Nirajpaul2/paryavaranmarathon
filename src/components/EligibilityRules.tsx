import React from "react";
import { ShieldCheck, AlertCircle, CheckCircle, Info, Leaf } from "lucide-react";

export default function EligibilityRules() {
  return (
    <section className="py-20 bg-[#051c13] border-t border-emerald-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-bold uppercase tracking-wider">
            <Leaf className="w-3.5 h-3.5 text-emerald-400" />
            <span>Guidelines &amp; Rules</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tight">
            पात्रता एवं नियम (Eligibility &amp; Rules)
          </h2>
          <p className="text-emerald-200/80 text-sm sm:text-base leading-relaxed">
            पर्यावरण मैराथन में भाग लेने से पूर्व कृपया निम्नलिखित नियमों एवं दिशा-निर्देशों का ध्यानपूर्वक अवलोकन करें।
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Eligibility Card */}
          <div className="bg-[#08291b] border border-emerald-800/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase">प्रतिभागी पात्रता (Eligibility)</h3>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-emerald-100/90">
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>आयु सीमा:</strong> 12 वर्ष या उससे अधिक आयु के सभी युवा, छात्र एवं नागरिक इस 5 किलोमीटर दौड़ में भाग ले सकते हैं।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>शारीरिक स्वास्थ्य:</strong> प्रतिभागी शारीरिक रूप से स्वस्थ होने चाहिए। किसी भी पूर्व चिकित्सा समस्या के लिए चिकित्सक की सलाह अनिवार्य है।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>पहचान पत्र:</strong> दौड़ दिवस पर विद्यालय परिसर में अपना वैध पहचान पत्र (आधार कार्ड/स्कूल आईडी) साथ रखें।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  <strong>खुली प्रतियोगिता:</strong> मालती पंचायत एवं समस्तीपुर जिले के सभी उत्साही धावकों का स्वागत है।
                </span>
              </li>
            </ul>
          </div>

          {/* Important Rules Card */}
          <div className="bg-[#08291b] border border-emerald-800/80 rounded-3xl p-6 sm:p-8 space-y-5 shadow-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-bold text-white uppercase">दौड़ के महत्वपूर्ण नियम (Rules)</h3>
            </div>
            <ul className="space-y-3.5 text-xs sm:text-sm text-emerald-100/90">
              <li className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>चेस्ट बिब:</strong> आयोजकों द्वारा प्रदान किया गया चेस्ट बिब दौड़ के समय सीने पर स्पष्ट रूप से लगा होना अनिवार्य है।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>निर्धारित मार्ग:</strong> धावकों को केवल आयोजकों द्वारा चिन्हित 5 KM मार्ग पर ही दौड़ना होगा। शॉर्टकट लेने पर अयोग्य घोषित कर दिया जाएगा।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>पुरस्कार वितरण:</strong> दौड़ समाप्ति के उपरांत विद्यालय प्रांगण में साइकिल, रनिंग शूज, जर्सी, टॉप 10 उपहार एवं टॉप 30 मेडल प्रदान किए जाएंगे।
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong>पर्यावरण सुरक्षा:</strong> मार्ग पर कचरा न फैलाएं, पानी के पाउच/गिलास कूड़ेदान में ही डालें। &quot;हर कदम प्रकृति के नाम&quot;।
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
