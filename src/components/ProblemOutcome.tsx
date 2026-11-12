import React from 'react';
import { Camera, BarChart2, AlertOctagon, Share2, ArrowRight } from 'lucide-react';

interface ProblemOutcomeProps {
  onSelectDemoTab?: (tab: 'overview' | 'campaigns' | 'proofs' | 'alerts' | 'analytics') => void;
}

export const ProblemOutcome: React.FC<ProblemOutcomeProps> = ({ onSelectDemoTab }) => {
  const cards = [
    {
      problem: 'Scattered proof photos',
      problemDesc: 'Photos buried in WhatsApp chats, email chains, and shared drives with missing context.',
      solution: 'Evidence attached to the right campaign and media unit',
      solutionDesc: 'Structured submissions tagged with media type, city location, and time verification.',
      icon: Camera,
      badge: 'Organized proof',
      targetTab: 'proofs' as const,
    },
    {
      problem: 'No clear status',
      problemDesc: 'Brands and agencies constantly asking how many units have been audited and how many remain.',
      solution: 'Progress and pending audits visible in one place',
      solutionDesc: 'Clear target units, verified submissions, and pending tasks derived directly from campaign records.',
      icon: BarChart2,
      badge: 'Unified visibility',
      targetTab: 'campaigns' as const,
    },
    {
      problem: 'Late exception discovery',
      problemDesc: 'Duplicate angles, wrong locations, or obscured creatives noticed only after campaign concludes.',
      solution: 'Flagged issues surface for review',
      solutionDesc: 'Discrepancies appear in exception queues immediately so field teams can re-inspect promptly.',
      icon: AlertOctagon,
      badge: 'Early detection',
      targetTab: 'alerts' as const,
    },
    {
      problem: 'Manual client updates',
      problemDesc: 'Spending hours consolidating spreadsheets, resizing images, and creating custom PPT reports.',
      solution: 'Consistent, exportable status summaries',
      solutionDesc: 'Filter by city, media type, or agency and export clean CSV summaries and shareable reports.',
      icon: Share2,
      badge: 'Ready to share',
      targetTab: 'analytics' as const,
    },
  ];

  const handleExplore = (tab: 'overview' | 'campaigns' | 'proofs' | 'alerts' | 'analytics') => {
    if (onSelectDemoTab) {
      onSelectDemoTab(tab);
    }
    const demoElement = document.getElementById('explore-demo');
    if (demoElement) {
      const headerOffset = 80;
      const elementPosition = demoElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <section className="py-16 md:py-24 bg-white border-y border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Audit Workflow Clarity
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Less chasing. More certainty.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Eliminate endless follow-ups and ambiguous campaign proofs. Mooviq transforms chaotic field submissions into verifiable, audit-grade records.
          </p>
        </div>

        {/* 4 Outcome Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {cards.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="group relative flex flex-col justify-between p-6 rounded-2xl bg-slate-50/70 border border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-lg transition-all duration-200"
              >
                <div>
                  {/* Top Bar with Icon & Badge */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-brand-600 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-semibold text-slate-500 bg-white border border-slate-200/90 px-2 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  </div>

                  {/* Problem state */}
                  <div className="mb-4 pb-4 border-b border-slate-200/70">
                    <span className="text-xs font-semibold text-rose-600 uppercase tracking-wider">
                      The Friction
                    </span>
                    <h3 className="text-base font-bold text-slate-800 line-through decoration-rose-300 decoration-2">
                      {item.problem}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                      {item.problemDesc}
                    </p>
                  </div>

                  {/* Outcome / Mooviq way */}
                  <div>
                    <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider flex items-center gap-1">
                      <span>Mooviq Solution</span>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    <p className="text-base font-bold text-slate-900 mt-0.5">
                      {item.solution}
                    </p>
                    <p className="mt-1.5 text-xs text-slate-600 leading-relaxed">
                      {item.solutionDesc}
                    </p>
                  </div>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Outcome 0{index + 1}</span>
                  <button
                    type="button"
                    onClick={() => handleExplore(item.targetTab)}
                    className="text-brand-600 hover:text-brand-700 font-semibold opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    Explore in demo &rarr;
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
