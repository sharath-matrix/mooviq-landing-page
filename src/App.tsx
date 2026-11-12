import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProblemOutcome } from './components/ProblemOutcome';
import { InteractiveDemo, DemoTabId } from './components/demo/InteractiveDemo';
import { KeyCapabilities } from './components/KeyCapabilities';
import { HowItWorks } from './components/HowItWorks';
import { UseCases } from './components/UseCases';
import { WhatsAppRoadmap } from './components/WhatsAppRoadmap';
import { Pricing } from './components/Pricing';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';

export const App: React.FC = () => {
  const [activeDemoTab, setActiveDemoTab] = useState<DemoTabId>('overview');

  useEffect(() => {
    document.title = 'Mooviq | Media Auditing & Campaign Verification by EraZero AI';
    // Ensure URL reflects /mooviq when served standalone at root if desired, preserving hash anchors
    if (window.location.pathname === '/') {
      window.history.replaceState(null, '', `/mooviq${window.location.hash}`);
    }
  }, []);

  const handleExploreDemoTrigger = (tab: DemoTabId = 'overview') => {
    setActiveDemoTab(tab);
    const demoElement = document.getElementById('explore-demo');
    if (demoElement) {
      const headerOffset = 80;
      const elementPosition = demoElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-brand-600 selection:text-white">
      {/* Sticky Header */}
      <Header onExploreDemoClick={() => handleExploreDemoTrigger('overview')} />

      {/* Main Page Flow */}
      <main className="flex-1">
        {/* Section B: Hero */}
        <Hero onExploreDemoClick={(tab) => handleExploreDemoTrigger(tab ?? 'overview')} />

        {/* Section C: Problem / Outcome */}
        <ProblemOutcome onSelectDemoTab={(tab) => handleExploreDemoTrigger(tab)} />

        {/* Section D: Interactive Dashboard (Centerpiece) */}
        <InteractiveDemo
          activeTab={activeDemoTab}
          onTabChange={(tab) => setActiveDemoTab(tab)}
        />

        {/* Section E: Key Capabilities */}
        <KeyCapabilities />

        {/* Section F: How It Works */}
        <HowItWorks onSelectDemoTab={(tab) => handleExploreDemoTrigger(tab)} />

        {/* Section G: Use Cases & Supported Media */}
        <UseCases />

        {/* Section H: WhatsApp Workflow Roadmap */}
        <WhatsAppRoadmap />

        {/* Section I: Pricing & Calculator */}
        <Pricing />

        {/* Section J: FAQs */}
        <FAQ />
      </main>

      {/* Section K: CTA & Footer */}
      <Footer onExploreDemoClick={() => handleExploreDemoTrigger('overview')} />
    </div>
  );
};

export default App;
