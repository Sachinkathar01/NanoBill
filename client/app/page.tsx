import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HeroSection } from '@/components/landing/HeroSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { HowItWorks } from '@/components/landing/HowItWorks';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#080808] text-white selection:bg-white/20 overflow-x-hidden pt-10">
        <Navbar />
        
        {/* Core Sections */}
        <HeroSection />
        <HowItWorks />
        <FeaturesSection />
        
        <Footer />
    </main>
  );
}
