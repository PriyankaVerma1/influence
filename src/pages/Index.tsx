import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import WhyUsSection from "@/components/home/WhyUsSection";
import CTASection from "@/components/home/CTASection";
import ScriptGenerator from "@/components/home/ScriptGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ScriptGenerator />
        <ServicesSection />
        <WhyUsSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
