import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  TrendingUp, 
  ArrowUpRight, 
  ChevronRight,
  MapPin,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Campaign, FraudAlert, MonthlyAuditPoint, CityCoverageItem, DemoStats } from '../../types/mooviq';

interface OverviewTabProps {
  stats: DemoStats;
  campaigns: Campaign[];
  alerts: FraudAlert[];
  monthlyData: MonthlyAuditPoint[];
  cityData: CityCoverageItem[];
  onSelectCampaign: (campaign: Campaign) => void;
  onOpenAlert: (alert: FraudAlert) => void;
  onNavigateToTab: (tab: 'campaigns' | 'proofs' | 'alerts' | 'analytics') => void;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  stats,
  campaigns,
  alerts,
  monthlyData,
  cityData,
  onSelectCampaign,
  onOpenAlert,
  onNavigateToTab,
}) => {
  // Max tasks in monthly data for scaling chart bars
  const maxTasks = Math.max(...monthlyData.map((d) => d.tasks));
  const totalMonthlyVolume = monthlyData.reduce((sum, d) => sum + d.tasks, 0);
  const avgMonthlyAudits = Math.round(totalMonthlyVolume / (monthlyData.length || 1));
  const firstMonthTasks = monthlyData[0]?.tasks || 1;
  const lastMonthTasks = monthlyData[monthlyData.length - 1]?.tasks || firstMonthTasks;
  const periodGrowthPercent = Math.round(((lastMonthTasks - firstMonthTasks) / firstMonthTasks) * 100);

  return (
    <div className="space-y-6 text-left">
      
      {/* 4 Clean Safe KPI Cards (No MRR/Revenue!) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        
        {/* KPI 1: Active Campaigns */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Campaigns</span>
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.activeCampaigns}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +8% vs last mo
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across {cityData.length} urban media clusters
          </span>
        </div>

        {/* KPI 2: Completed Audits */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Audits Completed</span>
            <div className="w-8 h-8 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.auditsCompleted.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 flex items-center">
              <TrendingUp className="w-3 h-3 mr-0.5" /> +22%
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Verified unit checkpoints
          </span>
        </div>

        {/* KPI 3: Pending Reviews */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Pending Reviews</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.pendingReviews}
            </span>
            <span className="text-xs font-medium text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
              In queue
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Awaiting secondary image check
          </span>
        </div>

        {/* KPI 4: Exceptions & Alerts */}
        <div className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Flagged Issues</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-rose-600">
              {stats.flaggedIssues}
            </span>
            <span className="text-xs font-medium text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded">
              Needs action
            </span>
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Duplicate angle, GPS offset, blur
          </span>
        </div>

      </div>

      {/* Middle Grid: Monthly Audit Performance & Recent Anomalies */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Performance Chart: Correct Chronological Order (Feb -> Jul) */}
        <div className="lg:col-span-8 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-1">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Monthly Audit Velocity
                </h3>
                <p className="text-xs text-slate-500">
                  Tasks executed · Illustrative chronological trend (Feb – Jul 2026)
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                Sample time series
              </span>
            </div>

            {/* Simulated Clean CSS Bar Chart */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="h-44 flex items-end justify-between gap-3 sm:gap-6 px-2">
                {monthlyData.map((point) => {
                  const heightPercent = Math.round((point.tasks / maxTasks) * 100);
                  return (
                    <div key={point.month} className="flex-1 flex flex-col items-center gap-2 group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold text-slate-700 font-mono -mb-1">
                        {point.tasks}
                      </div>
                      <div className="w-full bg-slate-100 rounded-lg overflow-hidden flex flex-col justify-end h-32 relative">
                        {/* Bar fill */}
                        <div 
                          className="w-full bg-gradient-to-t from-brand-600 to-brand-500 rounded-t-md transition-all duration-300 group-hover:from-brand-700 group-hover:to-brand-600"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                      <span className="text-xs font-semibold text-slate-600 group-hover:text-slate-900">
                        {point.month}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Chart Summary Stats Footer */}
          <div className="grid grid-cols-3 gap-3 pt-4 mt-4 border-t border-slate-100 text-center">
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Avg Audits / Month</span>
              <span className="text-sm font-bold text-slate-800">{avgMonthlyAudits.toLocaleString()} Tasks</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Total 6-Month Volume</span>
              <span className="text-sm font-bold text-slate-800">{totalMonthlyVolume.toLocaleString()} Audits</span>
            </div>
            <div>
              <span className="text-[11px] text-slate-400 block font-medium">Period Growth (Feb–Jul)</span>
              <span className="text-sm font-bold text-emerald-600">+{periodGrowthPercent}%</span>
            </div>
          </div>
        </div>

        {/* Anomaly / Exception Feed */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Exceptions & Alerts
                </h3>
                <p className="text-xs text-slate-500">
                  Latest anomalies requiring review
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateToTab('alerts')}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-0.5 cursor-pointer"
              >
                <span>View all</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5 mt-4">
              {alerts.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onOpenAlert(item)}
                  className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex items-start gap-3"
                >
                  <div className="w-7 h-7 rounded-lg bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {item.alertType}
                      </span>
                      <span className="text-[10px] font-semibold text-rose-700 bg-rose-50 px-1.5 rounded">
                        High
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {item.agency} · {item.taskId}
                    </p>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Human oversight protocol enforced
            </span>
          </div>
        </div>

      </div>

      {/* Bottom Grid: Top Campaigns Progress & City Coverage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Top Campaigns List */}
        <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Top Campaigns
              </h3>
              <p className="text-xs text-slate-500">
                By completion progress and scheduled units
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigateToTab('campaigns')}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
            >
              <span>All campaigns</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {campaigns.slice(0, 4).map((campaign) => (
              <div
                key={campaign.id}
                onClick={() => onSelectCampaign(campaign)}
                className="p-3.5 rounded-xl border border-slate-200/70 bg-slate-50/50 hover:bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {campaign.name}
                      </span>
                      <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded ${
                        campaign.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {campaign.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate mt-0.5">
                      {campaign.agency} · {campaign.city} · {campaign.mediaType}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-900 shrink-0">
                    {campaign.completionRate}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-2.5">
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full rounded-full ${
                        campaign.status === 'Completed' ? 'bg-emerald-600' : 'bg-brand-600'
                      }`}
                      style={{ width: `${campaign.completionRate}%` }}
                    />
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mt-1">
                    <span>{campaign.submittedUnits} / {campaign.targetUnits} units</span>
                    {campaign.flaggedUnits > 0 && (
                      <span className="text-rose-600 font-medium">{campaign.flaggedUnits} flagged</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* City Coverage List */}
        <div className="lg:col-span-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  City Coverage
                </h3>
                <p className="text-xs text-slate-500">
                  Tasks executed by active urban cluster
                </p>
              </div>
              <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                This month
              </span>
            </div>

            <div className="space-y-3">
              {cityData.map((item) => (
                <div key={item.city} className="flex items-center justify-between gap-3 text-xs">
                  <span className="flex items-center gap-1.5 font-medium text-slate-700 w-28 shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {item.city}
                  </span>

                  {/* Horizontal bar */}
                  <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-brand-600 h-full rounded-full"
                      style={{ width: `${item.completionRate}%` }}
                    />
                  </div>

                  <div className="flex items-center gap-2 text-right w-20 justify-end">
                    <span className="font-semibold text-slate-900 font-mono text-[11px]">
                      {item.tasksExecuted}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.completionRate}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>6 urban transit markets</span>
            <span className="text-brand-600 font-medium cursor-pointer" onClick={() => onNavigateToTab('campaigns')}>
              Explore by city &rarr;
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};

