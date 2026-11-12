import React, { useState } from 'react';
import { 
  BarChart3, 
  PieChart, 
  TrendingUp, 
  Calendar, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Clock,
  Info
} from 'lucide-react';
import { MonthlyAuditPoint, Campaign } from '../../types/mooviq';

interface AnalyticsTabProps {
  monthlyData: MonthlyAuditPoint[];
  campaigns: Campaign[];
}

export const AnalyticsTab: React.FC<AnalyticsTabProps> = ({
  monthlyData,
  campaigns,
}) => {
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyAuditPoint | null>(null);

  const maxAuditValue = Math.max(...monthlyData.map((d) => d.tasks));

  // Compute breakdown across campaigns
  const totalVerified = campaigns.reduce((acc, c) => acc + c.verifiedUnits, 0);
  const totalFlagged = campaigns.reduce((acc, c) => acc + c.flaggedUnits, 0);
  const totalPending = campaigns.reduce((acc, c) => acc + c.pendingUnits, 0);
  const totalSubmitted = totalVerified + totalFlagged + totalPending;
  const overallPassRate = totalSubmitted > 0
    ? ((totalVerified / totalSubmitted) * 100).toFixed(1)
    : '0.0';
  const monthlyPassRate = monthlyData.length > 0
    ? ((monthlyData.reduce((s, m) => s + m.verified, 0) / monthlyData.reduce((s, m) => s + m.tasks, 0)) * 100).toFixed(1)
    : '0.0';

  // Media type breakdown
  const mediaBreakdown: { [key: string]: number } = {};
  campaigns.forEach((c) => {
    mediaBreakdown[c.mediaType] = (mediaBreakdown[c.mediaType] || 0) + c.submittedUnits;
  });

  return (
    <div className="space-y-6 text-left">
      
      {/* Top Banner Notice */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
            <BarChart3 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Audit Intelligence & Reporting
            </h3>
            <p className="text-xs text-slate-500">
              Aggregated submission volumes, validation rates, and media category performance
            </p>
          </div>
        </div>

        <span className="text-[11px] font-semibold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg border border-slate-200">
          Illustrative time-series data
        </span>
      </div>

      {/* Screen-reader summary for accessibility */}
      <div className="sr-only">
        <h4>Screen Reader Data Summary</h4>
        <p>
          Monthly task volumes from February to July 2026:{' '}
          {monthlyData.map((m) => `${m.month} ${m.tasks} audits`).join(', ')}.
          Current verification status distribution: {totalVerified} verified units, {totalPending} pending units, {totalFlagged} flagged units ({overallPassRate}% verified rate).
        </p>
      </div>

      {/* 2-Column Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Monthly Velocity Interactive Chart */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Monthly Verification Volume
                </h4>
                <p className="text-xs text-slate-500">
                  Chronological audits completed per month (Feb – Jul 2026)
                </p>
              </div>

              {hoveredMonth ? (
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {hoveredMonth.fullName}: {hoveredMonth.tasks} tasks
                  </span>
                  <span className="text-[10px] text-emerald-600 block">
                    {hoveredMonth.verified} verified · {hoveredMonth.flagged} flagged
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">
                  Hover bar for details
                </span>
              )}
            </div>

            {/* Custom SVG / HTML Bar Chart */}
            <div className="mt-8 pt-4 border-t border-slate-100">
              <div className="h-52 flex items-end justify-between gap-4 sm:gap-8 px-4">
                {monthlyData.map((item) => {
                  const verifiedHeight = Math.round((item.verified / maxAuditValue) * 100);
                  const flaggedHeight = Math.round((item.flagged / maxAuditValue) * 100);

                  return (
                    <div
                      key={item.month}
                      tabIndex={0}
                      role="button"
                      aria-label={`${item.fullName}: ${item.tasks} total audits, ${item.verified} verified, ${item.flagged} flagged`}
                      onMouseEnter={() => setHoveredMonth(item)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      onFocus={() => setHoveredMonth(item)}
                      onBlur={() => setHoveredMonth(null)}
                      className="flex-1 flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
                    >
                      <div className="text-[10px] font-bold text-slate-700 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.tasks}
                      </div>

                      {/* Stacked bar */}
                      <div className="w-full max-w-[48px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-40">
                        {/* Flagged segment */}
                        <div 
                          className="bg-rose-500 w-full transition-all duration-200 group-hover:brightness-110" 
                          style={{ height: `${flaggedHeight}%` }} 
                        />
                        {/* Verified segment */}
                        <div 
                          className="bg-brand-600 w-full transition-all duration-200 group-hover:brightness-110" 
                          style={{ height: `${verifiedHeight}%` }} 
                        />
                      </div>

                      <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900">
                        {item.month}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Chart Legend */}
              <div className="flex items-center justify-center gap-6 mt-6 pt-4 border-t border-slate-100 text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded bg-brand-600" />
                  Verified Units
                </span>
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded bg-rose-500" />
                  Audit Exceptions
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Illustrative 6-month series ({monthlyPassRate}% verified)</span>
            <span className="font-semibold text-slate-700">{overallPassRate}% Active Campaign Pass Rate</span>
          </div>
        </div>

        {/* Verification Status Distribution */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1">
              Validation Distribution
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Total current submissions breakdown
            </p>

            {/* Circular / Progress Ring representation */}
            <div className="space-y-4">
              {/* Verified */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                  <span className="text-slate-900 font-mono">
                    {totalVerified} ({Math.round((totalVerified / totalSubmitted) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-600 h-full rounded-full" 
                    style={{ width: `${(totalVerified / totalSubmitted) * 100}%` }} 
                  />
                </div>
              </div>

              {/* Pending */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <Clock className="w-3.5 h-3.5" /> Pending Queue
                  </span>
                  <span className="text-slate-900 font-mono">
                    {totalPending} ({Math.round((totalPending / totalSubmitted) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-400 h-full rounded-full" 
                    style={{ width: `${(totalPending / totalSubmitted) * 100}%` }} 
                  />
                </div>
              </div>

              {/* Flagged */}
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-rose-700">
                    <AlertTriangle className="w-3.5 h-3.5" /> Flagged Exceptions
                  </span>
                  <span className="text-slate-900 font-mono">
                    {totalFlagged} ({Math.round((totalFlagged / totalSubmitted) * 100)}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="bg-rose-500 h-full rounded-full" 
                    style={{ width: `${(totalFlagged / totalSubmitted) * 100}%` }} 
                  />
                </div>
              </div>
            </div>

            {/* Total Submissions Metric Pill */}
            <div className="mt-8 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">Total Evaluated Audits</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {totalSubmitted.toLocaleString()} Units
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Zero data loss · Cryptographic tamper check
          </div>
        </div>

      </div>

      {/* Media Type Share Horizontal Bars */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-1">
          Volume Distribution by Media Inventory Type
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Breakdown across static transit, digital malls, and corporate assets
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {Object.entries(mediaBreakdown).map(([media, units]) => {
            const percent = Math.round((units / totalSubmitted) * 100);
            return (
              <div key={media} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-slate-800">{media}</span>
                  <span className="font-mono text-slate-600">{units} units</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div 
                    className="bg-brand-600 h-full rounded-full" 
                    style={{ width: `${percent}%` }} 
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {percent}% of current sample audit volume
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

