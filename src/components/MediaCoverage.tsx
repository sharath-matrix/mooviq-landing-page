import React, { useState, useMemo, useEffect } from 'react';
import {
  Car,
  Building2,
  Store,
  Tv,
  CheckCircle2,
  X,
  ArrowRight,
  ClipboardCheck,
  FileText,
  AlertCircle,
  Search,
  PlusCircle,
} from 'lucide-react';
import {
  MEDIA_FAMILIES,
  MEDIA_CATALOG,
  VERIFICATION_MODEL_CARDS,
  MediaFamilyId,
  MediaTypeItem,
  AuditWorkflowStatus,
} from '../config/mediaAuditCatalog';
import { DemoTabId } from './demo/InteractiveDemo';
import { trackMooviqEvent } from '../lib/analytics';

interface MediaCoverageProps {
  onExploreDemoTab: (tab: DemoTabId) => void;
  onAddToQuoteBuilder: (mediaItem: MediaTypeItem) => void;
}

export const MediaCoverage: React.FC<MediaCoverageProps> = ({
  onExploreDemoTab,
  onAddToQuoteBuilder,
}) => {
  const [selectedFamily, setSelectedFamily] = useState<'all' | MediaFamilyId>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | AuditWorkflowStatus>('all');
  const [matrixSearch, setMatrixSearch] = useState('');
  const [inspectedMedia, setInspectedMedia] = useState<MediaTypeItem | null>(null);
  const [activeAudience, setActiveAudience] = useState<'brands' | 'agencies' | 'owners' | 'operators'>('brands');

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setInspectedMedia(null);
    };
    if (inspectedMedia) {
      window.addEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [inspectedMedia]);

  const filteredMedia = useMemo(() => {
    return MEDIA_CATALOG.filter((item) => {
      const matchesFamily = selectedFamily === 'all' || item.familyId === selectedFamily;
      const matchesStatus = statusFilter === 'all' || item.workflowStatus === statusFilter;
      const q = matrixSearch.trim().toLowerCase();
      const matchesQuery =
        !q || item.name.toLowerCase().includes(q) || item.shortNote.toLowerCase().includes(q);
      return matchesFamily && matchesStatus && matchesQuery;
    });
  }, [selectedFamily, statusFilter, matrixSearch]);

  const getFamilyIcon = (familyId: MediaFamilyId) => {
    switch (familyId) {
      case 'transit-vehicle':
        return Car;
      case 'outdoor-ooh':
        return Building2;
      case 'indoor-place-based':
        return Store;
      case 'screen-broadcast':
        return Tv;
    }
  };

  const getStatusBadgeStyle = (status: AuditWorkflowStatus) => {
    switch (status) {
      case 'Field photo workflow':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Log-based verification (integration required)':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Custom audit workflow':
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const audienceData = {
    brands: {
      title: 'Brands & Advertisers',
      summary: 'Verify media spend across physical and screen channels with structured asset-level accountability.',
      bullets: [
        'One unified campaign checklist across transit, OOH, mall, and broadcast executions',
        'Condition and creative accuracy reviews before sign-off',
        'Format-appropriate evidence rather than misleading generic summaries',
      ],
    },
    agencies: {
      title: 'Media Agencies',
      summary: 'Deliver transparent campaign proof packages across multi-vendor buying plans.',
      bullets: [
        'Organize client reporting across regional media partners without slide assembly delays',
        'Flag and resolve execution exceptions before campaign closeout',
        'Export consistent audit tables per format',
      ],
    },
    owners: {
      title: 'Media Owners',
      summary: 'Document inventory condition, illumination, and playout compliance proactively.',
      bullets: [
        'Maintain verifiable installation & condition histories for key sites',
        'Pair onsite screen captures with playout logs for DOOH networks',
        'Resolve obstruction or maintenance alerts quickly',
      ],
    },
    operators: {
      title: 'Field-Audit Operators',
      summary: 'Standardize inspection rules per format across distributed field teams.',
      bullets: [
        'Clear asset ID, angle, and condition requirements per media category',
        'Dedicated exception re-upload queue instead of messy chat corrections',
        'Consistent multi-city checkpoint tracking',
      ],
    },
  };

  return (
    <section id="media-coverage" className="scroll-mt-20 py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl text-left">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Multi-Media Audit Coverage
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Audit the media that matters
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
            Mooviq supports structured inspection and evidence models across four advertising media families. Different formats require tailored proof—not a blanket promise of one GPS photo.
          </p>
        </div>

        {/* 4 Media Family Selector Cards */}
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
          {MEDIA_FAMILIES.map((family) => {
            const Icon = getFamilyIcon(family.id);
            const isActive = selectedFamily === family.id;
            const count = MEDIA_CATALOG.filter((m) => m.familyId === family.id).length;

            return (
              <button
                key={family.id}
                type="button"
                onClick={() => setSelectedFamily(isActive ? 'all' : family.id)}
                className={`p-5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isActive
                    ? 'bg-slate-900 text-white border-slate-900 shadow-lg'
                    : 'bg-slate-50/70 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                        isActive
                          ? 'bg-brand-600 text-white'
                          : 'bg-white border border-slate-200 text-brand-600'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded font-mono ${
                        isActive ? 'bg-slate-800 text-slate-200' : 'bg-slate-200/70 text-slate-600'
                      }`}
                    >
                      Family {family.code} · {count} formats
                    </span>
                  </div>
                  <h3 className={`text-sm font-bold ${isActive ? 'text-white' : 'text-slate-900'}`}>
                    {family.label}
                  </h3>
                  <p className={`text-xs mt-1.5 leading-relaxed ${isActive ? 'text-slate-300' : 'text-slate-600'}`}>
                    {family.summary}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-current/10 flex items-center justify-between text-[11px]">
                  <span className={isActive ? 'text-brand-300 font-semibold' : 'text-brand-600 font-semibold'}>
                    {isActive ? 'Showing family formats (click to reset)' : 'Filter matrix below →'}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Compact Filterable Coverage Matrix */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50/50 overflow-hidden text-left">
          {/* Matrix Filter Toolbar */}
          <div className="p-4 sm:p-5 bg-white border-b border-slate-200 flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedFamily('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedFamily === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Media ({MEDIA_CATALOG.length})
              </button>
              {MEDIA_FAMILIES.map((fam) => (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => setSelectedFamily(fam.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    selectedFamily === fam.id
                      ? 'bg-brand-600 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {fam.shortLabel}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="relative flex-1 sm:w-52">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  aria-label="Filter media formats"
                  placeholder="Filter media format..."
                  value={matrixSearch}
                  onChange={(e) => setMatrixSearch(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <select
                aria-label="Filter by audit workflow status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as 'all' | AuditWorkflowStatus)}
                className="px-3 py-1.5 rounded-lg text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-700"
              >
                <option value="all">All workflow types</option>
                <option value="Field photo workflow">Field photo workflow</option>
                <option value="Log-based verification (integration required)">
                  Log-based (integration required)
                </option>
                <option value="Custom audit workflow">Custom audit workflow</option>
              </select>
            </div>
          </div>

          {/* Compact Matrix Grid */}
          <div className="p-4 sm:p-5">
            {filteredMedia.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {filteredMedia.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setInspectedMedia(item)}
                    className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-brand-300 hover:shadow-sm transition-all text-left flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-brand-600 transition-colors">
                          {item.name}
                        </h4>
                        <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-600 shrink-0" />
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                        {item.shortNote}
                      </p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded border truncate ${getStatusBadgeStyle(
                          item.workflowStatus
                        )}`}
                      >
                        {item.workflowStatus}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="py-10 text-center text-xs text-slate-500">
                No media formats match the selected filter.{' '}
                <button
                  type="button"
                  onClick={() => {
                    setSelectedFamily('all');
                    setStatusFilter('all');
                    setMatrixSearch('');
                  }}
                  className="text-brand-600 font-semibold underline cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
            <p className="mt-4 text-[11px] text-slate-500">
              Click any media tile above to inspect example checklist fields and required verification evidence.
            </p>
          </div>
        </div>

        {/* Verification Models Explainer Strip */}
        <div className="mt-14 text-left">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900">
              How verification adapts to each media family
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Honest audit protocols tailored to physical assets, transit fleets, digital networks, broadcast logs, print, and activations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {VERIFICATION_MODEL_CARDS.map((card) => (
              <div
                key={card.model}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h4 className="text-sm font-bold text-slate-900">{card.model}</h4>
                  </div>
                  <p className="text-[11px] font-medium text-slate-500 mb-2">{card.formats}</p>
                  <p className="text-xs text-slate-700 leading-relaxed">{card.method}</p>
                </div>
                <div className="mt-4 pt-2.5 border-t border-slate-200/70">
                  <span
                    className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border ${getStatusBadgeStyle(
                      card.status
                    )}`}
                  >
                    {card.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Role / Stakeholder Perspectives */}
        <div className="mt-14 rounded-2xl bg-slate-50 border border-slate-200 p-6 sm:p-8 text-left">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                Built For Cross-Ecosystem Teams
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Consistent visibility for every stakeholder
              </h3>
            </div>

            <div className="inline-flex flex-wrap rounded-xl bg-white p-1 border border-slate-200 gap-1">
              {(
                [
                  { id: 'brands', label: 'Brands' },
                  { id: 'agencies', label: 'Agencies' },
                  { id: 'owners', label: 'Media Owners' },
                  { id: 'operators', label: 'Audit Operators' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveAudience(tab.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                    activeAudience === tab.id
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5">
              <h4 className="text-lg font-bold text-slate-900">{audienceData[activeAudience].title}</h4>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {audienceData[activeAudience].summary}
              </p>
            </div>
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {audienceData[activeAudience].bullets.map((bullet, i) => (
                <div
                  key={i}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 flex items-start gap-2"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{bullet}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Checklist & Evidence Inspection Drawer */}
      {inspectedMedia && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="media-checklist-title"
        >
          <div className="absolute inset-0" onClick={() => setInspectedMedia(null)} />
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right border-l border-slate-200 text-left">
            <div className="p-5 border-b border-slate-100 bg-slate-50 flex items-start justify-between">
              <div>
                <span
                  className={`inline-block text-[10px] font-semibold px-2 py-0.5 rounded border mb-1.5 ${getStatusBadgeStyle(
                    inspectedMedia.workflowStatus
                  )}`}
                >
                  {inspectedMedia.workflowStatus}
                </span>
                <h3 id="media-checklist-title" className="text-lg font-bold text-slate-900">
                  {inspectedMedia.name}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{inspectedMedia.shortNote}</p>
              </div>
              <button
                type="button"
                onClick={() => setInspectedMedia(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
                aria-label="Close media checklist panel"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 subtle-scrollbar">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
                  <ClipboardCheck className="w-3.5 h-3.5 text-brand-600" />
                  <span>Example Inspection Checklist</span>
                </h4>
                <ul className="space-y-2">
                  {inspectedMedia.exampleChecklist.map((field, i) => (
                    <li
                      key={i}
                      className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-800 flex items-start gap-2"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{field}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5 mb-2.5">
                  <FileText className="w-3.5 h-3.5 text-slate-700" />
                  <span>Required Evidence Records</span>
                </h4>
                <ul className="space-y-2">
                  {inspectedMedia.requiredEvidence.map((ev, i) => (
                    <li
                      key={i}
                      className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700"
                    >
                      {ev}
                    </li>
                  ))}
                </ul>
              </div>

              {inspectedMedia.caveat && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{inspectedMedia.caveat}</span>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => {
                  const item = inspectedMedia;
                  setInspectedMedia(null);
                  trackMooviqEvent('cta_click', { location: 'media_drawer', action: 'add_to_quote', media: item.name });
                  onAddToQuoteBuilder(item);
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add to Quote Builder</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setInspectedMedia(null);
                  onExploreDemoTab('reports');
                }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold cursor-pointer"
              >
                <span>See Sample Report</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

