import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Which media types can be audited?',
      a: 'Mooviq organizes advertising verification across four media families: Transit & Vehicle (autos, cabs, buses, delivery vans, fleet wraps), Outdoor / OOH (billboards, DOOH, unipoles, wall paintings, pole kiosks, bus shelters, shop boards), Indoor / Place-Based (malls, retail stores, corporate parks, residential lift lobbies, airports, metro stations), and Screen & Broadcast / Other Media (cinema on-screen, radio, TV, digital/in-app, print editions, activations). Physical formats use structured field photo workflows, while screen/broadcast formats rely on proof-of-play or delivery log reconciliations.',
    },
    {
      q: 'How is an audit priced?',
      a: 'Mooviq operates on a transparent Prepaid Credit Wallet + Dashboard Subscription model. 1 Mooviq Credit = ₹4 nominal value. Different media formats consume credits according to their verification complexity (from 1 credit for No Parking boards up to 237 credits for Billboards). Credit wallets start at ₹19,999 (5,000 credits) with ₹0 standard onboarding charges. Dashboard workspace access is billed separately at ₹1,999 / user / month before GST.',
    },
    {
      q: 'Does dashboard pricing include field visits?',
      a: 'No. Dashboard subscriptions cover workspace access, unit tracking, proof galleries, exception queues, and report exports. Physical ground auditing staff, third-party agency execution, and custom playback log integrations are quoted and billed separately.',
    },
    {
      q: 'Can evidence be exported?',
      a: 'Yes. In the interactive sample workspace, you can export filtered sample campaign rows and format-adapted sample audit reports as CSV files. Production deployments support exportable campaign status tables and linked media evidence summaries.',
    },
    {
      q: 'How is vehicle movement tracked?',
      a: 'Field checkpoint photographs verify physical wrap condition, cleanliness, and vehicle ID at the time of inspection—continuous route movement or stationary duration cannot be inferred from a single photograph. Continuous vehicle movement or dwell telemetry is available only when an authorized GPS or fleet telematics integration is connected.',
    },
    {
      q: 'Is WhatsApp required?',
      a: 'No. Mooviq is designed around a field-first mobile-web or auditor app capture flow so proof photos retain proper time and location context. Optional WhatsApp alerts (task notifications, digests, or escalations) are planned as an integration rather than a mandatory channel.',
    },
    {
      q: 'Is the interactive dashboard on this page live customer data?',
      a: 'No. All campaigns, proof placeholders, playout log extracts, and exceptions in the workspace preview use fictional local sample data. No live customer campaigns, internal emails, revenue figures, or real location trails are exposed.',
    },
    {
      q: 'How do I request a pilot or custom media rate card?',
      a: 'Use the Multi-Media Quote Builder or click any "Request an Audit Quote" / "Discuss a Pilot" button to pre-fill your formats and volume into the enquiry form below. Our team confirms exact pilot scope and rate cards directly.',
    },
  ];

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faqs" className="scroll-mt-20 py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Frequently Asked Questions
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Clear answers about Mooviq.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Coverage across offline formats, verification methods, pricing structure, and field workflows.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={index}
                className="rounded-2xl bg-slate-50/70 border border-slate-200/90 shadow-2xs overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => toggleAccordion(index)}
                  className="w-full px-5 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer focus:outline-none hover:bg-slate-50"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {faq.q}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 text-slate-500 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-slate-900' : ''
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/70 bg-white pt-3.5 animate-in fade-in text-left">
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
