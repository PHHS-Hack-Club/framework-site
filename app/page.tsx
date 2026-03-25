"use client";

import dynamic from "next/dynamic";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import LocationSection from "./components/LocationSection";
import AboutSection from "./components/AboutSection";
import ScheduleSection from "./components/ScheduleSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

// Global scanline overlay
export default function Home() {
  return (
    <>
      {/* Global scanline */}
      <div className="fixed inset-0 z-[100] scanline-overlay pointer-events-none" />

      <Navbar />
      <main className="relative">
        <HeroSection />
        <LocationSection />
        <AboutSection />
        <ScheduleSection />
        <FAQSection />
        <CTASection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
