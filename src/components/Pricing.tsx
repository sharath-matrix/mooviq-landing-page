import React from 'react';
import {
  Check,
  ArrowRight,
  Layers,
  ShieldCheck,
  HelpCircle,
  Sliders,
} from 'lucide-react';
import {
  DASHBOARD_ACCESS_PACKAGES,
  AUDIT_PRICING_FACTORS,
  PRICING_POLICY_NOTES,
  DashboardPackage,
} from '../config/pricingConfig';
import { EnquiryType } from '../types/mooviq';
import { trackMooviqEvent } from '../lib/analytics';

interface PricingProps {
  onSelectPricingCta: (payload: {
    enquiryType: EnquiryType;
    dashboardPlan?: DashboardPackage;
    note?: string;
  }) => void;
  onJumpToQuoteBuilder: () => void;
}

export const Pricing: React.FC<PricingProps> = ({
  onSelectPricingCta,
  onJumpToQuoteBuilder,
}) => {
  return (
    <section id="pricing" className="scroll-mt-20 py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Pricing Architecture
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Dashboard access separated from field audit services.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            {PRICING_POLICY_NOTES.approvalStatus} Subscribe only for the workspace seats your team needs; audit execution services are scoped cleanly to your actual media plan.
          </p>
        </div>

        {/* Part A: Dashboard Access Packages */}
        <div className="mt-12 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Part A &middot; Workspace Software Subscription (Proposed)
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Dashboard Access Plans
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              {PRICING_POLICY_NOTES.taxDisclaimer}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 items-stretch">
            {DASHBOARD_ACCESS_PACKAGES.filter((p) => p.id !== 'custom-enterprise').map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                  pkg.recommended
                    ? 'bg-white border-2 border-brand-600 shadow-xl shadow-brand-600/10'
                    : 'bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 hover:bg-white'
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full">
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-base font-bold text-slate-900">{pkg.name}</h4>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {pkg.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 min-h-[36px] mb-4">{pkg.description}</p>

                  <div className="pb-4 border-b border-slate-200/70">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 font-mono">
                        {pkg.priceLabel}
                      </span>
                      <span className="text-xs text-slate-500">/month</span>
                    </div>
                    <span className="text-[11px] font-semibold text-brand-600 block mt-1.5">
                      {pkg.userLimitLabel}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Before GST · Field audits quoted separately
                    </span>
                  </div>

                  <div className="pt-4 space-y-2.5 text-xs text-slate-600">
                    {pkg.highlights.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-7 pt-4 border-t border-slate-200/70">
                  <button
                    type="button"
                    onClick={() => {
                      trackMooviqEvent('cta_click', { location: 'pricing', plan: pkg.id });
                      onSelectPricingCta({
                        enquiryType: 'Book a demo',
                        dashboardPlan: pkg,
                        note: `Interested in ${pkg.name} Dashboard Access (${pkg.priceLabel}/mo, ${pkg.userLimitLabel}).`,
                      });
                    }}
                    className={`w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer ${
                      pkg.recommended
                        ? 'bg-brand-600 hover:bg-brand-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>Select {pkg.name}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Custom Enterprise + Optional Discuss a Pilot */}
          <div className="mt-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
            <div className="lg:col-span-8 rounded-2xl p-6 bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-base font-bold">Custom Enterprise</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-800 text-brand-300 rounded border border-slate-700">
                    10+ Users &middot; SSO &amp; Integrations
                  </span>
                </div>
                <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
                  For larger brand, agency, or media networks needing SSO, custom approval roles, DOOH CMS / telematics / playout log connectors, and tailored data retention.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const customPkg = DASHBOARD_ACCESS_PACKAGES.find((p) => p.id === 'custom-enterprise');
                  trackMooviqEvent('cta_click', { location: 'pricing', plan: 'custom-enterprise' });
                  onSelectPricingCta({
                    enquiryType: 'Book a demo',
                    dashboardPlan: customPkg,
                    note: 'Interested in Custom Enterprise dashboard access (10+ users, SSO / integrations).',
                  });
                }}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shrink-0 transition-colors cursor-pointer"
              >
                Discuss Custom Enterprise
              </button>
            </div>

            <div className="lg:col-span-4 rounded-2xl p-6 bg-slate-50 border border-slate-200 flex flex-col justify-between gap-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Optional Evaluation
                </span>
                <h4 className="text-base font-bold text-slate-900 mt-0.5">Discuss a Pilot</h4>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  Evaluating Mooviq on one upcoming campaign? Scope, media types, and sample size are confirmed directly with our team.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  trackMooviqEvent('cta_click', { location: 'pricing', action: 'discuss_pilot' });
                  onSelectPricingCta({
                    enquiryType: 'Discuss pilot',
                    note: 'Interested in scoping a pilot deployment with the Mooviq team.',
                  });
                }}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 border border-slate-300 font-bold text-xs transition-colors cursor-pointer"
              >
                Discuss a Pilot
              </button>
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              <strong>Important separation:</strong> {PRICING_POLICY_NOTES.separationNote}
            </span>
          </div>
        </div>

        {/* Part B: Media Audit Services */}
        <div className="mt-16 rounded-3xl bg-slate-50 border border-slate-200 p-6 sm:p-10 text-left">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-8 border-b border-slate-200">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Part B &middot; Media Audit Services
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1.5">
                Audit pricing tailored to your media plan
              </h3>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                Because auditing a highway hoarding, a cab fleet, a mall digital screen, and a cinema playback log involve completely different effort and data sources, Mooviq quotes audit execution per media plan rather than publishing misleading flat rates.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => {
                  trackMooviqEvent('cta_click', { location: 'pricing_services', cta: 'Request media-wise rate card' });
                  onSelectPricingCta({
                    enquiryType: 'Request media-wise quote',
                    note: 'Requesting media-wise rate card for upcoming campaign formats.',
                  });
                }}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs border border-slate-300 transition-colors cursor-pointer"
              >
                <span>Request media-wise rate card</span>
              </button>
              <button
                type="button"
                onClick={onJumpToQuoteBuilder}
                className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Plan audits in Quote Builder</span>
              </button>
            </div>
          </div>

          {/* Pricing Factors Grid */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AUDIT_PRICING_FACTORS.map((factor) => (
              <div
                key={factor.title}
                className="p-4 rounded-xl bg-white border border-slate-200/80"
              >
                <h4 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                  <span>{factor.title}</span>
                </h4>
                <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{factor.detail}</p>
              </div>
            ))}
          </div>

          {/* Compact Illustrative Formula */}
          <div className="mt-6 p-4 rounded-2xl bg-white border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start gap-2.5 text-xs text-slate-700">
              <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
              <div>
                <strong className="text-slate-900">How total campaign billing works:</strong>{' '}
                <span className="font-mono bg-slate-100 px-2 py-0.5 rounded text-slate-900">
                  Dashboard Access Plan + Quoted Audit Services (+ applicable GST)
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  Use the multi-media quote builder below to structure your media formats, asset counts, and rounds before requesting a formal rate card or custom quote.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                trackMooviqEvent('cta_click', { location: 'pricing_services', cta: 'Get a custom audit quote' });
                onSelectPricingCta({
                  enquiryType: 'Request media-wise quote',
                  note: 'Requesting a custom multi-media audit quote.',
                });
              }}
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shrink-0 transition-colors cursor-pointer"
            >
              <span>Get a custom audit quote</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
