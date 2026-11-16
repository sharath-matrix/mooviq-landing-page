import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Trash2,
  RotateCcw,
  Check,
  ArrowRight,
  Sliders,
  Users,
  Search,
  Sparkles,
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  Building,
  FileText,
  Lock,
} from 'lucide-react';
import {
  PUBLIC_MEDIA_CATALOG,
  PUBLIC_MEDIA_CATEGORIES,
  PublicMediaFormat,
  PublicMediaCategory,
} from '../config/publicMediaCatalog';
import { MediaTypeItem } from '../config/mediaAuditCatalog';
import { QuoteMediaRow, QuotePrefillPayload, UnlockedQuotation } from '../types/mooviq';
import { VerificationModal } from './VerificationModal';
import { trackMooviqEvent } from '../lib/analytics';

interface QuoteBuilderProps {
  externalAddedMedia?: MediaTypeItem | null;
  externalAddedFormat?: PublicMediaFormat | null;
  selectedPlanId?: 'starter' | 'growth' | 'enterprise';
  onExternalMediaConsumed?: () => void;
  onSubmitToContact: (payload: QuotePrefillPayload) => void;
}

const DEFAULT_ROWS: QuoteMediaRow[] = [
  {
    id: 'row-1',
    mediaRateId: 'billboard-hoarding',
    mediaName: 'Billboard / Hoarding',
    category: 'Outdoor & OOH',
    units: 25,
    multiplier: 2,
    cityScope: 'Delhi NCR, Mumbai',
    frequency: 'Monthly',
  },
  {
    id: 'row-2',
    mediaRateId: 'auto-branding',
    mediaName: 'Auto Branding',
    category: 'Transit & Vehicle',
    units: 250,
    multiplier: 1,
    cityScope: 'Bengaluru, Hyderabad',
    frequency: 'One-time',
  },
];

export const QuoteBuilder: React.FC<QuoteBuilderProps> = ({
  externalAddedMedia,
  externalAddedFormat,
  selectedPlanId,
  onExternalMediaConsumed,
  onSubmitToContact,
}) => {
  const [dashboardUsers, setDashboardUsers] = useState<number>(3);
  const [preferredPackage, setPreferredPackage] = useState<'starter' | 'growth' | 'enterprise'>(
    selectedPlanId || 'growth'
  );
  const [rows, setRows] = useState<QuoteMediaRow[]>(DEFAULT_ROWS);

  // Selector state for adding media
  const [selectedCategory, setSelectedCategory] = useState<PublicMediaCategory>('Outdoor & OOH');
  const [selectedFormatId, setSelectedFormatId] = useState<string>('billboard-hoarding');
  const [searchFilter, setSearchFilter] = useState<string>('');

  // Verification Gate state
  const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false);
  const [verifiedToken, setVerifiedToken] = useState<string | null>(null);
  const [verifiedClient, setVerifiedClient] = useState<{
    fullName: string;
    companyName: string;
    mobileNumber: string;
    workEmail: string;
  } | null>(null);

  // Unlocked quotation result from server
  const [unlockedQuotation, setUnlockedQuotation] = useState<UnlockedQuotation | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [calculationError, setCalculationError] = useState<string | null>(null);

  // Sync plan selection from props
  useEffect(() => {
    if (selectedPlanId) {
      setPreferredPackage(selectedPlanId);
    }
  }, [selectedPlanId]);

  // Handle external format added from Pricing
  useEffect(() => {
    if (!externalAddedFormat) return;
    setRows((prev) => {
      const exists = prev.some((r) => r.mediaRateId === externalAddedFormat.id);
      if (exists) return prev;
      return [
        ...prev,
        {
          id: `row-${Date.now()}`,
          mediaRateId: externalAddedFormat.id,
          mediaName: externalAddedFormat.name,
          category: externalAddedFormat.category,
          units: externalAddedFormat.defaultUnits || 20,
          multiplier: externalAddedFormat.defaultMultiplier || 1,
          cityScope: 'Metro cluster',
          frequency: 'Monthly',
        },
      ];
    });
    // Invalidate unlocked quote so client can re-calculate with new row
    setUnlockedQuotation(null);
    if (onExternalMediaConsumed) onExternalMediaConsumed();
  }, [externalAddedFormat, onExternalMediaConsumed]);

  // Handle external media item from MediaCoverage drawer
  useEffect(() => {
    if (!externalAddedMedia) return;
    setRows((prev) => {
      const matched = PUBLIC_MEDIA_CATALOG.find(
        (m) =>
          m.name.toLowerCase().includes(externalAddedMedia.name.toLowerCase()) ||
          externalAddedMedia.name.toLowerCase().includes(m.name.toLowerCase())
      );
      if (matched) {
        const exists = prev.some((r) => r.mediaRateId === matched.id);
        if (exists) return prev;
        return [
          ...prev,
          {
            id: `row-${Date.now()}`,
            mediaRateId: matched.id,
            mediaName: matched.name,
            category: matched.category,
            units: matched.defaultUnits || 20,
            multiplier: matched.defaultMultiplier || 1,
            cityScope: 'Metro cluster',
            frequency: 'Monthly',
          },
        ];
      }
      return prev;
    });
    setUnlockedQuotation(null);
    if (onExternalMediaConsumed) onExternalMediaConsumed();
  }, [externalAddedMedia, onExternalMediaConsumed]);

  // Calculate unverified aggregate statistics
  const summaryMetrics = useMemo(() => {
    let totalUnits = 0;
    let totalEvents = 0;
    const citiesSet = new Set<string>();

    rows.forEach((r) => {
      const u = Math.max(1, r.units || 1);
      const m = Math.max(1, r.multiplier || 1);
      totalUnits += u;
      totalEvents += u * m;
      if (r.cityScope.trim()) {
        r.cityScope.split(',').forEach((c) => citiesSet.add(c.trim()));
      }
    });

    return {
      totalFormats: rows.length,
      totalUnits,
      totalEvents,
      citiesList: Array.from(citiesSet).filter(Boolean).join(', ') || 'Pan-India',
    };
  }, [rows]);

  // Filter available formats for the category selector
  const availableFormatsForCategory = useMemo(() => {
    return PUBLIC_MEDIA_CATALOG.filter((f) => f.category === selectedCategory);
  }, [selectedCategory]);

  const handleAddRow = () => {
    const targetFormat =
      PUBLIC_MEDIA_CATALOG.find((f) => f.id === selectedFormatId) || availableFormatsForCategory[0];
    if (!targetFormat) return;

    setRows((prev) => [
      ...prev,
      {
        id: `row-${Date.now()}-${prev.length + 1}`,
        mediaRateId: targetFormat.id,
        mediaName: targetFormat.name,
        category: targetFormat.category,
        units: targetFormat.defaultUnits || 20,
        multiplier: targetFormat.defaultMultiplier || 1,
        cityScope: 'Metro cluster',
        frequency: 'Monthly',
      },
    ]);
    setUnlockedQuotation(null);
    trackMooviqEvent('quote_builder_add_row', { media_id: targetFormat.id });
  };

  const handleRemoveRow = (rowId: string) => {
    if (rows.length <= 1) return;
    setRows((prev) => prev.filter((r) => r.id !== rowId));
    setUnlockedQuotation(null);
  };

  const handleUpdateRow = (rowId: string, patch: Partial<QuoteMediaRow>) => {
    setRows((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        return { ...row, ...patch };
      })
    );
    setUnlockedQuotation(null);
  };

  const handleReset = () => {
    setDashboardUsers(3);
    setRows(DEFAULT_ROWS);
    setUnlockedQuotation(null);
    trackMooviqEvent('quote_builder_reset', {});
  };

  // Secure Server-side price calculation
  const fetchSecureQuotation = async (token: string) => {
    setIsCalculating(true);
    setCalculationError(null);

    try {
      const res = await fetch('/api/quote/calculate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationToken: token,
          dashboardUsers,
          items: rows.map((r) => ({
            mediaId: r.mediaRateId,
            mediaName: r.mediaName,
            category: r.category,
            units: r.units,
            multiplier: r.multiplier,
            cityScope: r.cityScope,
            frequency: r.frequency,
          })),
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok && data.quotation) {
        setUnlockedQuotation(data.quotation);
        trackMooviqEvent('quote_builder_submit', {
          quotation_ref: data.quotation.quotationRef,
          total_events: data.quotation.totals.totalBillableEvents,
        });
      } else {
        setCalculationError(data.message || 'Unable to calculate secure quotation.');
      }
    } catch {
      setCalculationError('Network error while requesting quotation from server.');
    } finally {
      setIsCalculating(false);
    }
  };

  const handleVerificationComplete = (session: {
    verificationToken: string;
    client: {
      fullName: string;
      companyName: string;
      mobileNumber: string;
      workEmail: string;
    };
  }) => {
    setVerifiedToken(session.verificationToken);
    setVerifiedClient(session.client);
    setIsVerificationModalOpen(false);
    void fetchSecureQuotation(session.verificationToken);
  };

  const handleDownloadPdf = async () => {
    if (!verifiedToken || !unlockedQuotation) return;
    setIsDownloadingPdf(true);

    try {
      const res = await fetch('/api/quote/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          verificationToken: verifiedToken,
          quotation: unlockedQuotation,
        }),
      });

      if (res.ok) {
        const blob = await res.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Mooviq_Quotation_${unlockedQuotation.quotationRef}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
      } else {
        const err = await res.json().catch(() => null);
        alert(err?.message || 'Could not download PDF.');
      }
    } catch {
      alert('Error initiating PDF download.');
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  return (
    <section id="quote-builder" className="scroll-mt-20 py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-3xl text-left mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-700 text-xs font-bold uppercase tracking-wider">
            <Sliders className="w-3.5 h-3.5 text-brand-600" />
            <span>Interactive Quotation Builder</span>
          </div>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Build Your Personalized Mooviq Quotation
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            Tell us what media you want to audit, where your campaigns are running, and how frequently
            you need inspections.
          </p>
        </div>

        {/* Spacious Two-Column SaaS Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start text-left">
          {/* ======================================================== */}
          {/* LEFT PANEL: CAMPAIGN CONFIGURATION CONTROLS              */}
          {/* ======================================================== */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-7">
            {/* Step 1: Select Media Categories */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px]">
                    1
                  </span>
                  <span>Step 1 &middot; Select Media Categories</span>
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

              {/* Category Dropdown + Format Dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-5">
                  <select
                    value={selectedCategory}
                    onChange={(e) => {
                      const nextCat = e.target.value as PublicMediaCategory;
                      setSelectedCategory(nextCat);
                      const firstInCat = PUBLIC_MEDIA_CATALOG.find((f) => f.category === nextCat);
                      if (firstInCat) setSelectedFormatId(firstInCat.id);
                    }}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 font-semibold focus:bg-white focus:outline-none focus:border-brand-500"
                  >
                    {PUBLIC_MEDIA_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-5">
                  <select
                    value={selectedFormatId}
                    onChange={(e) => setSelectedFormatId(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 text-slate-900 font-medium focus:bg-white focus:outline-none focus:border-brand-500"
                  >
                    {availableFormatsForCategory.map((f) => (
                      <option key={f.id} value={f.id}>
                        {f.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <button
                    type="button"
                    onClick={handleAddRow}
                    className="w-full inline-flex items-center justify-center gap-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Step 2: Configure Auditing Requirements */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px]">
                    2
                  </span>
                  <span>Step 2 &middot; Configure Auditing Requirements ({rows.length} Formats)</span>
                </span>
                <span className="text-[11px] text-slate-400">Media-specific billing units</span>
              </div>

              <div className="space-y-4">
                {rows.map((row) => {
                  const formatMeta = PUBLIC_MEDIA_CATALOG.find((f) => f.id === row.mediaRateId);
                  const unitLabel = formatMeta?.unitLabel || 'Media Units';
                  const multLabel = formatMeta?.multiplierLabel || 'Inspections per Unit';
                  const billUnitDesc = formatMeta?.billingUnitDescription || 'per audit task';
                  const calculatedEvents = row.units * row.multiplier;

                  return (
                    <div
                      key={row.id}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-slate-300 transition-all space-y-3"
                    >
                      {/* Format Header */}
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-slate-900">{row.mediaName}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-200/70 text-slate-700 font-medium">
                            {row.category}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-mono">
                            {billUnitDesc}
                          </span>
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

                      {/* Inputs Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            {unitLabel}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="100000"
                            value={row.units}
                            onChange={(e) =>
                              handleUpdateRow(row.id, {
                                units: Math.max(1, parseInt(e.target.value, 10) || 1),
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-slate-200 font-mono focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            {multLabel}
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            value={row.multiplier}
                            onChange={(e) =>
                              handleUpdateRow(row.id, {
                                multiplier: Math.max(1, parseInt(e.target.value, 10) || 1),
                              })
                            }
                            className="w-full px-3 py-1.5 rounded-lg text-xs bg-white border border-slate-200 font-mono focus:outline-none focus:border-brand-500"
                          />
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            Inspection Cadence
                          </label>
                          <select
                            value={row.frequency || 'Monthly'}
                            onChange={(e) =>
                              handleUpdateRow(row.id, {
                                frequency: e.target.value as any,
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white border border-slate-200 focus:outline-none focus:border-brand-500"
                          >
                            <option value="One-time">One-time audit</option>
                            <option value="Weekly">Weekly audits</option>
                            <option value="Monthly">Monthly audits</option>
                            <option value="Custom">Custom frequency</option>
                          </select>
                        </div>

                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block mb-1">
                            Campaign City / Scope
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

                      {/* Row Calculation Note */}
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                        <span>
                          Total Billable Scope:{' '}
                          <strong className="text-slate-900 font-mono">
                            {calculatedEvents.toLocaleString()} {billUnitDesc}
                          </strong>
                        </span>
                        <span className="text-slate-500 italic">Pricing itemized post-verification</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Dashboard Requirements */}
            <div className="pt-4 border-t border-slate-200">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded-full bg-brand-600 text-white flex items-center justify-center text-[11px]">
                    3
                  </span>
                  <span>Step 3 &middot; Dashboard Requirements</span>
                </label>
                <span className="text-xs font-mono font-bold text-slate-800">
                  {dashboardUsers} {dashboardUsers === 1 ? 'team user' : 'team users'}
                </span>
              </div>

              <p className="text-xs text-slate-500 mb-3">
                How many team members need dashboard access to monitor campaign progress, evidence galleries, and reports?
              </p>

              {/* User Selector Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {[1, 3, 5, 10].map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => {
                      setDashboardUsers(count);
                      setUnlockedQuotation(null);
                    }}
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

              {/* Preferred Plan Selector */}
              <div className="grid grid-cols-3 gap-2">
                {(['starter', 'growth', 'enterprise'] as const).map((plan) => (
                  <button
                    key={plan}
                    type="button"
                    onClick={() => {
                      setPreferredPackage(plan);
                      setUnlockedQuotation(null);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-colors cursor-pointer ${
                      preferredPackage === plan
                        ? 'bg-brand-50 border-brand-500 text-brand-900'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span className="text-xs font-bold capitalize block">{plan} Plan</span>
                    <span className="text-[10px] text-slate-500 block">
                      {plan === 'starter' ? 'Single campaign' : plan === 'growth' ? 'Multi-city' : 'Enterprise'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT PANEL: AUDIT PLAN SUMMARY & VERIFICATION GATE      */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-7 shadow-md space-y-5">
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    {unlockedQuotation ? 'Personalized Quotation' : 'Selected Audit Plan'}
                  </h3>
                  <span className="text-[11px] text-slate-500">
                    {unlockedQuotation ? `Ref: ${unlockedQuotation.quotationRef}` : 'Configuration summary'}
                  </span>
                </div>
                {unlockedQuotation ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Verified</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">
                    <Lock className="w-3 h-3 text-slate-500" />
                    <span>Protected</span>
                  </span>
                )}
              </div>

              {/* High-Level Scope Metrics */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Media Formats</span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono">
                    {summaryMetrics.totalFormats}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Total Media Units</span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono">
                    {summaryMetrics.totalUnits.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Planned Audits</span>
                  <span className="text-lg font-extrabold text-brand-600 font-mono">
                    {summaryMetrics.totalEvents.toLocaleString()}
                  </span>
                </div>
                <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <span className="text-slate-500 block text-[10px] font-bold uppercase">Dashboard Seats</span>
                  <span className="text-lg font-extrabold text-slate-900 font-mono">
                    {dashboardUsers} {dashboardUsers === 1 ? 'seat' : 'seats'}
                  </span>
                </div>
              </div>

              {/* Media-Wise Breakdown List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {rows.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-start justify-between text-xs py-1.5 border-b border-slate-50 last:border-0"
                  >
                    <div>
                      <span className="font-bold text-slate-900 block">{r.mediaName}</span>
                      <span className="text-[10px] text-slate-500">
                        {r.units} units &middot; {r.multiplier}x &middot; {r.cityScope}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-slate-700 font-bold block">
                        {(r.units * r.multiplier).toLocaleString()} audits
                      </span>
                      <span className="text-[10px] text-slate-400">{r.frequency || 'Monthly'}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* ======================================================== */}
              {/* STATE A: BEFORE VERIFICATION (LEAD GATE ACTIVE)          */}
              {/* ======================================================== */}
              {!unlockedQuotation ? (
                <div className="space-y-4 pt-2">
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-brand-300" />
                      <h4 className="text-sm font-bold text-white">Your Audit Plan Is Ready</h4>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Verify your contact details to view your personalized pricing and download your quotation.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsVerificationModalOpen(true)}
                    className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-2xl bg-brand-600 hover:bg-brand-500 text-white font-extrabold text-sm uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Unlock My Quotation</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <p className="text-center text-[10px] text-slate-400">
                    Dual SMS &amp; Email verification required &middot; ₹0 platform setup fee
                  </p>
                </div>
              ) : (
                /* ======================================================== */
                /* STATE B: AFTER VERIFICATION (DETAILED PRICING UNLOCKED)  */
                /* ======================================================== */
                <div className="space-y-4 pt-2">
                  {/* Financial Breakdown Table */}
                  <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-3">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-slate-800">
                      <span className="text-slate-300">Client / Org:</span>
                      <span className="font-bold text-white">
                        {unlockedQuotation.client.fullName} ({unlockedQuotation.client.companyName})
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Audit Services Subtotal:</span>
                      <span className="font-mono font-bold text-white">
                        ₹{unlockedQuotation.totals.auditSubtotalInr.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">
                        Dashboard Subscription ({unlockedQuotation.dashboard.users} seats):
                      </span>
                      <span className="font-mono font-bold text-white">
                        ₹{unlockedQuotation.totals.dashboardMonthlyInr.toLocaleString('en-IN')} / mo
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300">Applicable GST (18%):</span>
                      <span className="font-mono font-bold text-slate-300">
                        ₹{unlockedQuotation.totals.gstInr.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-baseline justify-between">
                      <span className="text-xs font-bold text-white">Estimated Total (with GST):</span>
                      <span className="text-xl font-extrabold font-mono text-brand-300">
                        ₹{unlockedQuotation.totals.totalEstimateWithGstInr.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  {/* Wallet Recommendation Card */}
                  <div className="p-3.5 rounded-2xl bg-brand-50/70 border border-brand-200/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-brand-900">
                      <Sparkles className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span>{unlockedQuotation.walletRecommendation.packageName}</span>
                    </div>
                    <p className="text-brand-800 text-[11px] leading-relaxed">
                      {unlockedQuotation.walletRecommendation.message}
                    </p>
                  </div>

                  {/* Custom Quote Notice if applicable */}
                  {unlockedQuotation.hasCustomQuoteItems && (
                    <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                      <span>
                        <strong>{unlockedQuotation.customQuoteItemsCount} specialized format(s)</strong> require custom quotation review.
                      </span>
                    </div>
                  )}

                  {/* Download PDF CTA */}
                  <button
                    type="button"
                    onClick={handleDownloadPdf}
                    disabled={isDownloadingPdf}
                    className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>{isDownloadingPdf ? 'Generating PDF...' : 'Download My Quotation (PDF)'}</span>
                  </button>

                  <p className="text-center text-[10px] text-slate-400">
                    A4 PDF generated from verified quotation session &middot; Reference: {unlockedQuotation.quotationRef}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Verification Gate Modal */}
      <VerificationModal
        isOpen={isVerificationModalOpen}
        onClose={() => setIsVerificationModalOpen(false)}
        onVerificationComplete={handleVerificationComplete}
      />
    </section>
  );
};
