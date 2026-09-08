import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import PrizeSection from "@/components/PrizeSection";
import RaceDetails from "@/components/RaceDetails";
import RouteSection from "@/components/RouteSection";
import AboutSection from "@/components/AboutSection";
import EligibilityRules from "@/components/EligibilityRules";
import FaqSection from "@/components/FaqSection";
import ContactSection from "@/components/ContactSection";
import prisma from "@/lib/prisma";

export const revalidate = 60; // Refresh settings every minute

async function getSettings() {
  try {
    const settings = await prisma.eventSetting.findFirst();
    if (settings) return settings;
  } catch (error) {
    console.error("Error fetching event settings:", error);
  }

  return {
    eventName: "Paryavaran Marathon Samastipur 2026",
    eventTagline: "“हर कदम प्रकृति के नाम” — Fit For a Greener Tomorrow",
    eventDate: "27 सितंबर 2026 (रविवार)",
    eventTime: "06:45 AM IST",
    reportingTime: "06:00 AM IST",
    venue: "राजकीय उत्क्रमित मध्य विद्यालय मालती पूर्वी",
    distance: "5 KM",
    registrationFee: 99,
    participantCapacity: 1500,
    contactPhone: "8340477782",
    organizerName: "संस्थापक: नीरज स्टार",
  };
}

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col min-h-screen bg-[#051a11] text-emerald-50">
      <Navbar eventName="PARYAVARAN MARATHON" />

      <main className="flex-1">
        <HeroSection
          eventName="PARYAVARAN MARATHON"
          tagline={settings.eventTagline}
          eventDate={settings.eventDate}
          eventTime={settings.eventTime}
          venue={settings.venue}
          fee={settings.registrationFee}
          capacity={settings.participantCapacity}
        />

        <PrizeSection />

        <RaceDetails
          eventDate={settings.eventDate}
          eventTime={settings.eventTime}
          reportingTime={settings.reportingTime}
          venue={settings.venue}
          fee={settings.registrationFee}
        />

        <RouteSection />

        <AboutSection />

        <EligibilityRules />

        <FaqSection />

        <ContactSection
          contactPhone={settings.contactPhone}
          venue={settings.venue}
          organizerName={settings.organizerName}
        />
      </main>

      <Footer
        eventName="Paryavaran Marathon Samastipur"
        organizerName={settings.organizerName}
        contactPhone={settings.contactPhone}
        venue={settings.venue}
      />
    </div>
  );
}
