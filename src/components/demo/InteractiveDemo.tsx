import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Layers, 
  Camera, 
  AlertTriangle, 
  BarChart3, 
  Search, 
  Download, 
  SlidersHorizontal,
  ShieldCheck,
  X
} from 'lucide-react';

import { 
  RAW_CAMPAIGNS, 
  RAW_MEDIA_PROOFS, 
  RAW_FRAUD_ALERTS, 
  MONTHLY_AUDIT_HISTORY
} from '../../data/demoData';
import { Campaign, MediaProof, FraudAlert, CityCoverageItem } from '../../types/mooviq';

import { OverviewTab } from './OverviewTab';
import { CampaignsTab } from './CampaignsTab';
import { ProofsTab } from './ProofsTab';
import { AlertsTab } from './AlertsTab';
import { AnalyticsTab } from './AnalyticsTab';
import { CampaignDrawer } from './CampaignDrawer';
import { ProofModal } from './ProofModal';
import { AlertDrawer } from './AlertDrawer';

export type DemoTabId = 'overview' | 'campaigns' | 'proofs' | 'alerts' | 'analytics';

interface InteractiveDemoProps {
  activeTab?: DemoTabId;
  onTabChange?: (tab: DemoTabId) => void;
}

export const InteractiveDemo: React.FC<InteractiveDemoProps> = ({
  activeTab: controlledTab,
  onTabChange,
}) => {
  // Navigation tab state (controlled if parent provides props, internal fallback otherwise)
  const [internalTab, setInternalTab] = useState<DemoTabId>('overview');
  const activeTab = controlledTab ?? internalTab;
  const setActiveTab = (tab: DemoTabId) => {
    setInternalTab(tab);
    if (onTabChange) onTabChange(tab);
  };

  // Scenario state: 'On track' | 'Needs attention' | 'Completed'
  const [scenario, setScenario] = useState<'On track' | 'Needs attention' | 'Completed'>('On track');

  // Functional Global Search
  const [globalQuery, setGlobalQuery] = useState<string>('');
  const [globalSearchOpen, setGlobalSearchOpen] = useState<boolean>(false);
  const [appliedCampaignSearch, setAppliedCampaignSearch] = useState<string>('');
  const searchWrapperRef = useRef<HTMLDivElement>(null);

  // Selected items for modals/drawers
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null);
  const [selectedProof, setSelectedProof] = useState<MediaProof | null>(null);
  const [selectedAlert, setSelectedAlert] = useState<FraudAlert | null>(null);

  // Filter pass-through (e.g. jumping from campaign to its proofs/alerts)
  const [targetProofsCampaignId, setTargetProofsCampaignId] = useState<string>('All');
  const [targetAlertsCampaignId, setTargetAlertsCampaignId] = useState<string>('All');

  // Local mutable state for exceptions
  const [alerts, setAlerts] = useState<FraudAlert[]>(RAW_FRAUD_ALERTS);

  // Close global search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchWrapperRef.current && !searchWrapperRef.current.contains(e.target as Node)) {
        setGlobalSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reactive campaigns based on scenario (maintaining exact arithmetic: verified + flagged + pending === submitted)
  const currentCampaigns = useMemo(() => {
    if (scenario === 'Completed') {
      return RAW_CAMPAIGNS.map((c) => ({
        ...c,
        status: 'Completed' as const,
        submittedUnits: c.targetUnits,
        verifiedUnits: c.targetUnits,
        flaggedUnits: 0,
        pendingUnits: 0,
        completionRate: 100,
        verifiedRate: 100,
        riskLevel: 'Low' as const,
      }));
    }
    if (scenario === 'Needs attention') {
      return RAW_CAMPAIGNS.map((c, i) => {
        if (i === 0) {
          const addedFlags = 16;
          return {
            ...c,
            verifiedUnits: c.verifiedUnits - addedFlags,
            flaggedUnits: c.flaggedUnits + addedFlags,
            verifiedRate: Math.round(((c.verifiedUnits - addedFlags) / c.targetUnits) * 100),
            riskLevel: 'High' as const,
          };
        }
        if (i === 4) {
          const addedFlags = 6;
          return {
            ...c,
            verifiedUnits: c.verifiedUnits - addedFlags,
            flaggedUnits: c.flaggedUnits + addedFlags,
            verifiedRate: Math.round(((c.verifiedUnits - addedFlags) / c.targetUnits) * 100),
            riskLevel: 'High' as const,
          };
        }
        return c;
      });
    }
    return RAW_CAMPAIGNS;
  }, [scenario]);

  // Derived alerts reflecting scenario coherently
  const scenarioAlerts = useMemo(() => {
    if (scenario === 'Completed') {
      return alerts.map((a) => ({ ...a, riskLevel: 'Resolved' as const }));
    }
    return alerts;
  }, [alerts, scenario]);

  // Derived stats
  const currentStats = useMemo(() => {
    const active = currentCampaigns.filter((c) => c.status === 'Ongoing').length;
    const completedTasks = currentCampaigns.reduce((acc, c) => acc + c.verifiedUnits, 0);
    const pendingTasks = currentCampaigns.reduce((acc, c) => acc + c.pendingUnits, 0);
    const flaggedTasks = currentCampaigns.reduce((acc, c) => acc + c.flaggedUnits, 0);

    return {
      activeCampaigns: active,
      auditsCompleted: completedTasks,
      pendingReviews: pendingTasks,
      flaggedIssues: flaggedTasks,
      tasksExecutedTotal: completedTasks + pendingTasks + flaggedTasks,
      avgCompletionRate: Math.round(
        currentCampaigns.reduce((acc, c) => acc + c.completionRate, 0) / currentCampaigns.length
      ),
    };
  }, [currentCampaigns]);

  // Dynamic city coverage derived from currentCampaigns
  const dynamicCityCoverage: CityCoverageItem[] = useMemo(() => {
    const cityMap = new Map<string, { submitted: number; target: number; active: number }>();
    currentCampaigns.forEach((c) => {
      const prev = cityMap.get(c.city) || { submitted: 0, target: 0, active: 0 };
      cityMap.set(c.city, {
        submitted: prev.submitted + c.submittedUnits,
        target: prev.target + c.targetUnits,
        active: prev.active + (c.status === 'Ongoing' ? 1 : 0),
      });
    });

    return Array.from(cityMap.entries())
      .map(([city, vals]) => ({
        city,
        tasksExecuted: vals.submitted,
        completionRate: Math.round((vals.submitted / vals.target) * 100),
        activeCampaigns: vals.active,
      }))
      .sort((a, b) => b.tasksExecuted - a.tasksExecuted);
  }, [currentCampaigns]);

  // Global search live results across sample entities
  const globalSearchResults = useMemo(() => {
    const q = globalQuery.trim().toLowerCase();
    if (!q) return { campaigns: [], proofs: [], alerts: [] };
    return {
      campaigns: currentCampaigns
        .filter(
          (c) =>
            c.name.toLowerCase().includes(q) ||
            c.city.toLowerCase().includes(q) ||
            c.agency.toLowerCase().includes(q) ||
            c.mediaType.toLowerCase().includes(q)
        )
        .slice(0, 3),
      proofs: RAW_MEDIA_PROOFS.filter(
        (p) =>
          p.taskId.toLowerCase().includes(q) ||
          p.locationString.toLowerCase().includes(q) ||
          p.city.toLowerCase().includes(q)
      ).slice(0, 3),
      alerts: scenarioAlerts
        .filter(
          (a) =>
            a.alertType.toLowerCase().includes(q) ||
            a.campaignName.toLowerCase().includes(q) ||
            a.taskId.toLowerCase().includes(q)
        )
        .slice(0, 2),
    };
  }, [globalQuery, currentCampaigns, scenarioAlerts]);

  // Handle resolving an alert locally
  const handleResolveAlert = (alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) => (a.id === alertId ? { ...a, riskLevel: 'Resolved' as const } : a))
    );
  };

  // Export CSV Functionality (Pure client-side, labelled Sample data)
  const handleExportCsv = (rowsToExport: Campaign[] = currentCampaigns) => {
    const headers = [
      'Mooviq Interactive Demo - Sample Data Export',
      `Scenario: ${scenario},Rows: ${rowsToExport.length},Generated At: ${new Date().toISOString()}`,
      'Campaign ID,Campaign Name,Brand,Agency,City,Media Type,Status,Target Units,Submitted Units,Verified Units,Flagged Units,Pending Units,Completion Rate %',
    ];

    const rows = rowsToExport.map((c) =>
      `"${c.id}","${c.name}","${c.brand}","${c.agency}","${c.city}","${c.mediaType}","${c.status}",${c.targetUnits},${c.submittedUnits},${c.verifiedUnits},${c.flaggedUnits},${c.pendingUnits},${c.completionRate}%`
    );

    const csvContent = 'data:text/csv;charset=utf-8,' + encodeURIComponent([...headers, ...rows].join('\n'));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', csvContent);
    downloadAnchor.setAttribute('download', `mooviq-sample-data-${scenario.toLowerCase().replace(/\s+/g, '-')}.csv`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const navItems: {
    id: DemoTabId;
    label: string;
    icon: React.FC<{ className?: string }>;
    count?: number;
    alertTone?: boolean;
  }[] = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'campaigns', label: 'Campaigns', icon: Layers, count: currentCampaigns.length },
    { id: 'proofs', label: 'Media Proofs', icon: Camera, count: RAW_MEDIA_PROOFS.length },
    {
      id: 'alerts',
      label: 'Exceptions & Alerts',
      icon: AlertTriangle,
      count: scenarioAlerts.filter((a) => a.riskLevel === 'Needs review').length,
      alertTone: true,
    },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <section id="explore-demo" className="scroll-mt-20 py-16 md:py-24 bg-slate-100/70 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
            <span>Interactive demo · Sample data</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Don’t just watch a demo. Explore one.
          </h2>
          <p className="mt-3 text-base sm:text-lg text-slate-600">
            Click through a sample Mooviq workspace to see how campaign oversight can work. Filter campaigns, inspect photographic proofs, and explore anomaly review workflows.
          </p>

          <p className="mt-2 text-xs text-slate-500 font-medium">
            This preview is not connected to live campaigns. All figures, media, and agency records are fictional local sample data.
          </p>
        </div>

        {/* Scenario Selector Segmented Control */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/90 shadow-xs mb-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
            <SlidersHorizontal className="w-4 h-4 text-brand-600" />
            <span>Try a scenario:</span>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80 w-full sm:w-auto">
            {(['On track', 'Needs attention', 'Completed'] as const).map((sc) => (
              <button
                key={sc}
                type="button"
                onClick={() => setScenario(sc)}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  scenario === sc
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {sc === 'On track' && 'On track'}
                {sc === 'Needs attention' && 'Needs attention'}
                {sc === 'Completed' && 'Completed'}
              </button>
            ))}
          </div>

          <span className="text-[11px] text-slate-500 font-mono hidden md:inline">
            Sample state: {scenario}
          </span>
        </div>

        {/* Main Application Window Container */}
        <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xl overflow-hidden flex flex-col max-w-6xl mx-auto">
          
          {/* Top Bar of the Mock Dashboard */}
          <div className="px-5 py-3.5 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800">
            
            {/* Left: Window Controls + Brand */}
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
              </div>

              <div className="h-4 w-[1px] bg-slate-700" />

              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-brand-600 flex items-center justify-center text-white">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <span className="text-sm font-bold tracking-tight text-white">
                  Mooviq
                </span>
                <span className="text-[10px] text-slate-300 bg-slate-800 px-2 py-0.5 rounded font-medium border border-slate-700">
                  Interactive demo · Sample data
                </span>
              </div>
            </div>

            {/* Center: Functional Global Search */}
            <div ref={searchWrapperRef} className="relative flex-1 max-w-sm">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                aria-label="Global sample workspace search"
                placeholder="Search campaigns, cities, task IDs..."
                value={globalQuery}
                onFocus={() => setGlobalSearchOpen(true)}
                onChange={(e) => {
                  setGlobalQuery(e.target.value);
                  setGlobalSearchOpen(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && globalQuery.trim()) {
                    setAppliedCampaignSearch(globalQuery.trim());
                    setActiveTab('campaigns');
                    setGlobalSearchOpen(false);
                  } else if (e.key === 'Escape') {
                    setGlobalSearchOpen(false);
                  }
                }}
                className="w-full pl-8 pr-8 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder:text-slate-400 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
              />
              {globalQuery && (
                <button
                  type="button"
                  aria-label="Clear global search"
                  onClick={() => {
                    setGlobalQuery('');
                    setAppliedCampaignSearch('');
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Live Search Results Popover */}
              {globalSearchOpen && globalQuery.trim().length > 0 && (
                <div className="absolute left-0 right-0 mt-2 rounded-xl bg-white border border-slate-200 shadow-2xl z-30 p-2 text-left text-slate-900 max-h-80 overflow-y-auto subtle-scrollbar">
                  <div className="flex items-center justify-between px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Sample Search Results</span>
                    <button
                      type="button"
                      onClick={() => {
                        setAppliedCampaignSearch(globalQuery.trim());
                        setActiveTab('campaigns');
                        setGlobalSearchOpen(false);
                      }}
                      className="text-brand-600 hover:underline normal-case font-semibold cursor-pointer"
                    >
                      Filter in Campaigns &rarr;
                    </button>
                  </div>

                  {globalSearchResults.campaigns.length === 0 &&
                  globalSearchResults.proofs.length === 0 &&
                  globalSearchResults.alerts.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-slate-500">
                      No sample records match "{globalQuery}".
                    </div>
                  ) : (
                    <div className="space-y-1 mt-1">
                      {globalSearchResults.campaigns.map((c) => (
                        <button
                          key={c.id}
                          type="button"
                          onClick={() => {
                            setSelectedCampaign(c);
                            setGlobalSearchOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{c.name}</span>
                            <span className="text-[11px] text-slate-500">{c.city} · {c.mediaType}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-brand-600">Campaign</span>
                        </button>
                      ))}
                      {globalSearchResults.proofs.map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setSelectedProof(p);
                            setGlobalSearchOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 block font-mono">{p.taskId}</span>
                            <span className="text-[11px] text-slate-500">{p.locationString}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-teal-600">Proof</span>
                        </button>
                      ))}
                      {globalSearchResults.alerts.map((a) => (
                        <button
                          key={a.id}
                          type="button"
                          onClick={() => {
                            setSelectedAlert(a);
                            setGlobalSearchOpen(false);
                          }}
                          className="w-full text-left px-2.5 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">{a.alertType}</span>
                            <span className="text-[11px] text-slate-500">{a.campaignName}</span>
                          </div>
                          <span className="text-[10px] font-semibold text-rose-600">Exception</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Right: Demo indicator + Export Action */}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => handleExportCsv(currentCampaigns)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors cursor-pointer"
                title="Download CSV of sample campaigns"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>Export sample CSV</span>
              </button>

              <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-slate-800 border border-slate-700 text-slate-200 text-xs font-medium">
                <span className="w-2 h-2 rounded-full bg-teal-400" />
                <span>Sample Data</span>
              </div>
            </div>

          </div>

          {/* Body with Sidebar (Desktop) + Horizontally scrollable tabs (Mobile) */}
          <div className="flex flex-col md:flex-row flex-1 min-h-[580px]">
            
            {/* Desktop Sidebar (Left) */}
            <aside className="hidden md:flex flex-col w-56 bg-slate-50/80 border-r border-slate-200/80 p-3 space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-3 py-2">
                Workspace Areas
              </span>

              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.id === 'proofs') setTargetProofsCampaignId('All');
                      if (item.id === 'alerts') setTargetAlertsCampaignId('All');
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-brand-600 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.count !== undefined && (
                      <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-md ${
                        isActive
                          ? 'bg-brand-700 text-white'
                          : item.alertTone && item.count > 0
                          ? 'bg-rose-100 text-rose-700 font-bold'
                          : 'bg-slate-200 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Sidebar bottom informational card */}
              <div className="mt-auto pt-6">
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-[11px] text-slate-500 space-y-1">
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-brand-600" />
                    <span>Read-Only Sandbox</span>
                  </div>
                  <p className="leading-snug">
                    Interactive demo · Sample data. Zero backend connections or real client metrics.
                  </p>
                </div>
              </div>
            </aside>

            {/* Mobile Horizontal Tabs */}
            <div className="md:hidden flex overflow-x-auto p-2 bg-slate-50 border-b border-slate-200 gap-1 subtle-scrollbar">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(item.id);
                      if (item.id === 'proofs') setTargetProofsCampaignId('All');
                      if (item.id === 'alerts') setTargetAlertsCampaignId('All');
                    }}
                    className={`shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                      isActive
                        ? 'bg-brand-600 text-white'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                    {item.count !== undefined && (
                      <span className={`text-[10px] font-mono px-1 rounded ${
                        isActive ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Content Area */}
            <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-slate-50/40 overflow-y-auto max-h-[850px] subtle-scrollbar">
              {activeTab === 'overview' && (
                <OverviewTab
                  stats={currentStats}
                  campaigns={currentCampaigns}
                  alerts={scenarioAlerts}
                  monthlyData={MONTHLY_AUDIT_HISTORY}
                  cityData={dynamicCityCoverage}
                  onSelectCampaign={(c) => setSelectedCampaign(c)}
                  onOpenAlert={(a) => setSelectedAlert(a)}
                  onNavigateToTab={(tab) => {
                    setActiveTab(tab);
                    if (tab === 'proofs') setTargetProofsCampaignId('All');
                    if (tab === 'alerts') setTargetAlertsCampaignId('All');
                  }}
                />
              )}

              {activeTab === 'campaigns' && (
                <CampaignsTab
                  campaigns={currentCampaigns}
                  initialSearchQuery={appliedCampaignSearch}
                  onSelectCampaign={(c) => setSelectedCampaign(c)}
                  onExportCsv={(filteredRows) => handleExportCsv(filteredRows)}
                />
              )}

              {activeTab === 'proofs' && (
                <ProofsTab
                  proofs={RAW_MEDIA_PROOFS}
                  campaigns={currentCampaigns}
                  initialCampaignId={targetProofsCampaignId}
                  onOpenProofModal={(p) => setSelectedProof(p)}
                />
              )}

              {activeTab === 'alerts' && (
                <AlertsTab
                  alerts={scenarioAlerts}
                  campaigns={currentCampaigns}
                  initialCampaignId={targetAlertsCampaignId}
                  onOpenAlert={(a) => setSelectedAlert(a)}
                  onResolveAlert={handleResolveAlert}
                />
              )}

              {activeTab === 'analytics' && (
                <AnalyticsTab
                  monthlyData={MONTHLY_AUDIT_HISTORY}
                  campaigns={currentCampaigns}
                />
              )}
            </main>

          </div>

          {/* Sub-footer inside demo frame */}
          <div className="px-5 py-2.5 bg-slate-100/80 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500" />
              <span>Interactive demo · Sample data · Scenario: <strong>{scenario}</strong></span>
            </span>
            <span>
              <strong>Mooviq</strong> by EraZero AI · Local workspace preview
            </span>
          </div>

        </div>

      </div>

      {/* Campaign Details Drawer */}
      <CampaignDrawer
        campaign={selectedCampaign}
        proofs={RAW_MEDIA_PROOFS}
        alerts={scenarioAlerts}
        onClose={() => setSelectedCampaign(null)}
        onNavigateToProofs={(cmpId) => {
          setTargetProofsCampaignId(cmpId);
          setActiveTab('proofs');
        }}
        onNavigateToAlerts={(cmpId) => {
          setTargetAlertsCampaignId(cmpId);
          setActiveTab('alerts');
        }}
        onOpenProofModal={(proof) => {
          setSelectedProof(proof);
        }}
      />

      {/* Proof Modal */}
      <ProofModal
        proof={selectedProof}
        onClose={() => setSelectedProof(null)}
      />

      {/* Alert Review Drawer */}
      <AlertDrawer
        alert={selectedAlert}
        onClose={() => setSelectedAlert(null)}
        onResolve={handleResolveAlert}
      />
    </section>
  );
};
