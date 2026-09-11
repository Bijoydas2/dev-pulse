import CtaSection from "@/components/home/CtaSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import Footer from "@/components/home/Footer";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import TechLogos from "@/components/home/TechLogos";
import TestimonialsSection from "@/components/home/TestimonialsSection";

export default function Home() {
  return (
    <main className="relative isolate overflow-hidden bg-zinc-950 text-zinc-100">
      <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-190 bg-[radial-gradient(circle_at_65%_12%,rgba(16,185,129,0.16),transparent_34%),radial-gradient(circle_at_8%_28%,rgba(245,158,11,0.08),transparent_28%)]" />
      <HeroSection />
      <TechLogos />
      <StatsSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
