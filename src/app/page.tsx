import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import RaceDetails from "@/components/RaceDetails";
import RouteSection from "@/components/RouteSection";
import BenefitsSection from "@/components/BenefitsSection";
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
    eventName: "10 KM City Marathon 2026",
    eventTagline: "Run 10 KM. Challenge Yourself. Finish Strong.",
    eventDate: "Sunday, October 18, 2026",
    eventTime: "05:30 AM IST",
    reportingTime: "04:45 AM IST",
    venue: "Central Stadium Arena & Sports Complex, City Center",
    distance: "10 KM",
    registrationFee: 100,
    participantCapacity: 1500,
    contactEmail: "support@marathon10k.org",
    contactPhone: "+91 98765 43210",
    organizerName: "Athletics & Marathon Association",
  };
}

export default async function HomePage() {
  const settings = await getSettings();

  return (
    <div className="flex flex-col min-h-screen bg-[#0b0f19]">
      <Navbar eventName={settings.eventName} />

      <main className="flex-1">
        <HeroSection
          eventName={settings.eventName}
          tagline={settings.eventTagline}
          eventDate={settings.eventDate}
          eventTime={settings.eventTime}
          venue={settings.venue}
          fee={settings.registrationFee}
          capacity={settings.participantCapacity}
        />

        <RaceDetails
          eventDate={settings.eventDate}
          eventTime={settings.eventTime}
          reportingTime={settings.reportingTime}
          venue={settings.venue}
          fee={settings.registrationFee}
        />

        <RouteSection />

        <BenefitsSection />

        <EligibilityRules />

        <FaqSection />

        <ContactSection
          contactEmail={settings.contactEmail}
          contactPhone={settings.contactPhone}
          venue={settings.venue}
          organizerName={settings.organizerName}
        />
      </main>

      <Footer
        eventName={settings.eventName}
        organizerName={settings.organizerName}
        contactEmail={settings.contactEmail}
        contactPhone={settings.contactPhone}
        venue={settings.venue}
      />
    </div>
  );
}
