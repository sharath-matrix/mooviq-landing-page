import React from 'react';
import {
  ClipboardList,
  FolderCheck,
  SlidersHorizontal,
  ShieldCheck,
  Activity,
  FileSpreadsheet,
} from 'lucide-react';

export const WhatItDoes: React.FC = () => {
  const pillars = [
    {
      title: 'Structured inspection workflows',
      detail: 'Consistent media-unit tasks assigned by city, zone, or site.',
      status: 'Interactive demo & workflow',
      icon: ClipboardList,
    },
    {
      title: 'Campaign-linked evidence',
      detail: 'Photos, unit IDs, and logs attached directly to the right campaign record.',
      status: 'Interactive demo & workflow',
      icon: FolderCheck,
    },
    {
      title: 'Configurable checklists',
      detail: 'Tailored condition checks for static OOH, transit wraps, digital screens, or print.',
      status: 'Designed for production',
      icon: SlidersHorizontal,
    },
    {
      title: 'Verification review & issue tracking',
      detail: 'Review queues surface creative mismatches, damage, or missing playouts.',
      status: 'Interactive demo & workflow',
      icon: ShieldCheck,
    },
    {
      title: 'Progress visibility',
      detail: 'Clear submitted, verified, flagged, and pending counts across active formats.',
      status: 'Interactive demo & workflow',
      icon: Activity,
    },
    {
      title: 'Exportable reports',
      detail: 'Format-adapted summaries and filtered CSV exports ready for client sharing.',
      status: 'Available in demo · Planned custom exports',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <section className="py-10 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              What Mooviq Does
            </p>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
              One structured system across offline media workflows
            </h2>
          </div>
          <p className="text-xs text-slate-500 max-w-md">
            Built for brands, agencies, media owners, and field-audit operators. Capabilities below distinguish between interactive preview modules and planned production integrations.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-left">
          {pillars.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 flex items-start gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-600 shrink-0 mt-0.5">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.detail}</p>
                  <span className="inline-block mt-2 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded">
                    {item.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

