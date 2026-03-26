import { getCurrentUser } from "./lib/auth";
import { getDashboardHref } from "./lib/site";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import LocationSection from "./components/LocationSection";
import AboutSection from "./components/AboutSection";
import ScheduleSection from "./components/ScheduleSection";
import FAQSection from "./components/FAQSection";
import CTASection from "./components/CTASection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";
import SectionDivider from "./components/SectionDivider";

export default async function Home() {
  const user = await getCurrentUser();
  const dashboardHref = user ? getDashboardHref(user.role) : null;

  return (
    <>
      {/* CRT scanlines */}
      <div className="fixed inset-0 z-[100] scanline-overlay pointer-events-none" />
      {/* CRT vignette */}
      <div className="fixed inset-0 z-[99] pointer-events-none" style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.55) 100%)" }} />

      <Navbar dashboardHref={dashboardHref} />
      <main className="relative">
        <HeroSection dashboardHref={dashboardHref} />
        <SectionDivider accent />
        <LocationSection />
        <SectionDivider />
        <AboutSection />
        <SectionDivider accent />
        <ScheduleSection />
        <SectionDivider />
        <FAQSection />
        <SectionDivider accent />
        <CTASection dashboardHref={dashboardHref} />
        <SectionDivider />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
