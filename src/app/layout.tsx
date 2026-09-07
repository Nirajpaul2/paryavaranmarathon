import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b0f19",
};

export const metadata: Metadata = {
  title: "10 KM City Marathon 2026 | Run 10 KM. Challenge Yourself. Finish Strong.",
  description:
    "Official Registration Portal for the 10 KM City Marathon 2026. Join passionate runners, challenge your endurance, and earn your official timing certificate and finisher medal.",
  keywords: ["10K Marathon", "Marathon Registration", "10 KM Run", "Running Event", "PhonePe Payment", "Race Registration"],
  authors: [{ name: "Marathon Sports Association" }],
  openGraph: {
    title: "10 KM City Marathon 2026 — Official Registration",
    description:
      "Join us for an unforgettable 10 KM running experience. Register online, secure your bib, and challenge your endurance.",
    type: "website",
    locale: "en_IN",
    siteName: "10 KM Marathon 2026",
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
    <html lang="en" className="scroll-smooth">
      <body className="min-h-screen bg-[#0b0f19] text-slate-100 antialiased selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
