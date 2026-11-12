import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'What is an audit event?',
      a: 'An audit event is a single scheduled verification checkpoint for one physical media unit (such as a vehicle rear panel, mall totem, or billboard face). It typically includes multiple angle photographs, timestamp records, and location context. If an initial photo is flagged and rejected, re-submitting evidence for the same checkpoint does not consume an extra audit unit.',
    },
    {
      q: 'Can I track multiple agencies and cities?',
      a: 'Yes. Mooviq supports multi-city campaigns executed across independent agency partners. You can filter progress by specific city (e.g., Bengaluru, Mumbai, Delhi, Hyderabad) or review cross-agency performance in unified executive rollups.',
    },
    {
      q: 'How is evidence reviewed?',
      a: 'Mooviq surfaces potential anomalies (such as duplicate images, indoor location offsets, or lighting defects) in a dedicated Exceptions queue. Human supervisors inspect flagged items with complete contextual notes before accepting or rejecting the submission.',
    },
    {
      q: 'Are photos and location automatically verified?',
      a: 'Mooviq surfaces potential exception flags for supervisor review, and assistive duplicate/geofence validation tools are part of the roadmap subject to production confirmation. Final verification relies on human inspection rather than claiming automated fraud or GPS proof.',
    },
    {
      q: 'Do field auditors need an app?',
      a: 'No app download is mandatory for field personnel. Auditors can open single-use authenticated web links in any standard mobile browser to capture camera evidence directly with embedded timestamp verification.',
    },
    {
      q: 'Can Mooviq send WhatsApp notifications?',
      a: 'WhatsApp dispatch workflows are currently on our product roadmap. We plan to support automated assignment alerts and daily digests. Reliable photo metadata capture is maintained inside the Mooviq browser camera rather than through forwarded WhatsApp compressed files.',
    },
    {
      q: 'Is this interactive dashboard real customer data?',
      a: 'No. The interactive dashboard embedded on this page is a self-contained prototype powered by typed local sample data. No real advertisers, live cameras, actual agencies, internal passwords, or confidential media contracts are connected.',
    },
    {
      q: 'What is included in pricing?',
      a: 'Pricing plans cover core workspace software access, campaign management, dashboard seats, exception review queues, and export tools. Government taxes (GST), optional third-party WhatsApp charges, and physical ground auditing personnel are billed separately.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="scroll-mt-20 py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Frequently Asked Questions
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Clear answers about Mooviq.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Learn more about audit units, field verification protocols, and roadmap integrations.
          </p>
        </div>

        {/* Accordion Container */}
        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-2xl bg-white border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-5 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none focus:bg-slate-50"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <div className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 text-slate-500 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 bg-slate-200 text-slate-900' : ''
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 animate-in fade-in duration-150 text-left">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

