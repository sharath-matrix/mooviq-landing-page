import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  Clock,
  FileSpreadsheet,
  Download,
  Info,
} from 'lucide-react';
import {
  MonthlyAuditPoint,
  Campaign,
  ReportFormatKey,
} from '../../types/mooviq';
import { SAMPLE_AUDIT_REPORTS } from '../../data/demoData';
import { MEDIA_FAMILIES } from '../../config/mediaAuditCatalog';

interface ReportsTabProps {
  monthlyData: MonthlyAuditPoint[];
  campaigns: Campaign[];
}

export const ReportsTab: React.FC<ReportsTabProps> = ({
  monthlyData,
  campaigns,
}) => {
  const [selectedReportKey, setSelectedReportKey] = useState<ReportFormatKey>('billboard');
  const [hoveredMonth, setHoveredMonth] = useState<MonthlyAuditPoint | null>(null);

  const activeReport = SAMPLE_AUDIT_REPORTS[selectedReportKey];
  const maxAuditValue = Math.max(...monthlyData.map((d) => d.tasks));

  const totalVerified = campaigns.reduce((acc, c) => acc + c.verifiedUnits, 0);
  const totalFlagged = campaigns.reduce((acc, c) => acc + c.flaggedUnits, 0);
  const totalPending = campaigns.reduce((acc, c) => acc + c.pendingUnits, 0);
  const totalSubmitted = totalVerified + totalFlagged + totalPending;
  const overallPassRate = totalSubmitted > 0 ? ((totalVerified / totalSubmitted) * 100).toFixed(1) : '0.0';
  const monthlyPassRate =
    monthlyData.length > 0
      ? (
          (monthlyData.reduce((s, m) => s + m.verified, 0) /
            monthlyData.reduce((s, m) => s + m.tasks, 0)) *
          100
        ).toFixed(1)
      : '0.0';

  const familyBreakdown = MEDIA_FAMILIES.map((family) => {
    const units = campaigns
      .filter((c) => c.mediaFamilyId === family.id)
      .reduce((acc, c) => acc + c.submittedUnits, 0);
    return { family: family.label, units };
  });

  const handleDownloadFormatCsv = () => {
    const headerLines = [
      `Mooviq Sample Audit Report - ${activeReport.label}`,
      `Verification Mode: ${activeReport.verificationMode}`,
      `Notice: Interactive sample data - not live client records`,
      `${activeReport.columns.join(',')},Notes`,
    ];

    const rowLines = activeReport.rows.map(
      (r) =>
        `"${r.unitId}","${r.locationOrScreen}","${r.checkpointTime}","${r.primaryCheck}","${r.secondaryCheck}","${r.status}","${r.note}"`
    );

    const csvUri =
      'data:text/csv;charset=utf-8,' + encodeURIComponent([...headerLines, ...rowLines].join('\n'));
    const a = document.createElement('a');
    a.setAttribute('href', csvUri);
    a.setAttribute('download', `mooviq-sample-report-${selectedReportKey}.csv`);
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const reportFormats: { key: ReportFormatKey; label: string }[] = [
    { key: 'auto', label: 'Auto' },
    { key: 'cab', label: 'Cab' },
    { key: 'billboard', label: 'Billboard' },
    { key: 'mall-screen', label: 'Mall Screen' },
    { key: 'cinema-playback', label: 'Cinema Playback' },
  ];

  return (
    <div className="space-y-6 text-left">
      {/* 1. Adaptive Sample Audit Report Panel */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  Format-Adaptive Sample Audit Report
                </h3>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                  Sample report layout
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Switch formats below to see how Mooviq adapts fields and verification evidence per medium
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDownloadFormatCsv}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer self-start lg:self-auto"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Format Sample CSV</span>
          </button>
        </div>

        {/* Format Switcher Tabs */}
        <div className="px-5 py-3 bg-slate-50 border-b border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex flex-wrap rounded-xl bg-white p-1 border border-slate-200 gap-1">
            {reportFormats.map((fmt) => (
              <button
                key={fmt.key}
                type="button"
                onClick={() => setSelectedReportKey(fmt.key)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedReportKey === fmt.key
                    ? 'bg-brand-600 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {fmt.label}
              </button>
            ))}
          </div>

          <span className="text-[11px] font-medium text-slate-600">
            Mode: <strong>{activeReport.verificationMode}</strong>
          </span>
        </div>

        {/* Report Body */}
        <div className="p-5 space-y-4">
          {/* Format Summary Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {activeReport.summaryMetrics.map((m) => (
              <div key={m.label} className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
                <span className="text-[10px] font-medium text-slate-500 uppercase tracking-wider block">
                  {m.label}
                </span>
                <span className="text-base font-extrabold text-slate-900 mt-0.5 block">
                  {m.value}
                </span>
              </div>
            ))}
          </div>

          {/* Evidence Model Caveat */}
          <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>{activeReport.caveat}</span>
          </div>

          {/* Responsive Adaptive Audit Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
                  {activeReport.columns.map((col) => (
                    <th key={col} className="py-2.5 px-3 whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                  <th className="py-2.5 px-3 whitespace-nowrap">Reviewer Note</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {activeReport.rows.map((row) => (
                  <tr key={row.unitId} className="hover:bg-slate-50/60">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900 whitespace-nowrap">
                      {row.unitId}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {row.locationOrScreen}
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-500 whitespace-nowrap">
                      {row.checkpointTime}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {row.primaryCheck}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 whitespace-nowrap">
                      {row.secondaryCheck}
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          row.status === 'Verified'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : row.status === 'Flagged'
                            ? 'bg-rose-50 text-rose-700 border border-rose-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 min-w-[180px]">{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Screen-reader summary for chart accessibility */}
      <div className="sr-only">
        <h4>Screen Reader Report Summary</h4>
        <p>
          Monthly sample volume from February to July 2026:{' '}
          {monthlyData.map((m) => `${m.month} ${m.tasks} items`).join(', ')}.
          Active sample distribution: {totalVerified} verified, {totalPending} pending, {totalFlagged} flagged ({overallPassRate}% verified rate).
        </p>
      </div>

      {/* 2. Monthly Chart + Status Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-bold text-slate-900">
                  Monthly Verification Volume
                </h4>
                <p className="text-xs text-slate-500">
                  Illustrative chronological sample series (Feb – Jul 2026)
                </p>
              </div>

              {hoveredMonth ? (
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 font-mono">
                    {hoveredMonth.fullName}: {hoveredMonth.tasks} items
                  </span>
                  <span className="text-[10px] text-emerald-600 block">
                    {hoveredMonth.verified} verified · {hoveredMonth.flagged} flagged
                  </span>
                </div>
              ) : (
                <span className="text-xs text-slate-400 italic">Hover bar for details</span>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="h-48 flex items-end justify-between gap-4 sm:gap-8 px-4">
                {monthlyData.map((item) => {
                  const verifiedHeight = Math.round((item.verified / maxAuditValue) * 100);
                  const flaggedHeight = Math.round((item.flagged / maxAuditValue) * 100);

                  return (
                    <div
                      key={item.month}
                      tabIndex={0}
                      role="button"
                      aria-label={`${item.fullName}: ${item.tasks} sample records, ${item.verified} verified, ${item.flagged} flagged`}
                      onMouseEnter={() => setHoveredMonth(item)}
                      onMouseLeave={() => setHoveredMonth(null)}
                      onFocus={() => setHoveredMonth(item)}
                      onBlur={() => setHoveredMonth(null)}
                      className="flex-1 flex flex-col items-center gap-2 group cursor-pointer focus:outline-none"
                    >
                      <div className="text-[10px] font-bold text-slate-700 font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                        {item.tasks}
                      </div>

                      <div className="w-full max-w-[44px] bg-slate-100 rounded-t-lg overflow-hidden flex flex-col justify-end h-36">
                        <div
                          className="bg-rose-500 w-full transition-all duration-200 group-hover:brightness-110"
                          style={{ height: `${flaggedHeight}%` }}
                        />
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

              <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-slate-100 text-xs">
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded bg-brand-600" />
                  Verified
                </span>
                <span className="flex items-center gap-2 text-slate-600">
                  <span className="w-3 h-3 rounded bg-rose-500" />
                  Exceptions
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Illustrative 6-month trend ({monthlyPassRate}% verified)</span>
            <span className="font-semibold text-slate-700">{overallPassRate}% Active Sample Pass Rate</span>
          </div>
        </div>

        <div className="lg:col-span-4 p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-brand-600" />
              <span>Validation Breakdown</span>
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Derived directly from current sample campaign records
            </p>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-emerald-700">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </span>
                  <span className="text-slate-900 font-mono">
                    {totalVerified} ({totalSubmitted > 0 ? Math.round((totalVerified / totalSubmitted) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-600 h-full rounded-full"
                    style={{ width: `${totalSubmitted > 0 ? (totalVerified / totalSubmitted) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-amber-700">
                    <Clock className="w-3.5 h-3.5" /> Pending Queue
                  </span>
                  <span className="text-slate-900 font-mono">
                    {totalPending} ({totalSubmitted > 0 ? Math.round((totalPending / totalSubmitted) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-400 h-full rounded-full"
                    style={{ width: `${totalSubmitted > 0 ? (totalPending / totalSubmitted) * 100 : 0}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-1">
                  <span className="flex items-center gap-1.5 text-rose-700">
                    <AlertTriangle className="w-3.5 h-3.5" /> Flagged Issues
                  </span>
                  <span className="text-slate-900 font-mono">
                    {totalFlagged} ({totalSubmitted > 0 ? Math.round((totalFlagged / totalSubmitted) * 100) : 0}%)
                  </span>
                </div>
                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="bg-rose-500 h-full rounded-full"
                    style={{ width: `${totalSubmitted > 0 ? (totalFlagged / totalSubmitted) * 100 : 0}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-7 p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-center">
              <span className="text-[11px] text-slate-500 block">Total Sample Units &amp; Logs</span>
              <span className="text-2xl font-extrabold text-slate-900">
                {totalSubmitted.toLocaleString()}
              </span>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-[11px] text-slate-400 text-center">
            Interactive sample data — not live client records
          </div>
        </div>
      </div>

      {/* 3. Volume Share by Media Family */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-1">
          Sample Volume Across Media Families
        </h4>
        <p className="text-xs text-slate-500 mb-4">
          Balanced audit distribution spanning transit, outdoor OOH, indoor place-based, and screen logs
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {familyBreakdown.map((item) => {
            const pct = totalSubmitted > 0 ? Math.round((item.units / totalSubmitted) * 100) : 0;
            return (
              <div key={item.family} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="font-bold text-slate-800 truncate">{item.family}</span>
                  <span className="font-mono text-slate-600 shrink-0">{item.units}</span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mt-2">
                  <div className="bg-brand-600 h-full rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">{pct}% of sample records</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
