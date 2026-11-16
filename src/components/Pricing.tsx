import React, { useState, useMemo } from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Plus,
  Sliders,
  CheckCircle2,
  Layers,
  MessageSquare,
} from 'lucide-react';
import { PUBLIC_MEDIA_CATALOG, PublicMediaFormat, PublicMediaCategory } from '../config/publicMediaCatalog';
import { trackMooviqEvent } from '../lib/analytics';

interface PricingProps {
  onSelectPlanCta: (planId: 'starter' | 'growth' | 'enterprise') => void;
  onJumpToQuoteBuilder: (preselectedFormat?: PublicMediaFormat) => void;
  onTalkToTeamClick: () => void;
}

export const Pricing: React.FC<PricingProps> = ({
  onSelectPlanCta,
  onJumpToQuoteBuilder,
  onTalkToTeamClick,
}) => {
  const [rateSearch, setRateSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedAdditionalCategory, setExpandedAdditionalCategory] = useState<string | null>(
    'Outdoor & OOH'
  );

  const categories = useMemo(() => {
    return ['All', 'Outdoor & OOH', 'Transit & Vehicle', 'Mall, Retail & Indoor', 'Residential & Community', 'Airport, Cinema & Other'];
  }, []);

  const filteredFormats = useMemo(() => {
    const q = rateSearch.trim().toLowerCase();
    return PUBLIC_MEDIA_CATALOG.filter((item) => {
      const matchCat = selectedCategory === 'All' || item.category === selectedCategory;
      const matchQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.billingUnitDescription.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [rateSearch, selectedCategory]);

  return (
    <section id="pricing" className="scroll-mt-20 py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-600" />
            <span>Campaign-Tailored Auditing</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Build Your Media Audit Plan
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Select the advertising formats, locations and audit requirements for your campaign.
            Create a personalized Mooviq quotation tailored to your media plan.
          </p>

          {/* Three Key Benefits */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm font-medium text-slate-700">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Flexible media-wise auditing</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Customized campaign requirements</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Detailed quotation after verification</span>
            </div>
          </div>

          {/* Section Level CTAs */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => {
                trackMooviqEvent('cta_click', { location: 'pricing_header', action: 'build_my_quotation' });
                onJumpToQuoteBuilder();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
            >
              <Sliders className="w-4 h-4" />
              <span>Build My Quotation</span>
            </button>
            <button
              type="button"
              onClick={() => {
                trackMooviqEvent('cta_click', { location: 'pricing_header', action: 'talk_to_our_team' });
                onTalkToTeamClick();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all border border-slate-200 cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Talk to Our Team</span>
            </button>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 1: PRICING PLAN CARDS (NO PUBLIC FIGURES)           */}
        {/* ======================================================== */}
        <div className="mt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {/* Starter Plan */}
            <div className="rounded-3xl p-7 flex flex-col justify-between bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 hover:bg-white transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Starter</h3>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-200/70 px-2.5 py-0.5 rounded-full">
                    Single Campaign
                  </span>
                </div>
                <p className="text-xs text-slate-600 min-h-[36px] mb-5 leading-relaxed">
                  For businesses auditing limited campaigns and locations.
                </p>

                <div className="pt-4 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Single-brand campaign tracking</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Media audit evidence repository</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Campaign execution reports</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Standard onboarding included</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    trackMooviqEvent('cta_click', { location: 'plan_cards', plan: 'starter' });
                    onSelectPlanCta('starter');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Build Starter Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Growth Plan (Recommended) */}
            <div className="rounded-3xl p-7 flex flex-col justify-between bg-white border-2 border-brand-600 shadow-xl shadow-brand-600/10 relative">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-sm">
                Recommended
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Growth</h3>
                  <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-100">
                    Multi-City
                  </span>
                </div>
                <p className="text-xs text-slate-600 min-h-[36px] mb-5 leading-relaxed">
                  For agencies managing multiple media types and cities.
                </p>

                <div className="pt-4 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Multi-city &amp; multi-media auditing</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Centralized audit evidence management</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Exception &amp; issue queue resolution</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Collaborative team dashboard access</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    trackMooviqEvent('cta_click', { location: 'plan_cards', plan: 'growth' });
                    onSelectPlanCta('growth');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                >
                  <span>Build Growth Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Enterprise Plan */}
            <div className="rounded-3xl p-7 flex flex-col justify-between bg-slate-50/80 border border-slate-200/90 hover:border-slate-300 hover:bg-white transition-all">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">Enterprise</h3>
                  <span className="text-[11px] font-bold text-slate-600 bg-slate-200/70 px-2.5 py-0.5 rounded-full">
                    High Volume
                  </span>
                </div>
                <p className="text-xs text-slate-600 min-h-[36px] mb-5 leading-relaxed">
                  For large-scale media auditing across brands, locations and teams.
                </p>

                <div className="pt-4 border-t border-slate-200/80 space-y-2.5 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Cross-agency multi-brand governance</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Role-based access &amp; regional permissions</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Bespoke reporting &amp; log integrations</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Dedicated onboarding coordinator</span>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-5 border-t border-slate-200/80">
                <button
                  type="button"
                  onClick={() => {
                    trackMooviqEvent('cta_click', { location: 'plan_cards', plan: 'enterprise' });
                    onSelectPlanCta('enterprise');
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer"
                >
                  <span>Request Enterprise Quote</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 2: SUPPORTED MEDIA DIRECTORY (NO PUBLIC PRICES)     */}
        {/* ======================================================== */}
        <div className="mt-16 text-left">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Supported Media Formats
              </span>
              <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                Explore Available Media Checkpoints
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Configure your media list and receive an itemized commercial quotation following verification.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rateSearch}
                onChange={(e) => setRateSearch(e.target.value)}
                placeholder="Search media format or category..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-1.5 mb-5">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white border-slate-900'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Formats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {filteredFormats.map((format) => (
              <div
                key={format.id}
                className="p-4 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-xs font-bold text-slate-900">{format.name}</h4>
                    <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      {format.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mb-2 leading-relaxed">
                    {format.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-0.5 rounded border border-slate-200/60">
                    {format.billingUnitDescription}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      trackMooviqEvent('rate_table_add_to_quote', { media_id: format.id });
                      onJumpToQuoteBuilder(format);
                    }}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:text-brand-700 cursor-pointer"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Configure in Plan</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Verification Gate Notice Box */}
        <div className="mt-12 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3 text-left">
          <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-slate-900">Protected Commercial Terms:</strong> To ensure accurate, campaign-specific billing, Mooviq does not publish unverified public price lists. Complete rate breakdowns, credit consumptions, and downloadable A4 PDF quotations are unlocked immediately upon dual mobile and email verification in the quotation builder.
          </div>
        </div>
      </div>
    </section>
  );
};
