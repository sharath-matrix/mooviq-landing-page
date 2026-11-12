import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
} from 'lucide-react';
import { FraudAlert, Campaign } from '../../types/mooviq';
import { MEDIA_FAMILIES, MediaFamilyId } from '../../config/mediaAuditCatalog';

interface AlertsTabProps {
  alerts: FraudAlert[];
  campaigns: Campaign[];
  initialCampaignId?: string;
  initialFamilyFilter?: 'All' | MediaFamilyId;
  onOpenAlert: (alert: FraudAlert) => void;
  onResolveAlert: (alertId: string) => void;
}

export const AlertsTab: React.FC<AlertsTabProps> = ({
  alerts,
  campaigns,
  initialCampaignId = 'All',
  initialFamilyFilter = 'All',
  onOpenAlert,
  onResolveAlert,
}) => {
  const [filter, setFilter] = useState<'All' | 'Needs review' | 'Resolved'>('All');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(initialCampaignId);
  const [selectedFamily, setSelectedFamily] = useState<'All' | MediaFamilyId>(initialFamilyFilter);

  useEffect(() => {
    setSelectedCampaignId(initialCampaignId || 'All');
  }, [initialCampaignId]);

  useEffect(() => {
    setSelectedFamily(initialFamilyFilter || 'All');
  }, [initialFamilyFilter]);

  const filteredAlerts = alerts.filter((a) => {
    const matchesStatus = filter === 'All' || a.riskLevel === filter;
    const matchesCampaign = selectedCampaignId === 'All' || a.campaignId === selectedCampaignId;
    const matchesFamily = selectedFamily === 'All' || a.mediaFamilyId === selectedFamily;
    return matchesStatus && matchesCampaign && matchesFamily;
  });

  return (
    <div className="space-y-6 text-left">
      <div className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Condition &amp; Exception Queue
              </h3>
              <span className="text-[10px] font-semibold bg-rose-50 text-rose-700 px-2 py-0.5 rounded border border-rose-200">
                Sample exceptions
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Format-relevant media issues awaiting human verification and remediation
            </p>
          </div>

          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/60 self-start sm:self-auto">
            {(['All', 'Needs review', 'Resolved'] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filter === item
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {/* Family + Campaign Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
          <select
            aria-label="Filter exceptions by media family"
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value as 'All' | MediaFamilyId)}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
          >
            <option value="All">All media families</option>
            {MEDIA_FAMILIES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>

          <div className="flex-1 min-w-[200px]">
            <select
              aria-label="Filter exceptions by campaign"
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
            >
              <option value="All">All sample campaigns</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.mediaType})
                </option>
              ))}
            </select>
          </div>

          {(filter !== 'All' || selectedCampaignId !== 'All' || selectedFamily !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setFilter('All');
                setSelectedCampaignId('All');
                setSelectedFamily('All');
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
          <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-slate-900">Human Review Policy:</span> Exception flags do not assert misconduct or conclusive fraud; they route physical defects, obstructions, missing proofs, and playout variances for supervisor verification.
          </div>
        </div>
      </div>

      {filteredAlerts.length > 0 ? (
        <div className="space-y-3">
          {filteredAlerts.map((item) => {
            const isPending = item.riskLevel === 'Needs review';

            return (
              <div
                key={item.id}
                className={`p-4 sm:p-5 rounded-2xl bg-white border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isPending
                    ? 'border-rose-200/80 hover:border-rose-300 shadow-xs'
                    : 'border-slate-200/80 bg-slate-50/40 opacity-85'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isPending ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {isPending ? (
                      <AlertTriangle className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h4 className="text-sm font-bold text-slate-900">{item.alertType}</h4>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.2 rounded-full ${
                          isPending
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        }`}
                      >
                        {item.riskLevel}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                        {item.mediaType}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{item.taskId}</span>
                    </div>

                    <p className="text-xs text-slate-500">
                      Campaign: <strong className="text-slate-700">{item.campaignName}</strong> · {item.agency} · {item.city}
                    </p>

                    <p className="text-xs text-slate-600 pt-1 max-w-xl">{item.detailNotes}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-center shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 w-full md:w-auto justify-end">
                  <span className="text-[11px] text-slate-400 font-mono hidden sm:inline mr-2">
                    {item.timestamp}
                  </span>

                  <button
                    type="button"
                    onClick={() => onOpenAlert(item)}
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors cursor-pointer"
                  >
                    Review
                  </button>

                  {isPending && (
                    <button
                      type="button"
                      onClick={() => onResolveAlert(item.id)}
                      className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Resolve</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-10 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No sample exceptions match current filters</p>
          <button
            type="button"
            onClick={() => {
              setFilter('All');
              setSelectedCampaignId('All');
              setSelectedFamily('All');
            }}
            className="mt-3 px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-xl cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
