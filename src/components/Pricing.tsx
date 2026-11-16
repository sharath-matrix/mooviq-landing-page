import React, { useState, useMemo } from 'react';
import {
  Check,
  ArrowRight,
  ShieldCheck,
  Search,
  Sparkles,
  Users,
  ChevronDown,
  ChevronUp,
  Plus,
  Sliders,
  HelpCircle,
} from 'lucide-react';
import {
  NOMINAL_CREDIT_VALUE_INR,
  CREDIT_WALLET_PACKAGES,
  DASHBOARD_ACCESS_INFO,
  FIXED_MEDIA_RATE_CARD,
  ADDITIONAL_MEDIA_CATALOG,
  PRICING_POLICY_NOTES,
  CreditWalletPackage,
  FixedMediaRate,
} from '../config/pricingConfig';
import { EnquiryType } from '../types/mooviq';
import { trackMooviqEvent } from '../lib/analytics';
import { formatInr } from '../lib/quoteCalculator';

interface PricingProps {
  onSelectPricingCta: (payload: {
    enquiryType: EnquiryType;
    walletPackage?: CreditWalletPackage;
    note?: string;
    dashboardUsers?: number;
  }) => void;
  onJumpToQuoteBuilder: (preselectedMedia?: FixedMediaRate) => void;
}

export const Pricing: React.FC<PricingProps> = ({
  onSelectPricingCta,
  onJumpToQuoteBuilder,
}) => {
  // User count selector state for Dashboard Access
  const [dashboardUserCount, setDashboardUserCount] = useState<number>(3);

  // Rate card search & category filter state
  const [rateSearch, setRateSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Expandable state for Additional Media Types
  const [expandedAdditionalCategory, setExpandedAdditionalCategory] = useState<string | null>(
    'Outdoor & Digital OOH'
  );

  const calculatedDashboardMonthly = useMemo(() => {
    return dashboardUserCount * DASHBOARD_ACCESS_INFO.pricePerUserMonthlyInr;
  }, [dashboardUserCount]);

  const categories = useMemo(() => {
    const set = new Set(FIXED_MEDIA_RATE_CARD.map((r) => r.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredRates = useMemo(() => {
    const q = rateSearch.trim().toLowerCase();
    return FIXED_MEDIA_RATE_CARD.filter((rate) => {
      const matchCat = selectedCategory === 'All' || rate.category === selectedCategory;
      const matchQuery =
        !q ||
        rate.name.toLowerCase().includes(q) ||
        rate.category.toLowerCase().includes(q) ||
        rate.billingUnit.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [rateSearch, selectedCategory]);

  return (
    <section id="pricing" className="scroll-mt-20 py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold tracking-wide uppercase mb-3">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>₹0 Standard Onboarding Included</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Prepaid Audit Credit Wallets + Flexible Dashboard Access
          </h2>

          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Mooviq separates workspace software access from audit execution. Purchase credit wallets to
            fund inspections at <strong>1 Mooviq Credit = ₹{NOMINAL_CREDIT_VALUE_INR}</strong>, and
            subscribe only to the dashboard user seats your team needs.
          </p>
        </div>

        {/* ======================================================== */}
        {/* PART 1: THREE CREDIT WALLET PACKAGES                     */}
        {/* ======================================================== */}
        <div className="mt-14">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Part 1 &middot; Prepaid Audit Wallets
              </span>
              <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                Choose a Credit Wallet
              </h3>
            </div>
            <p className="text-xs text-slate-500 max-w-md text-left sm:text-right">
              {PRICING_POLICY_NOTES.taxDisclaimer} 1 Credit = ₹{NOMINAL_CREDIT_VALUE_INR}.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {CREDIT_WALLET_PACKAGES.map((pkg) => (
              <div
                key={pkg.id}
                className={`rounded-3xl p-7 flex flex-col justify-between transition-all relative ${
                  pkg.recommended
                    ? 'bg-white border-2 border-brand-600 shadow-xl shadow-brand-600/10'
                    : 'bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 hover:bg-white'
                }`}
              >
                {pkg.recommended && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider px-3.5 py-0.5 rounded-full shadow-sm">
                    Recommended
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-lg font-extrabold text-slate-900 tracking-tight">{pkg.name}</h4>
                    <span className="text-[11px] font-mono font-bold text-brand-700 bg-brand-50 border border-brand-100 px-2.5 py-1 rounded-full">
                      {pkg.credits.toLocaleString()} Credits
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 min-h-[36px] mb-5 leading-relaxed">
                    {pkg.description}
                  </p>

                  <div className="pb-5 border-b border-slate-200/80">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 font-mono tracking-tight">
                        {formatInr(pkg.priceInr)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500">
                      <span>Nominal Value: {formatInr(pkg.nominalValueInr)}</span>
                      <span className="text-slate-300">&middot;</span>
                      <span className="text-emerald-700 font-medium">Package pricing</span>
                    </div>
                    <span className="text-[11px] text-slate-400 block mt-1">
                      Before GST &middot; Standard onboarding included
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <div className="pt-5 space-y-3 text-xs text-slate-600">
                    {pkg.features.map((item, idx) => (
                      <div key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span className="leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8 pt-5 border-t border-slate-200/80">
                  <button
                    type="button"
                    onClick={() => {
                      trackMooviqEvent('cta_click', { location: 'pricing_wallet', package: pkg.id });
                      onSelectPricingCta({
                        enquiryType: 'Request media-wise quote',
                        walletPackage: pkg,
                        note: `Interested in ${pkg.name} (${formatInr(pkg.priceInr)} for ${pkg.credits.toLocaleString()} credits).`,
                      });
                    }}
                    className={`w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                      pkg.recommended
                        ? 'bg-brand-600 hover:bg-brand-700 text-white'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{pkg.ctaLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Wallet terms disclaimer note */}
          <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong>Commercial Pricing Structure:</strong> {PRICING_POLICY_NOTES.packageLevelDiscount}{' '}
              {PRICING_POLICY_NOTES.taxDisclaimer} {PRICING_POLICY_NOTES.walletTermsNote}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 2: DASHBOARD SUBSCRIPTION                           */}
        {/* ======================================================== */}
        <div className="mt-14 rounded-3xl bg-slate-50 border border-slate-200/90 p-7 sm:p-10 text-left">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8 pb-8 border-b border-slate-200">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Part 2 &middot; Workspace Software Subscription
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Dashboard Access: ₹1,999 / user / month
              </h3>
              <p className="text-sm text-slate-600 mt-2.5 leading-relaxed">
                {DASHBOARD_ACCESS_INFO.explanation}
              </p>

              {/* Feature grid */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {DASHBOARD_ACCESS_INFO.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-xs text-slate-700">
                    <Check className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span className="font-medium">{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interactive User Count Calculator */}
            <div className="lg:w-80 shrink-0 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-brand-600" />
                  <span>Select Dashboard Users</span>
                </span>
                <span className="text-xs font-mono font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                  {dashboardUserCount} {dashboardUserCount === 1 ? 'user' : 'users'}
                </span>
              </div>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-1.5">
                {[1, 3, 5, 10].map((num) => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setDashboardUserCount(num)}
                    className={`py-1.5 rounded-lg text-xs font-bold border transition-colors cursor-pointer ${
                      dashboardUserCount === num
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {num} {num === 1 ? 'User' : 'Users'}
                  </button>
                ))}
              </div>

              {/* Slider for custom range */}
              <div>
                <input
                  type="range"
                  min="1"
                  max="25"
                  value={dashboardUserCount}
                  onChange={(e) => setDashboardUserCount(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                  aria-label="Dashboard user seats"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>1 user</span>
                  <span>10 users</span>
                  <span>25 users</span>
                </div>
              </div>

              {/* Monthly Subscription Total */}
              <div className="pt-3 border-t border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Monthly Workspace Fee:</span>
                <div className="text-right">
                  <span className="text-xl font-extrabold text-slate-900 font-mono">
                    {formatInr(calculatedDashboardMonthly)}
                  </span>
                  <span className="text-[10px] text-slate-400 block">/month before GST</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  trackMooviqEvent('cta_click', {
                    location: 'pricing_dashboard_access',
                    users: dashboardUserCount,
                  });
                  onSelectPricingCta({
                    enquiryType: 'Book a demo',
                    dashboardUsers: dashboardUserCount,
                    note: `Interested in Mooviq Dashboard Access for ${dashboardUserCount} user(s) (${formatInr(
                      calculatedDashboardMonthly
                    )}/mo before GST).`,
                  });
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Include in Enquiry
              </button>
            </div>
          </div>

          <div className="mt-5 text-xs text-slate-500 flex items-start gap-2">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Billing Separation:</strong> {PRICING_POLICY_NOTES.separationNote}
            </span>
          </div>
        </div>

        {/* ======================================================== */}
        {/* PART 4: MEDIA-WISE AUDIT PRICING TABLE                   */}
        {/* ======================================================== */}
        <div className="mt-16 text-left">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 mb-8">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
                Part 3 &middot; Standard Audit Rate Card
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Transparent Pricing for Every Media Audit
              </h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Different advertising formats require different verification methods. Mooviq uses
                media-specific credits so you pay according to the auditing requirements.
              </p>
            </div>

            <button
              type="button"
              onClick={() => onJumpToQuoteBuilder()}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shrink-0 transition-colors cursor-pointer shadow-sm"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Open Multi-Media Quote Builder</span>
            </button>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between mb-4">
            {/* Category Pills */}
            <div className="flex flex-wrap gap-1.5">
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

            {/* Search Input */}
            <div className="relative sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={rateSearch}
                onChange={(e) => setRateSearch(e.target.value)}
                placeholder="Search media format or unit..."
                className="w-full pl-9 pr-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500"
              />
            </div>
          </div>

          {/* Table Container */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-xs">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-4">Media Type</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Billing Unit</th>
                  <th className="py-3 px-4 text-right">Credits</th>
                  <th className="py-3 px-4 text-right">Audit Price</th>
                  <th className="py-3 px-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRates.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No media formats found matching your search. Try adjusting keywords or category filters.
                    </td>
                  </tr>
                ) : (
                  filteredRates.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-slate-900">
                        {item.name}
                        {item.notes && (
                          <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                            {item.notes}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        <span className="inline-block px-2 py-0.5 rounded-md bg-slate-100 text-[10px] font-medium text-slate-700">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        <span className="bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded text-[11px]">
                          {item.billingUnit}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-brand-700">
                        {item.credits.toLocaleString()} cr
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-extrabold text-slate-900">
                        {formatInr(item.unitPriceInr)}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            trackMooviqEvent('rate_table_add_to_quote', { media_id: item.id });
                            onJumpToQuoteBuilder(item);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-700 text-slate-700 text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          <Plus className="w-3 h-3" />
                          <span>Add to Quote</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            * Benchmark rates in INR before applicable GST. Billing units strictly applied (per audit task, per month, per location per day, per store, per promoter per day).
          </p>
        </div>

        {/* ======================================================== */}
        {/* PART 5: ADDITIONAL MEDIA TYPES WE SUPPORT                */}
        {/* ======================================================== */}
        <div className="mt-16 text-left">
          <div className="max-w-2xl mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600">
              Part 4 &middot; Specialized &amp; Broadcast Formats
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Additional Media Types We Support
            </h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">
              Mooviq audits extend far beyond road hoardings and auto wraps. For specialized infrastructure,
              digital networks, and broadcast delivery, we provide custom verification workflows tailored
              to each medium’s native proof sources.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ADDITIONAL_MEDIA_CATALOG.map((group) => {
              const isExpanded = expandedAdditionalCategory === group.category;
              return (
                <div
                  key={group.category}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs transition-all"
                >
                  <div
                    onClick={() =>
                      setExpandedAdditionalCategory(isExpanded ? null : group.category)
                    }
                    className="flex items-center justify-between cursor-pointer select-none"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-slate-900">{group.category}</h4>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          Custom Quote
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{group.description}</p>
                    </div>
                    <button
                      type="button"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                      aria-label={isExpanded ? 'Collapse' : 'Expand'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-[11px] text-slate-600">
                        <strong className="text-slate-800">Evidence Method:</strong>{' '}
                        {group.verificationEvidence}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                        {group.items.map((subItem) => (
                          <div
                            key={subItem.id}
                            className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                          >
                            <span className="text-xs font-semibold text-slate-800 block">
                              {subItem.name}
                            </span>
                            <span className="text-[10px] text-slate-500 block mt-0.5">
                              {subItem.details}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-end">
                        <button
                          type="button"
                          onClick={() => {
                            trackMooviqEvent('cta_click', {
                              location: 'additional_media',
                              category: group.category,
                            });
                            onSelectPricingCta({
                              enquiryType: 'Request media-wise quote',
                              note: `Requesting custom audit quote for ${group.category} formats.`,
                            });
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                        >
                          <span>Request Media-Wise Quote</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
