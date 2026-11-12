import React from 'react';
import { 
  ArrowRight, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  ChevronDown,
  Layers,
  FileCheck,
  Eye,
  BarChart3
} from 'lucide-react';

interface HeroProps {
  onExploreDemoClick: (tab?: 'overview' | 'campaigns' | 'proofs' | 'alerts' | 'analytics') => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreDemoClick }) => {
  const handleScrollToDemo = (
    e: React.MouseEvent,
    targetTab: 'overview' | 'campaigns' | 'proofs' | 'alerts' | 'analytics' = 'overview'
  ) => {
    e.preventDefault();
    onExploreDemoClick(targetTab);
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
    <section id="hero" className="relative pt-28 pb-16 md:pt-36 md:pb-24 overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-brand-200/50 rounded-full blur-3xl" />
        <div className="absolute top-24 right-1/4 w-80 h-80 bg-teal-200/40 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Messaging & CTAs */}
          <div className="lg:col-span-6 flex flex-col text-left">
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-slate-900/5 border border-slate-900/10 mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-600 animate-pulse" />
              <span className="text-xs font-bold tracking-wider uppercase text-slate-800">
                Media Audit & Campaign Verification
              </span>
            </div>

            {/* H1 */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
              Every placement accounted for.
            </h1>

            {/* Subheading */}
            <p className="mt-5 text-lg sm:text-xl text-slate-600 leading-relaxed max-w-xl">
              Plan audits, collect field evidence, spot exceptions and share clear campaign progress—all from one Mooviq workspace.
            </p>

            {/* CTAs */}
            <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
              <button
                type="button"
                onClick={handleScrollToDemo}
                className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-base shadow-lg shadow-brand-600/20 hover:shadow-brand-600/30 transition-all cursor-pointer group"
              >
                <span>Explore Interactive Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <a
                href="https://erazero.ai/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-base border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
              >
                <span>Book a Demo</span>
                <ExternalLink className="w-4 h-4 text-slate-400" />
              </a>
            </div>

            {/* Trust / Capability Chips */}
            <div className="mt-10 pt-8 border-t border-slate-200/80">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Core Workspace Capabilities
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'Campaign visibility', icon: Eye },
                  { label: 'Structured media proofs', icon: FileCheck },
                  { label: 'Exception tracking', icon: AlertCircle },
                  { label: 'Shareable reporting', icon: BarChart3 },
                ].map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <div
                      key={chip.label}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200/90 text-xs font-medium text-slate-700 shadow-xs"
                    >
                      <Icon className="w-3.5 h-3.5 text-brand-600" />
                      <span>{chip.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Miniature Application Preview */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              
              {/* Outer decorative glow */}
              <div className="absolute -inset-1.5 bg-gradient-to-tr from-brand-600/20 via-slate-200 to-teal-500/20 rounded-3xl blur-xl opacity-70" />

              {/* Miniature App Window */}
              <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-2xl shadow-slate-900/10 overflow-hidden">
                
                {/* Mock Window Title Bar */}
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-medium text-slate-300 ml-2 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-500" />
                      <span>Mooviq Workspace · Overview</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium tracking-wide bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      Product concept / Sample data
                    </span>
                  </div>
                </div>

                {/* Mock Metric Stats Bar */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50/70 p-3 border-b border-slate-100 text-left">
                  <div className="px-2">
                    <span className="text-[11px] text-slate-500 block">Active Campaigns</span>
                    <span className="text-base font-bold text-slate-900">6 Ongoing</span>
                  </div>
                  <div className="px-2">
                    <span className="text-[11px] text-slate-500 block">Audits Completed</span>
                    <span className="text-base font-bold text-slate-900">2,346 Tasks</span>
                  </div>
                  <div className="px-2">
                    <span className="text-[11px] text-slate-500 block">Audit Exceptions</span>
                    <span className="text-base font-bold text-rose-600">18 Flagged</span>
                  </div>
                </div>

                {/* Miniature Campaign Cards Preview */}
                <div className="p-4 space-y-3 bg-white text-left">
                  
                  {/* Card 1 */}
                  <div className="p-3 rounded-xl bg-slate-50/60 border border-slate-200/70 hover:border-slate-300 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            Northstar Transit Launch
                          </span>
                          <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200/80 px-1.5 py-0.2 rounded">
                            Ongoing
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          BrightAds Media · Bengaluru · Auto Branding
                        </span>
                      </div>
                      <span className="text-xs font-bold text-slate-900">
                        44%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2.5">
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                        <div className="bg-brand-600 h-full rounded-full" style={{ width: '44%' }} />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                        <span>653 / 1,500 units</span>
                        <span className="text-rose-600 font-medium">8 flagged for review</span>
                      </div>
                    </div>
                  </div>

                  {/* Card 2 */}
                  <div className="p-3 rounded-xl bg-slate-50/60 border border-slate-200/70 hover:border-slate-300 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-900">
                            Aster Mobility Fleet Wrap
                          </span>
                          <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-1.5 py-0.2 rounded">
                            Completed
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-500 block mt-0.5">
                          Metro Outdoor · Hyderabad · Cab Branding
                        </span>
                      </div>
                      <span className="text-xs font-bold text-emerald-700">
                        100%
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-2.5">
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden flex">
                        <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }} />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1">
                        <span>900 / 900 units submitted</span>
                        <span className="text-emerald-700 font-medium flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" /> 884 verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Proof Sample Strip */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between text-[11px] mb-2">
                      <span className="font-semibold text-slate-700">Recent Audit Evidence</span>
                      <button
                        type="button"
                        onClick={(e) => handleScrollToDemo(e, 'proofs')}
                        className="text-brand-600 font-medium cursor-pointer hover:underline"
                      >
                        Open 10 proofs in demo &rarr;
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="h-14 rounded-lg bg-slate-100 border border-slate-200 p-1.5 flex flex-col justify-between">
                        <span className="text-[9px] font-medium text-slate-600 truncate">Indiranagar 100ft</span>
                        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 self-start px-1 rounded">
                          Verified
                        </span>
                      </div>
                      <div className="h-14 rounded-lg bg-slate-100 border border-slate-200 p-1.5 flex flex-col justify-between">
                        <span className="text-[9px] font-medium text-slate-600 truncate">Phoenix Lower Parel</span>
                        <span className="text-[8px] font-bold text-emerald-700 bg-emerald-50 self-start px-1 rounded">
                          Verified
                        </span>
                      </div>
                      <div className="h-14 rounded-lg bg-rose-50/70 border border-rose-200 p-1.5 flex flex-col justify-between">
                        <span className="text-[9px] font-medium text-rose-800 truncate">Koramangala 80ft</span>
                        <span className="text-[8px] font-bold text-rose-700 bg-rose-100 self-start px-1 rounded">
                          Flagged
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Footer preview banner */}
                <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    Interactive prototype ready
                  </span>
                  <button
                    type="button"
                    onClick={handleScrollToDemo}
                    className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1"
                  >
                    <span>Click to test drive</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>

        {/* Scroll Cue */}
        <div className="mt-14 flex justify-center">
          <button
            type="button"
            onClick={handleScrollToDemo}
            className="inline-flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer group"
          >
            <span className="text-xs font-medium tracking-wide">Scroll to explore the product</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform animate-bounce" />
          </button>
        </div>

      </div>
    </section>
  );
};

