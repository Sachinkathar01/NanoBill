import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { DashboardDemo } from "@/components/landing/DashboardDemo";
import { WhySection } from "@/components/landing/WhySection";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { CTASection } from "@/components/landing/CTASection";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-white/20 overflow-x-hidden pt-10">
      <Navbar />

      <HeroSection />
      
      {/* Ticker / Logos section */}
      <section className="py-10 border-y border-[#262626] bg-[#0D0D0D]/20 overflow-hidden relative">
        <div className="animate-marquee flex gap-16 whitespace-nowrap">
          {[...Array(2)].map((_, idx) => (
            <div key={idx} className="flex gap-16 text-[10px] font-mono tracking-widest text-[#9CA3AF] uppercase">
              <span>Trusted by modern builders & teams:</span>
              <span>Acme Corp</span>
              <span>Vercel Inc</span>
              <span>Supabase</span>
              <span>Linear Studio</span>
              <span>Stripe API</span>
              <span>Resend Corp</span>
              <span>Arc Browser</span>
              <span>Raycast HQ</span>
            </div>
          ))}
        </div>
      </section>

      <FeaturesSection />

      <DashboardDemo />

      <HowItWorks />

      <WhySection />

      <TestimonialsSection />

      <PricingSection />

      <FAQSection />

      <CTASection />

      <Footer />
    </main>
  );
}
