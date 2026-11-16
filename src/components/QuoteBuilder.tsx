import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  Sliders,
  Users,
  Search,
  Sparkles,
  HelpCircle,
  AlertTriangle,
  Building,
} from 'lucide-react';
import {
  FIXED_MEDIA_RATE_CARD,
  ADDITIONAL_MEDIA_CATALOG,
  NOMINAL_CREDIT_VALUE_INR,
  DASHBOARD_FEE_PER_USER_MONTHLY_INR,
  FixedMediaRate,
} from '../config/pricingConfig';
import { MediaTypeItem } from '../config/mediaAuditCatalog';
import {
  calculateQuoteBreakdown,
  buildQuotationSummaryText,
  clampQuantity,
  formatInr,
} from '../lib/quoteCalculator';
import { QuoteMediaRow, QuotePrefillPayload } from '../types/mooviq';
import { trackMooviqEvent } from '../lib/analytics';

interface QuoteBuilderProps {
  externalAddedMedia?: MediaTypeItem | null;
  externalAddedRate?: FixedMediaRate | null;
  onExternalMediaConsumed?: () => void;
  onSubmitToContact: (payload: QuotePrefillPayload) => void;
}

const DEFAULT_ROWS: QuoteMediaRow[] = [
  {
    id: 'row-1',
    mediaRateId: 'hoarding-billboard',
    mediaName: 'Hoarding / Billboard',
    category: 'Outdoor Advertising',
    units: 25,
    multiplier: 2,
    cityScope: 'Delhi NCR, Mumbai',
    isCustomQuote: false,
  },
  {
    id: 'row-2',
    mediaRateId: 'auto-rickshaw-branding',
    mediaName: 'Auto / E-Rickshaw Branding',
    category: 'Transit & Vehicle Advertising',
    units: 250,
    multiplier: 1,
    cityScope: 'Bengaluru, Hyderabad',
    isCustomQuote: false,
  },
];

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  externalAddedMedia,
  externalAddedRate,
  onExternalMediaConsumed,
  onSubmitToContact,
}) => {
  const [dashboardUsers, setDashboardUsers] = useState<number>(3);
  const [rows, setRows] = useState<QuoteMediaRow[]>(DEFAULT_ROWS);
  const [selectedAddMediaId, setSelectedAddMediaId] = useState<string>(FIXED_MEDIA_RATE_CARD[0].id);
  const [searchFilter, setSearchFilter] = useState<string>('');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Consume externally selected rate from Pricing table
  useEffect(() => {
    if (!externalAddedRate) return;
    setRows((prev) => {
      const exists = prev.some((r) => r.mediaRateId === externalAddedRate.id);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: `row-${Date.now()}`,
          mediaRateId: externalAddedRate.id,
          mediaName: externalAddedRate.name,
          category: externalAddedRate.category,
          units: 20,
          multiplier: externalAddedRate.defaultMultiplier || 1,
          cityScope: 'Metro cluster',
          isCustomQuote: false,
        },
      ];
    });
    if (onExternalMediaConsumed) onExternalMediaConsumed();
  }, [externalAddedRate, onExternalMediaConsumed]);

  // Consume externally selected media from MediaCoverage drawer
  useEffect(() => {
    if (!externalAddedMedia) return;
    setRows((prev) => {
      // Find matching fixed rate or make custom
      const matchedFixed = FIXED_MEDIA_RATE_CARD.find(
        (r) =>
          r.name.toLowerCase().includes(externalAddedMedia.name.toLowerCase()) ||
          externalAddedMedia.name.toLowerCase().includes(r.name.toLowerCase())
      );

      if (matchedFixed) {
        const exists = prev.some((r) => r.mediaRateId === matchedFixed.id);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: `row-${Date.now()}`,
            mediaRateId: matchedFixed.id,
            mediaName: matchedFixed.name,
            category: matchedFixed.category,
            units: 20,
            multiplier: matchedFixed.defaultMultiplier || 1,
            cityScope: 'Metro cluster',
            isCustomQuote: false,
          },
        ];
      }

      // Add as custom quote item
      const exists = prev.some((r) => r.mediaName === externalAddedMedia.name);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: `row-${Date.now()}`,
          mediaRateId: `custom-${externalAddedMedia.id}`,
          mediaName: externalAddedMedia.name,
          category: externalAddedMedia.familyId,
          units: 10,
          multiplier: 1,
          cityScope: 'Metro cluster',
          isCustomQuote: true,
        },
      ];
    });
    if (onExternalMediaConsumed) onExternalMediaConsumed();
  }, [externalAddedMedia, onExternalMediaConsumed]);

  const calculation = useMemo(
    () => calculateQuoteBreakdown(dashboardUsers, rows),
    [dashboardUsers, rows]
  );

  const formattedSummaryText = useMemo(
    () => buildQuotationSummaryText(calculation),
    [calculation]
  );

  // Available options to add
  const availableMediaOptions = useMemo(() => {
    const list: { id: string; name: string; category: string; isCustom: boolean; credits?: number }[] = [];

    // Fixed rates
    FIXED_MEDIA_RATE_CARD.forEach((r) => {
      list.push({
        id: r.id,
        name: r.name,
        category: r.category,
        isCustom: false,
        credits: r.credits,
      });
    });

    // Custom items from additional media catalog
    ADDITIONAL_MEDIA_CATALOG.forEach((group) => {
      group.items.forEach((item) => {
        list.push({
          id: item.id,
          name: item.name,
          category: group.category,
          isCustom: true,
        });
      });
    });

    if (!searchFilter.trim()) return list;
    const q = searchFilter.toLowerCase();
    return list.filter((item) => item.name.toLowerCase().includes(q) || item.category.toLowerCase().includes(q));
  }, [searchFilter]);

  const handleAddRow = () => {
    const targetOption = availableMediaOptions.find((m) => m.id === selectedAddMediaId) || availableMediaOptions[0];
    if (!targetOption) return;

    if (targetOption.isCustom) {
      setRows((prev) => [
        ...prev,
        {
          id: `row-${Date.now()}-${prev.length + 1}`,
          mediaRateId: targetOption.id,
          mediaName: targetOption.name,
          category: targetOption.category,
          units: 10,
          multiplier: 1,
          cityScope: 'Pan-India',
          isCustomQuote: true,
        },
      ]);
    } else {
      const fixedRate = FIXED_MEDIA_RATE_CARD.find((r) => r.id === targetOption.id)!;
      setRows((prev) => [
        ...prev,
        {
          id: `row-${Date.now()}-${prev.length + 1}`,
          mediaRateId: fixedRate.id,
          mediaName: fixedRate.name,
          category: fixedRate.category,
          units: 20,
          multiplier: fixedRate.defaultMultiplier || 1,
          cityScope: 'Metro cluster',
          isCustomQuote: false,
        },
      ]);
    }
    trackMooviqEvent('quote_builder_add_row', { media_id: targetOption.id });
  };

  const handleRemoveRow = (rowId: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleUpdateRow = (rowId: string, patch: Partial<QuoteMediaRow>) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        return { ...row, ...patch };
      })
    );
  };

  const handleReset = () => {
    setDashboardUsers(3);
    setRows(DEFAULT_ROWS);
    trackMooviqEvent('quote_builder_reset', {});
  };

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(formattedSummaryText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // Ignore if clipboard unavailable
    }
  };

  const handleSendToContact = () => {
    const mediaNames = Array.from(new Set(calculation.rows.map((r) => r.mediaName)));
    const cityList = Array.from(
      new Set(
        rows
          .map((r) => r.cityScope.trim())
          .filter(Boolean)
      )
    ).join(', ');

    trackMooviqEvent('quote_builder_submit', {
      dashboard_users: dashboardUsers,
      total_credits: calculation.totalCredits,
      total_events: calculation.totalBillableEvents,
      media_rows: rows.length,
    });

    const recommended = calculation.walletRecommendation.recommendedPackage;

    onSubmitToContact({
      enquiryType: 'Request media-wise quote',
      walletPackageId: recommended?.id,
      walletPackageName: recommended?.name,
      dashboardUsers,
      dashboardMonthlyInr: calculation.dashboardMonthlyInr,
      totalCredits: calculation.totalCredits,
      estimatedAuditCostInr: calculation.totalAuditCostInr,
      selectedMediaNames: mediaNames,
      totalAuditEvents: calculation.totalBillableEvents,
      cityScope: cityList,
      summaryText: formattedSummaryText,
    });
  };

  return (
    <section id="quote-builder" className="scroll-mt-20 py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-brand-600" />
            <span>Interactive Estimator</span>
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Build Your Mooviq Audit Quotation
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Select your advertising formats, enter unit counts and inspection cycles according to each format’s
            billing unit, and configure dashboard access seats. Unpriced media formats are marked for custom quoting.
          </p>
        </div>

        {/* Spacious Two-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          {/* ======================================================== */}
          {/* LEFT PANEL: BUILDER CONTROLS                             */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-7">
            {/* Step 1: Add Media Row Header */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px]">1</span>
                  <span>Select &amp; Add Media Formats</span>
                </label>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset All</span>
                </button>
              </div>

              {/* Add format selector bar */}
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <select
                    value={selectedAddMediaId}
                    onChange={(e) => setSelectedAddMediaId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-brand-500"
                  >
                    <optgroup label="Fixed-Rate Media Formats">
                      {FIXED_MEDIA_RATE_CARD.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} ({r.credits} cr · {r.billingUnit})
                        </option>
                      ))}
                    </optgroup>
                    {ADDITIONAL_MEDIA_CATALOG.map((group) => (
                      <optgroup key={group.category} label={`Custom Quote: ${group.category}`}>
                        {group.items.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} (Custom Quote)
                          </option>
                        ))}
                      </optgroup>
                    ))}
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleAddRow}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shrink-0 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Format</span>
                </button>
              </div>
            </div>

            {/* Step 2: Configured Media Rows List */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px]">2</span>
                  <span>Enter Audit Quantities ({rows.length} {rows.length === 1 ? 'format' : 'formats'})</span>
                </span>
                <span className="text-[11px] text-slate-400">Context-aware billing units</span>
              </div>

              <div className="space-y-3.5">
                {rows.map((row) => {
                  const fixedRate = FIXED_MEDIA_RATE_CARD.find((r) => r.id === row.mediaRateId);
                  const isCustom = row.isCustomQuote || !fixedRate;

                  // Dynamic labels based on billing unit
                  let unitInputLabel = 'Media Units';
                  let multiplierInputLabel = 'Inspections per Unit';

                  if (fixedRate) {
                    if (fixedRate.billingUnit === 'per month') {
                      unitInputLabel = 'Number of Vans';
                      multiplierInputLabel = 'Duration (Months)';
                    } else if (fixedRate.billingUnit === 'per location per day') {
                      unitInputLabel = 'Distribution Locations';
                      multiplierInputLabel = 'Days Audited';
                    } else if (fixedRate.billingUnit === 'per promoter per day') {
                      unitInputLabel = 'Number of Promoters';
                      multiplierInputLabel = 'Days Active';
                    } else if (fixedRate.billingUnit === 'per store up to 3 elements') {
                      unitInputLabel = 'Stores Audited';
                      multiplierInputLabel = 'Audit Rounds';
                    }
                  }

                  const lineTotalEvents = row.units * row.multiplier;
                  const lineTotalCredits = fixedRate ? lineTotalEvents * fixedRate.credits : null;
                  const lineCostInr = lineTotalCredits ? lineTotalCredits * NOMINAL_CREDIT_VALUE_INR : null;

                  return (
                    <div
                      key={row.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all space-y-3"
                    >
                      {/* Row Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">{row.mediaName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-medium">
                            {row.category}
                          </span>
                          {isCustom ? (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                              Custom Quote
                            </span>
                          ) : (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-brand-50 text-brand-700 font-mono font-bold">
                              {fixedRate?.credits} cr / {fixedRate?.billingUnit}
                            </span>
                          )}
                        </div>

                        {rows.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(row.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-600 transition-colors"
                            aria-label={`Remove ${row.mediaName}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>

                      {/* Row Inputs */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            {unitInputLabel}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100000"
                            value={row.units}
                            onChange={(e) =>
                              handleUpdateRow(row.id, {
                                units: clampQuantity(parseInt(e.target.value, 10) || 1, 1, 100000),
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-slate-200 font-mono focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            {multiplierInputLabel}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            value={row.multiplier}
                            onChange={(e) =>
                              handleUpdateRow(row.id, {
                                multiplier: clampQuantity(parseInt(e.target.value, 10) || 1, 1, 365),
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-slate-200 font-mono focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            City / Cluster Scope
                          </label>
                          <input
                            type="text"
                            value={row.cityScope}
                            onChange={(e) => handleUpdateRow(row.id, { cityScope: e.target.value })}
                            placeholder="e.g. Mumbai, NCR"
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-slate-200 focus:outline-none focus:border-brand-500"
                          />
                        </div>
                      </div>

                      {/* Row Calculation Subtotal Strip */}
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-xs text-slate-600">
                        <span className="text-[11px]">
                          Quantity: <strong>{lineTotalEvents.toLocaleString()}</strong> billable {fixedRate?.billingUnit || 'tasks'}
                        </span>
                        {isCustom ? (
                          <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">
                            Quote Required
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-brand-700 font-bold">
                              {lineTotalCredits?.toLocaleString()} Credits
                            </span>
                            <span className="text-slate-300">&middot;</span>
                            <span className="font-mono font-extrabold text-slate-900">
                              {formatInr(lineCostInr || 0)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Dashboard User Licences */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px]">3</span>
                  <span>Dashboard User Licences</span>
                </label>
                <span className="text-xs font-mono font-bold text-brand-600">
                  {dashboardUsers} {dashboardUsers === 1 ? 'user' : 'users'} &middot; {formatInr(calculation.dashboardMonthlyInr)}/mo
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                Mooviq dashboard subscriptions are billed at ₹{DASHBOARD_FEE_PER_USER_MONTHLY_INR} per user per month.
                Select how many team members need campaign visibility and report access.
              </p>

              <div className="grid grid-cols-4 gap-2">
                {[1, 3, 5, 10].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setDashboardUsers(count)}
                    className={`py-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                      dashboardUsers === count
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {count} {count === 1 ? 'User' : 'Users'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT PANEL: LIVE QUOTATION SUMMARY                      */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-md space-y-5">
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">Quotation Summary</h3>
                  <span className="text-[11px] text-slate-500">Live credit &amp; cost calculation</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                >
                  {copiedSummary ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSummary ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              {/* Media Breakdown List */}
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                {calculation.rows.map((row) => (
                  <div
                    key={row.id}
                    className="flex items-start justify-between text-xs py-1 border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{row.mediaName}</span>
                      <span className="text-[11px] text-slate-500">
                        {row.billableQuantity} {row.billingUnit} &middot; {row.cityScope}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      {row.isCustomQuote ? (
                        <span className="text-[11px] font-bold text-amber-700">Quote Required</span>
                      ) : (
                        <>
                          <span className="font-mono font-bold text-brand-700 block">
                            {row.lineCredits?.toLocaleString()} cr
                          </span>
                          <span className="font-mono text-[11px] text-slate-500">
                            {formatInr(row.lineCostInr || 0)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Credits & Audit Cost Highlight */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-slate-300">Total Credits Needed:</span>
                  <div className="text-right">
                    <span className="text-2xl font-extrabold font-mono text-brand-300">
                      {calculation.totalCredits.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-400 block">Mooviq Credits</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                  <div>
                    <span className="text-xs text-slate-300">Est. Audit Service Cost:</span>
                    <span className="text-[10px] text-slate-400 block">At ₹{NOMINAL_CREDIT_VALUE_INR} / credit (before GST)</span>
                  </div>
                  <span className="text-xl font-extrabold font-mono text-white">
                    {formatInr(calculation.totalAuditCostInr)}
                  </span>
                </div>
              </div>

              {/* Recurring Dashboard Subscription Box */}
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">Dashboard Subscription</span>
                  <span className="text-[11px] text-slate-500">
                    {dashboardUsers} user(s) &middot; Billed monthly separately
                  </span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-bold text-slate-900">
                    {formatInr(calculation.dashboardMonthlyInr)}
                  </span>
                  <span className="text-[10px] text-slate-500 block">/month</span>
                </div>
              </div>

              {/* Wallet Recommendation Card */}
              {calculation.walletRecommendation.recommendedPackage && (
                <div className="p-4 rounded-2xl bg-brand-50/70 border border-brand-200/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-brand-800">
                    <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                    <span>
                      Recommended Wallet: {calculation.walletRecommendation.recommendedPackage.name}
                    </span>
                  </div>
                  <p className="text-xs text-brand-900 leading-relaxed">
                    {calculation.walletRecommendation.message}
                  </p>
                  <p className="text-[10px] text-brand-700 pt-0.5">
                    Prepaid wallet covers audit tasks directly; not an extra fee on top of audits.
                  </p>
                </div>
              )}

              {/* Custom Quote Notice if applicable */}
              {calculation.hasCustomQuoteItems && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    <strong>{calculation.customQuoteRowsCount} specialized format(s)</strong> require a custom
                    quote based on network logs or location access. Our team will verify and quote them during onboarding.
                  </span>
                </div>
              )}

              {/* Primary Call to Action */}
              <button
                type="button"
                onClick={handleSendToContact}
                className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Get My Detailed Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-[10px] text-slate-400">
                Transfers these requirements directly to our contact form &middot; ₹0 setup fee
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
