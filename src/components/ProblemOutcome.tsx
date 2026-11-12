import React from 'react';
import { Camera, BarChart2, AlertOctagon, FileSpreadsheet, ArrowRight } from 'lucide-react';
import { DemoTabId } from './demo/InteractiveDemo';
import { trackMooviqEvent } from '../lib/analytics';

interface ProblemOutcomeProps {
  onSelectDemoTab: (tab: DemoTabId) => void;
}

export const ProblemOutcome: React.FC<ProblemOutcomeProps> = ({ onSelectDemoTab }) => {
  const cards = [
    {
      problem: 'Scattered evidence',
      benefit: 'Organized media-unit proof',
      explanation: 'Link photos, unit IDs, and playback logs directly to each campaign asset instead of chasing chat threads.',
      icon: Camera,
      targetTab: 'proofs' as DemoTabId,
    },
    {
      problem: 'No clear execution status',
      benefit: 'Campaign-wide audit visibility',
      explanation: 'Track expected units alongside submitted, verified, flagged, and pending counts across cities and formats.',
      icon: BarChart2,
      targetTab: 'campaigns' as DemoTabId,
    },
    {
      problem: 'Exceptions discovered late',
      benefit: 'Structured condition checks and issue queues',
      explanation: 'Surface damaged wraps, billboard obstructions, or missing screen playouts early for timely remediation.',
      icon: AlertOctagon,
      targetTab: 'alerts' as DemoTabId,
    },
    {
      problem: 'Manual reporting',
      benefit: 'Consistent reports and client updates',
      explanation: 'Generate standardized format-specific summaries and filtered CSV exports without manual slide assembly.',
      icon: FileSpreadsheet,
      targetTab: 'reports' as DemoTabId,
    },
  ];

  const handleExplore = (tab: DemoTabId, label: string) => {
    trackMooviqEvent('cta_click', { location: 'problem_solution', target_tab: tab, label });
    onSelectDemoTab(tab);
  };

  return (
    <section className="py-16 md:py-20 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Less chasing. Clearer verification.
          </h2>
          <p className="mt-3 text-base text-slate-600">
            Replace fragmented field follow-ups with structured campaign evidence and review workflows.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 text-left">
          {cards.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.problem}
                className="flex flex-col justify-between p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-brand-600 mb-5">
                    <Icon className="w-5 h-5" />
                  </div>

                  <p className="text-xs font-semibold text-slate-500">
                    {item.problem}
                  </p>
                  <h3 className="text-base font-bold text-slate-900 mt-1 flex items-start gap-1.5">
                    <span>{item.benefit}</span>
                  </h3>
                  <p className="mt-2.5 text-xs text-slate-600 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>

                <div className="mt-6 pt-3.5 border-t border-slate-100">
                  <a
                    href="#explore-demo"
                    onClick={(e) => {
                      e.preventDefault();
                      handleExplore(item.targetTab, item.benefit);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 transition-colors group"
                  >
                    <span>Explore in demo</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
