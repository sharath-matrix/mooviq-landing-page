import React from 'react';
import {
  PlusCircle,
  MapPin,
  Smartphone,
  AlertTriangle,
  FileSpreadsheet,
  ArrowRight,
} from 'lucide-react';
import { DemoTabId } from './demo/InteractiveDemo';
import { trackMooviqEvent } from '../lib/analytics';

interface HowItWorksProps {
  onSelectDemoTab: (tab: DemoTabId) => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onSelectDemoTab }) => {
  const steps = [
    {
      num: '01',
      title: 'Plan campaign & formats',
      description: 'Define target assets across transit, OOH, indoor, or broadcast schedules by city and agency.',
      icon: PlusCircle,
      targetTab: 'campaigns' as DemoTabId,
      linkText: 'See sample campaigns',
    },
    {
      num: '02',
      title: 'Configure checkpoints',
      description: 'Assign media-unit checklists, verification rules, or log ingestion intervals per format.',
      icon: MapPin,
      targetTab: 'overview' as DemoTabId,
      linkText: 'Inspect overview',
    },
    {
      num: '03',
      title: 'Collect field or log proof',
      description: 'Field operators submit unit-tagged photos while digital/cinema campaigns attach playout logs.',
      icon: Smartphone,
      targetTab: 'proofs' as DemoTabId,
      linkText: 'Browse proofs & logs',
    },
    {
      num: '04',
      title: 'Review & resolve exceptions',
      description: 'Supervisors inspect creative mismatches, damage, obstructions, or missing playouts.',
      icon: AlertTriangle,
      targetTab: 'alerts' as DemoTabId,
      linkText: 'Open exception queue',
    },
    {
      num: '05',
      title: 'Deliver format reports',
      description: 'Share consistent verification summaries and CSV logs adapted to each media category.',
      icon: FileSpreadsheet,
      targetTab: 'reports' as DemoTabId,
      linkText: 'Preview sample reports',
    },
  ];

  return (
    <section id="how-it-works" className="scroll-mt-20 py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Audit Lifecycle
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Mooviq tracks multi-media execution.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            A structured five-step process connecting field verification and proof-of-play logs to clear client sign-offs.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.num}
                className="relative p-5 rounded-2xl bg-slate-50/70 border border-slate-200/90 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-300 font-mono">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 text-brand-600 flex items-center justify-center">
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200/70">
                  <button
                    type="button"
                    onClick={() => {
                      trackMooviqEvent('cta_click', { location: 'how_it_works', step: step.num });
                      onSelectDemoTab(step.targetTab);
                    }}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer group"
                  >
                    <span>{step.linkText}</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
