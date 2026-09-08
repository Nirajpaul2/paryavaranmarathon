import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#051a11",
};

export const metadata: Metadata = {
  title: "Paryavaran Marathon Samastipur 2026 | 5 KM Run Registration",
  description:
    "Join Paryavaran Marathon in Malti, Samastipur on 27 September 2026. Participate in the 5 KM community run and register online for ₹99. हर कदम प्रकृति के नाम - Fit For a Greener Tomorrow.",
  keywords: [
    "Paryavaran Marathon",
    "पर्यावरण मैराथन",
    "Samastipur Marathon",
    "Malti 5 KM Run",
    "हर कदम प्रकृति के नाम",
    "PhonePe Registration 99",
    "Malti Panchayat Daur",
  ],
  authors: [{ name: "संस्थापक: नीरज स्टार" }],
  openGraph: {
    title: "पर्यावरण मैराथन 2026 — PARYAVARAN MARATHON SAMASTIPUR (5 KM)",
    description:
      "27 सितंबर 2026 (रविवार) • 5 KM पर्यावरण दौड़ • रजिस्ट्रेशन शुल्क ₹99/- • आकर्षक पुरस्कार: साइकिल, रनिंग शूज, जर्सी, मेडल। हर कदम प्रकृति के नाम!",
    type: "website",
    locale: "hi_IN",
    siteName: "Paryavaran Marathon Samastipur",
    images: [
      {
        url: "/images/og-banner.jpg",
        width: 720,
        height: 1080,
        alt: "Paryavaran Marathon Official Banner",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="scroll-smooth">
      <body className="min-h-screen bg-[#051a11] text-emerald-50 antialiased selection:bg-emerald-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
