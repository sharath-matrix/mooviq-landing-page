import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Trash2,
  RotateCcw,
  Copy,
  Check,
  ArrowRight,
  Sliders,
  Info,
} from 'lucide-react';
import {
  MEDIA_FAMILIES,
  MEDIA_CATALOG,
  MediaFamilyId,
  MediaTypeItem,
} from '../config/mediaAuditCatalog';
import { DASHBOARD_ACCESS_PACKAGES } from '../config/pricingConfig';
import { calculateQuoteBreakdown, clampQuantity } from '../lib/quoteCalculator';
import { QuoteMediaRow, QuotePrefillPayload } from '../types/mooviq';
import { trackMooviqEvent } from '../lib/analytics';

interface QuoteBuilderProps {
  externalAddedMedia?: MediaTypeItem | null;
  onExternalMediaConsumed?: () => void;
  onSubmitToContact: (payload: QuotePrefillPayload) => void;
}

const DEFAULT_ROWS: QuoteMediaRow[] = [
  {
    id: 'row-1',
    familyId: 'outdoor-ooh',
    mediaTypeId: 'billboards-hoardings',
    units: 25,
    rounds: 2,
    cityScope: 'Delhi NCR, Mumbai',
  },
  {
    id: 'row-2',
    familyId: 'indoor-place-based',
    mediaTypeId: 'mall-media',
    units: 40,
    rounds: 1,
    cityScope: 'Mumbai, Bengaluru',
  },
];

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  externalAddedMedia,
  onExternalMediaConsumed,
  onSubmitToContact,
}) => {
  const [selectedDashboardId, setSelectedDashboardId] = useState<string>('agency');
  const [rows, setRows] = useState<QuoteMediaRow[]>(DEFAULT_ROWS);
  const [frequency, setFrequency] = useState<'One-time' | 'Weekly' | 'Monthly' | 'Custom'>('Monthly');
  const [verificationMode, setVerificationMode] = useState<
    'Onsite field audit' | 'Remote log verification' | 'Hybrid (Onsite + Logs)'
  >('Hybrid (Onsite + Logs)');
  const [customNotes, setCustomNotes] = useState<string>('');
  const [copiedSummary, setCopiedSummary] = useState<boolean>(false);

  // Allow adding a format directly from MediaCoverage drawer
  useEffect(() => {
    if (!externalAddedMedia) return;
    setRows((prev) => {
      const exists = prev.some((r) => r.mediaTypeId === externalAddedMedia.id);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: `row-${Date.now()}`,
          familyId: externalAddedMedia.familyId,
          mediaTypeId: externalAddedMedia.id,
          units: 20,
          rounds: 1,
          cityScope: 'Metro cluster',
        },
      ];
    });
    if (onExternalMediaConsumed) onExternalMediaConsumed();
  }, [externalAddedMedia, onExternalMediaConsumed]);

  const breakdown = useMemo(
    () => calculateQuoteBreakdown(selectedDashboardId, rows),
    [selectedDashboardId, rows]
  );

  const handleAddRow = () => {
    const firstFamily = MEDIA_FAMILIES[0].id;
    const firstMedia = MEDIA_CATALOG.find((m) => m.familyId === firstFamily)!;
    setRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${prev.length + 1}`,
        familyId: firstFamily,
        mediaTypeId: firstMedia.id,
        units: 10,
        rounds: 1,
        cityScope: '',
      },
    ]);
    trackMooviqEvent('quote_builder_update', { action: 'add_row', total_rows: rows.length + 1 });
  };

  const handleRemoveRow = (rowId: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleUpdateRow = (rowId: string, patch: Partial<QuoteMediaRow>) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        const next = { ...row, ...patch };
        if (patch.familyId && patch.familyId !== row.familyId) {
          const defaultMedia = MEDIA_CATALOG.find((m) => m.familyId === patch.familyId);
          if (defaultMedia) next.mediaTypeId = defaultMedia.id;
        }
        return next;
      })
    );
  };

  const handleReset = () => {
    setSelectedDashboardId('agency');
    setRows(DEFAULT_ROWS);
    setFrequency('Monthly');
    setVerificationMode('Hybrid (Onsite + Logs)');
    setCustomNotes('');
  };

  const formattedSummaryText = useMemo(() => {
    const planLabel =
      selectedDashboardId === 'none'
        ? 'Audit Services Only (No Dashboard Plan)'
        : breakdown.dashboardPlan
        ? `${breakdown.dashboardPlan.name} (${breakdown.dashboardPlan.priceLabel}${
            breakdown.dashboardPlan.monthlyPriceInr !== null ? '/mo before GST' : ''
          })`
        : 'Not selected';

    const mediaLines = breakdown.rows.map(
      (r, idx) =>
        `${idx + 1}. ${r.mediaName}: ${r.units} units x ${r.rounds} round(s) = ${r.auditEvents} audit events | Cities: ${r.cityScope} | Service pricing: ${
          r.lineSubtotalInr !== null
            ? `₹${r.lineSubtotalInr.toLocaleString()}`
            : 'Custom quote required'
        }`
    );

    const lines = [
      'Mooviq Media Audit Plan Summary',
      `Dashboard Plan: ${planLabel}`,
      `Frequency: ${frequency} | Mode: ${verificationMode}`,
      `Total Estimated Audit Events: ${breakdown.totalAuditEvents.toLocaleString()}`,
      'Media Breakdown:',
      ...mediaLines,
      breakdown.pricedRowsCount > 0
        ? `Partial Priced Media Subtotal: ₹${breakdown.partialServiceSubtotalInr.toLocaleString()} (excludes unpriced custom items)`
        : 'Media Audit Service Pricing: Custom quote required based on media plan.',
    ];

    if (customNotes.trim()) {
      lines.push(`Notes: ${customNotes.trim()}`);
    }

    return lines.join('\n');
  }, [selectedDashboardId, breakdown, frequency, verificationMode, customNotes]);

  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(formattedSummaryText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2000);
    } catch {
      // Clipboard blocked in non-HTTPS contexts; ignore silently
    }
  };

  const handleSendToContact = () => {
    const mediaNames = Array.from(new Set(breakdown.rows.map((r) => r.mediaName)));
    const cityList = Array.from(
      new Set(
        rows
          .map((r) => r.cityScope.trim())
          .filter(Boolean)
      )
    ).join(', ');

    trackMooviqEvent('quote_builder_submit', {
      dashboard_plan: selectedDashboardId,
      total_audit_events: breakdown.totalAuditEvents,
      media_rows: rows.length,
    });

    onSubmitToContact({
      enquiryType: 'Request media-wise quote',
      dashboardPlanId: selectedDashboardId,
      dashboardPlanLabel:
        breakdown.dashboardPlan?.name || 'Audit Services Only',
      selectedMediaNames: mediaNames,
      totalAuditEvents: breakdown.totalAuditEvents,
      cityScope: cityList,
      summaryText: formattedSummaryText,
    });
  };

  return (
    <section id="quote-builder" className="scroll-mt-20 py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl text-left mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Multi-Media Quote Builder
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Plan your media audits
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Combine your dashboard access tier with the media formats, unit quantities, and audit rounds in your plan. Unpriced formats are clearly marked for custom quoting—never guessed or treated as ₹0.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start text-left">
          {/* Left Builder Controls */}
          <div className="lg:col-span-8 bg-white rounded-3xl border border-slate-200 p-5 sm:p-7 shadow-xs space-y-6">
            {/* Step 1: Dashboard Access Selector */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-brand-600" />
                  <span>1. Dashboard Access Package (Proposed, Before GST)</span>
                </label>
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {DASHBOARD_ACCESS_PACKAGES.map((pkg) => (
                  <button
                    key={pkg.id}
                    type="button"
                    onClick={() => setSelectedDashboardId(pkg.id)}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      selectedDashboardId === pkg.id
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold block">{pkg.name}</span>
                    <span
                      className={`text-[11px] font-mono block mt-0.5 ${
                        selectedDashboardId === pkg.id ? 'text-brand-300' : 'text-brand-600 font-semibold'
                      }`}
                    >
                      {pkg.priceLabel}
                      {pkg.monthlyPriceInr !== null ? '/mo' : ''}
                    </span>
                    <span
                      className={`text-[10px] block mt-0.5 ${
                        selectedDashboardId === pkg.id ? 'text-slate-300' : 'text-slate-500'
                      }`}
                    >
                      {pkg.userLimitLabel}
                    </span>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setSelectedDashboardId('none')}
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                    selectedDashboardId === 'none'
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span className="text-xs font-bold block">Audit Services Only</span>
                  <span
                    className={`text-[11px] font-mono block mt-0.5 ${
                      selectedDashboardId === 'none' ? 'text-slate-300' : 'text-slate-500'
                    }`}
                  >
                    No dashboard seat
                  </span>
                  <span
                    className={`text-[10px] block mt-0.5 ${
                      selectedDashboardId === 'none' ? 'text-slate-400' : 'text-slate-500'
                    }`}
                  >
                    Report delivery only
                  </span>
                </button>
              </div>
            </div>

            {/* Step 2: Media Rows */}
            <div className="pt-5 border-t border-slate-100">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                  2. Media Formats &amp; Expected Volume
                </span>
                <button
                  type="button"
                  onClick={handleAddRow}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 text-xs font-bold border border-brand-200 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Media Row</span>
                </button>
              </div>

              <div className="space-y-3">
                {rows.map((row, index) => {
                  const familyMediaOptions = MEDIA_CATALOG.filter((m) => m.familyId === row.familyId);
                  const rowCalc = breakdown.rows[index];

                  return (
                    <div
                      key={row.id}
                      className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                          Line Item #{index + 1} · {rowCalc.auditEvents.toLocaleString()} audit events
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                            {rowCalc.lineSubtotalInr !== null
                              ? `₹${rowCalc.lineSubtotalInr.toLocaleString()}`
                              : 'Custom quote required'}
                          </span>
                          {rows.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveRow(row.id)}
                              aria-label={`Remove line item ${index + 1}`}
                              className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
                        {/* Category / Family */}
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                            Media Family
                          </label>
                          <select
                            aria-label={`Row ${index + 1} media family`}
                            value={row.familyId}
                            onChange={(e) =>
                              handleUpdateRow(row.id, { familyId: e.target.value as MediaFamilyId })
                            }
                            className="w-full px-2.5 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:border-brand-500 text-slate-900"
                          >
                            {MEDIA_FAMILIES.map((f) => (
                              <option key={f.id} value={f.id}>
                                {f.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Specific Media Type */}
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                            Specific Format
                          </label>
                          <select
                            aria-label={`Row ${index + 1} specific media format`}
                            value={row.mediaTypeId}
                            onChange={(e) => handleUpdateRow(row.id, { mediaTypeId: e.target.value })}
                            className="w-full px-2.5 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:border-brand-500 text-slate-900"
                          >
                            {familyMediaOptions.map((m) => (
                              <option key={m.id} value={m.id}>
                                {m.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Estimated Units */}
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                            Media Units
                          </label>
                          <input
                            type="number"
                            min={0}
                            max={50000}
                            aria-label={`Row ${index + 1} estimated units`}
                            value={row.units}
                            onChange={(e) =>
                              handleUpdateRow(row.id, {
                                units: clampQuantity(Number(e.target.value), 0, 50000),
                              })
                            }
                            className="w-full px-2.5 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:border-brand-500 text-slate-900 font-mono"
                          />
                        </div>

                        {/* Rounds */}
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                            Audit Rounds
                          </label>
                          <input
                            type="number"
                            min={1}
                            max={52}
                            aria-label={`Row ${index + 1} audit rounds`}
                            value={row.rounds}
                            onChange={(e) =>
                              handleUpdateRow(row.id, {
                                rounds: clampQuantity(Number(e.target.value), 1, 52),
                              })
                            }
                            className="w-full px-2.5 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:border-brand-500 text-slate-900 font-mono"
                          />
                        </div>

                        {/* Cities */}
                        <div>
                          <label className="text-[10px] font-semibold text-slate-500 block mb-1">
                            City / Coverage Scope
                          </label>
                          <input
                            type="text"
                            placeholder="e.g. Mumbai, Pune"
                            aria-label={`Row ${index + 1} city scope`}
                            value={row.cityScope}
                            onChange={(e) => handleUpdateRow(row.id, { cityScope: e.target.value })}
                            className="w-full px-2.5 py-2 rounded-xl text-xs bg-white border border-slate-200 focus:outline-none focus:border-brand-500 text-slate-900"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Frequency, Verification Mode & Notes */}
            <div className="pt-5 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">
                  3. Audit Frequency
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {(['One-time', 'Weekly', 'Monthly', 'Custom'] as const).map((freq) => (
                    <button
                      key={freq}
                      type="button"
                      onClick={() => setFrequency(freq)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        frequency === freq
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {freq}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="qb-verification-mode" className="text-xs font-bold text-slate-700 block mb-1.5">
                  4. Verification Mode
                </label>
                <select
                  id="qb-verification-mode"
                  value={verificationMode}
                  onChange={(e) =>
                    setVerificationMode(
                      e.target.value as
                        | 'Onsite field audit'
                        | 'Remote log verification'
                        | 'Hybrid (Onsite + Logs)'
                    )
                  }
                  className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
                >
                  <option value="Onsite field audit">Onsite field audit (Physical media)</option>
                  <option value="Remote log verification">Remote log verification (Screen / Broadcast)</option>
                  <option value="Hybrid (Onsite + Logs)">Hybrid (Onsite + Proof-of-Play Logs)</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="qb-notes" className="text-xs font-bold text-slate-700 block mb-1.5">
                Custom Evidence / Reporting Requirements (Optional)
              </label>
              <input
                id="qb-notes"
                type="text"
                placeholder="e.g. Night illumination checks, multiplex RO reconciliation, specific turnaround..."
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 text-slate-900"
              />
            </div>
          </div>

          {/* Right Live Summary Card */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5 sticky top-24">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                Audit Scope Summary
              </span>
              <h3 className="text-lg font-bold text-slate-900 mt-1">
                Plan Breakdown
              </h3>
            </div>

            {/* Dashboard Subscription Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
              <span className="text-[11px] text-slate-500 block">
                Dashboard Access (Proposed, before GST)
              </span>
              <div className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-bold text-slate-900">
                  {selectedDashboardId === 'none'
                    ? 'None (Services Only)'
                    : breakdown.dashboardPlan?.name}
                </span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">
                  {selectedDashboardId === 'none'
                    ? '₹0'
                    : breakdown.dashboardPlan?.priceLabel}
                  {breakdown.dashboardMonthlyInr && breakdown.dashboardMonthlyInr > 0 ? (
                    <span className="text-xs font-normal text-slate-500">/mo</span>
                  ) : null}
                </span>
              </div>
              {breakdown.dashboardPlan && (
                <span className="text-[11px] text-slate-500 block">
                  {breakdown.dashboardPlan.userLimitLabel}
                </span>
              )}
            </div>

            {/* Audit Event Metrics */}
            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Media Units
                </span>
                <span className="text-xl font-extrabold text-slate-900 font-mono">
                  {breakdown.totalMediaUnits.toLocaleString()}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                  Audit Events
                </span>
                <span className="text-xl font-extrabold text-brand-600 font-mono">
                  {breakdown.totalAuditEvents.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Media Service Pricing Status */}
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 space-y-2 text-xs text-amber-950">
              <div className="flex items-center justify-between font-bold">
                <span>Audit Execution Services:</span>
                <span>
                  {breakdown.pricedRowsCount > 0 && !breakdown.hasUnpricedItems
                    ? `₹${breakdown.partialServiceSubtotalInr.toLocaleString()}`
                    : 'Custom quote required'}
                </span>
              </div>

              {breakdown.pricedRowsCount > 0 && breakdown.hasUnpricedItems && (
                <p className="text-[11px] text-amber-900">
                  Partial priced subtotal: ₹{breakdown.partialServiceSubtotalInr.toLocaleString()} ({breakdown.pricedRowsCount} item(s) priced; {breakdown.unpricedRowsCount} custom item(s) excluded from subtotal).
                </p>
              )}

              <p className="text-[11px] text-amber-900 leading-relaxed flex items-start gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  Field execution, log integration, and GST are quoted per format mix and city scope—never assumed ₹0.
                </span>
              </p>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                onClick={handleSendToContact}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-600/20 transition-all cursor-pointer"
              >
                <span>Get my audit quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleCopySummary}
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
              >
                {copiedSummary ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Summary copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>Copy summary</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
