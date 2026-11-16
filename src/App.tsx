import React, { useEffect, useState } from 'react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { WhatItDoes } from './components/WhatItDoes';
import { ProblemOutcome } from './components/ProblemOutcome';
import { MediaCoverage } from './components/MediaCoverage';
import { InteractiveDemo, DemoTabId } from './components/demo/InteractiveDemo';
import { HowItWorks } from './components/HowItWorks';
import { FieldCaptureWorkflow } from './components/FieldCaptureWorkflow';
import { ZeroOnboardingBanner } from './components/ZeroOnboardingBanner';
import { Pricing } from './components/Pricing';
import { QuoteBuilder } from './components/QuoteBuilder';
import { FAQ } from './components/FAQ';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { MediaTypeItem } from './config/mediaAuditCatalog';
import { PublicMediaFormat } from './config/publicMediaCatalog';
import { QuotePrefillPayload } from './types/mooviq';

function scrollToSection(sectionId: string) {
  const el = document.getElementById(sectionId);
  if (el) {
    const headerOffset = 80;
    const elementPosition = el.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
}

export const App: React.FC = () => {
  const [activeDemoTab, setActiveDemoTab] = useState<DemoTabId>('overview');
  const [addedQuoteMedia, setAddedQuoteMedia] = useState<MediaTypeItem | null>(null);
  const [addedQuoteFormat, setAddedQuoteFormat] = useState<PublicMediaFormat | null>(null);
  const [selectedPlanId, setSelectedPlanId] = useState<'starter' | 'growth' | 'enterprise'>('growth');
  const [contactPrefill, setContactPrefill] = useState<QuotePrefillPayload | null>(null);

  useEffect(() => {
    document.title = 'Mooviq | Multi-Media Advertising Audit & Proof of Performance';
    if (window.location.pathname === '/') {
      window.history.replaceState(null, '', `/mooviq${window.location.hash}`);
    }
  }, []);

  const handleExploreDemo = (tab: DemoTabId = 'overview') => {
    setActiveDemoTab(tab);
    scrollToSection('explore-demo');
  };

  const handleOpenContactWithPrefill = (payload: QuotePrefillPayload) => {
    setContactPrefill({ ...payload });
    scrollToSection('contact');
  };

  const handleAddMediaToQuoteBuilder = (item: MediaTypeItem) => {
    setAddedQuoteMedia(item);
    scrollToSection('quote-builder');
  };

  const handleAddFormatToQuoteBuilder = (format?: PublicMediaFormat) => {
    if (format) setAddedQuoteFormat(format);
    scrollToSection('quote-builder');
  };

  const handleSelectPlan = (plan: 'starter' | 'growth' | 'enterprise') => {
    setSelectedPlanId(plan);
    scrollToSection('quote-builder');
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-brand-600 selection:text-white">
      {/* Sticky Header */}
      <Header
        onExploreDemoClick={() => handleExploreDemo('overview')}
        onBookDemoClick={() => handleOpenContactWithPrefill({ enquiryType: 'Book a demo' })}
      />

      {/* Page Sections in Requested Order */}
      <main className="flex-1">
        {/* 1. Hero */}
        <Hero
          onExploreDemoClick={(tab) => handleExploreDemo(tab ?? 'overview')}
          onRequestQuoteClick={() =>
            handleOpenContactWithPrefill({ enquiryType: 'Request media-wise quote' })
          }
          onBookDemoClick={() => handleOpenContactWithPrefill({ enquiryType: 'Book a demo' })}
        />

        {/* 2. Trust / What It Does */}
        <WhatItDoes />

        {/* 3. Problems -> Solutions */}
        <ProblemOutcome onSelectDemoTab={(tab) => handleExploreDemo(tab)} />

        {/* 4. Multi-Media Coverage Matrix & Evidence Models */}
        <MediaCoverage
          onExploreDemoTab={(tab) => handleExploreDemo(tab)}
          onAddToQuoteBuilder={handleAddMediaToQuoteBuilder}
        />

        {/* 5 & 6. Interactive Public Dashboard Demo + Media-Specific Sample Reports */}
        <InteractiveDemo
          activeTab={activeDemoTab}
          onTabChange={(tab) => setActiveDemoTab(tab)}
        />

        {/* 7. How It Works */}
        <HowItWorks onSelectDemoTab={(tab) => handleExploreDemo(tab)} />

        {/* 8. Field-First Capture App: Realistic Animated WhatsApp Workflow */}
        <FieldCaptureWorkflow
          onBookDemoClick={() => handleOpenContactWithPrefill({ enquiryType: 'Book a demo' })}
        />

        {/* 9. Zero Standard Onboarding Charges Strip */}
        <ZeroOnboardingBanner
          onCreateAuditPlanClick={() => scrollToSection('quote-builder')}
        />

        {/* 10. Build Your Media Audit Plan (Public Pricing Removed) */}
        <Pricing
          onSelectPlanCta={handleSelectPlan}
          onJumpToQuoteBuilder={handleAddFormatToQuoteBuilder}
          onTalkToTeamClick={() => scrollToSection('contact')}
        />

        {/* 11. Multi-Media Lead-Gated Quote Builder */}
        <QuoteBuilder
          externalAddedMedia={addedQuoteMedia}
          externalAddedFormat={addedQuoteFormat}
          selectedPlanId={selectedPlanId}
          onExternalMediaConsumed={() => {
            setAddedQuoteMedia(null);
            setAddedQuoteFormat(null);
          }}
          onSubmitToContact={(payload) => handleOpenContactWithPrefill(payload)}
        />

        {/* 12. FAQs */}
        <FAQ />

        {/* 13. Contact & Lead Capture */}
        <ContactSection prefill={contactPrefill} />
      </main>

      {/* 14. CTA Banner & Footer */}
      <Footer
        onExploreDemoClick={() => handleExploreDemo('overview')}
        onBookDemoClick={() => handleOpenContactWithPrefill({ enquiryType: 'Book a demo' })}
      />
    </div>
  );
};

export default App;
