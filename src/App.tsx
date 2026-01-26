import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { ProblemSection } from "./components/ProblemSection";
import { SolutionSection } from "./components/SolutionSection";
import { ChannelsSection } from "./components/ChannelsSection";
import { FocusAreasSection } from "./components/FocusAreasSection";
import { ImpactSection } from "./components/ImpactSection";
import { PartnersSection } from "./components/PartnersSection";
import { CTASection } from "./components/CTASection";
import { Footer } from "./components/Footer";

export default function App() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero />
        <ProblemSection />
        <SolutionSection />
        <ChannelsSection />
        <FocusAreasSection />
        <ImpactSection />
        <PartnersSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
