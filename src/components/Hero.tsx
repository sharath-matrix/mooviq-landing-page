import React from 'react';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronDown,
  FileCheck,
  BarChart3,
  ClipboardCheck,
  Building2,
  Tv,
  Car,
  Film,
} from 'lucide-react';
import { DemoTabId } from './demo/InteractiveDemo';
import { trackMooviqEvent } from '../lib/analytics';

interface HeroProps {
  onExploreDemoClick: (tab?: DemoTabId) => void;
  onRequestQuoteClick: () => void;
  onBookDemoClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreDemoClick,
  onRequestQuoteClick,
  onBookDemoClick,
}) => {
  return (
    <section id="hero" className="relative pt-28 pb-14 md:pt-36 md:pb-20 overflow-hidden bg-slate-50">
      {/* Subtle architectural background tone */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[460px] pointer-events-none opacity-35">
        <div className="absolute top-12 left-1/4 w-96 h-96 bg-brand-200/40 rounded-full blur-3xl" />
        <div className="absolute top-24 right-1/4 w-80 h-80 bg-slate-200/60 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Positioning & CTAs */}
          <div className="lg:col-span-6 flex flex-col text-left">
            <div className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs mb-6">
              <span className="w-2 h-2 rounded-full bg-brand-600" />
              <span className="text-[11px] font-bold tracking-wider uppercase text-slate-700">
                Multi-Media Audit &amp; Proof of Performance
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-extrabold tracking-tight text-slate-900 leading-[1.1]">
              Every media placement. Verified with evidence.
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Plan audits, collect location-linked proof, review media condition, resolve exceptions and report campaign execution across offline advertising formats—from one organized workspace.
            </p>

            {/* Primary, Secondary & Tertiary CTAs */}
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  trackMooviqEvent('cta_click', { location: 'hero', cta: 'Explore Interactive Demo' });
                  onExploreDemoClick('overview');
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-600/20 transition-all cursor-pointer group"
              >
                <span>Explore Interactive Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => {
                  trackMooviqEvent('cta_click', { location: 'hero', cta: 'Request an Audit Quote' });
                  onRequestQuoteClick();
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm border border-slate-200 shadow-2xs transition-all cursor-pointer"
              >
                <span>Request an Audit Quote</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  trackMooviqEvent('cta_click', { location: 'hero', cta: 'Book a Demo' });
                  onBookDemoClick();
                }}
                className="inline-flex items-center justify-center px-3 py-3 text-sm font-semibold text-slate-600 hover:text-brand-600 transition-colors cursor-pointer underline underline-offset-4 decoration-slate-300 hover:decoration-brand-600"
              >
                Book a Demo
              </button>
            </div>

            {/* Concise Verified / Designed Capabilities */}
            <div className="mt-9 pt-7 border-t border-slate-200/80">
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: 'Structured inspection workflows', icon: ClipboardCheck },
                  { label: 'Campaign-linked evidence', icon: FileCheck },
                  { label: 'Verification review queues', icon: AlertCircle },
                  { label: 'Exportable audit reports', icon: BarChart3 },
                ].map((chip) => {
                  const Icon = chip.icon;
                  return (
                    <div
                      key={chip.label}
                      className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-slate-200/90 text-xs font-medium text-slate-700"
                    >
                      <Icon className="w-3.5 h-3.5 text-brand-600 shrink-0" />
                      <span className="truncate">{chip.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Multi-Media Miniature Product Preview */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-lg lg:max-w-none">
              <div className="relative rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-slate-900/5 overflow-hidden">
                {/* Mock Window Header */}
                <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1.5" aria-hidden="true">
                      <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    </div>
                    <span className="text-xs font-medium text-slate-200 ml-1.5 flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
                      <span>Mooviq · Multi-Media Workspace</span>
                    </span>
                  </div>
                  <span className="text-[10px] font-medium bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                    Sample data
                  </span>
                </div>

                {/* Multi-Format Active Sample Strip */}
                <div className="grid grid-cols-3 divide-x divide-slate-100 bg-slate-50/80 p-3 border-b border-slate-100 text-left">
                  <div className="px-2">
                    <span className="text-[11px] text-slate-500 block">Media Families</span>
                    <span className="text-sm font-bold text-slate-900">4 Categories</span>
                  </div>
                  <div className="px-2">
                    <span className="text-[11px] text-slate-500 block">Sample Campaigns</span>
                    <span className="text-sm font-bold text-slate-900">8 Multi-Format</span>
                  </div>
                  <div className="px-2">
                    <span className="text-[11px] text-slate-500 block">Review Queue</span>
                    <span className="text-sm font-bold text-rose-600">Condition &amp; Logs</span>
                  </div>
                </div>

                {/* Diverse Multi-Media Audit Preview Rows */}
                <div className="p-4 space-y-2.5 bg-white text-left">
                  {/* Billboard / OOH */}
                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-brand-600 shrink-0">
                          <Building2 className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            BlueHarbor Billboard Sprint
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            Outdoor / OOH · Ring Road &amp; DND · Photo workflow
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 shrink-0">93%</span>
                    </div>
                    <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-brand-600 h-full rounded-full" style={{ width: '93%' }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>74 / 80 sites audited</span>
                      <span className="text-rose-600 font-medium">2 obstruction flags</span>
                    </div>
                  </div>

                  {/* Mall Digital Screen */}
                  <div className="p-3 rounded-xl bg-slate-50/70 border border-slate-200/80">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 shrink-0">
                          <Tv className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-bold text-slate-900 block truncate">
                            UrbanNest Mall Digital Network
                          </span>
                          <span className="text-[11px] text-slate-500 block truncate">
                            Indoor / Place-Based · Mumbai · Screen + CMS check
                          </span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-900 shrink-0">93%</span>
                    </div>
                    <div className="mt-2 w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                      <div className="bg-emerald-600 h-full rounded-full" style={{ width: '93%' }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 mt-1">
                      <span>205 / 220 screens checked</span>
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5" /> 194 verified
                      </span>
                    </div>
                  </div>

                  {/* Mixed Formats Mini Row: Transit + Cinema Log */}
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                        <Car className="w-3.5 h-3.5 text-brand-600" />
                        <span>Transit &amp; Fleets</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Auto &amp; Cab panel condition checks · 600–1,200 units
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-800">
                        <Film className="w-3.5 h-3.5 text-slate-700" />
                        <span>Cinema Playback</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1">
                        Playout log reconciliation · Integration required
                      </p>
                    </div>
                  </div>
                </div>

                {/* Footer preview banner */}
                <div className="bg-slate-50 px-4 py-2.5 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
                  <span>Interactive sample data — not live client records</span>
                  <button
                    type="button"
                    onClick={() => {
                      trackMooviqEvent('cta_click', { location: 'hero_preview', cta: 'Open demo' });
                      onExploreDemoClick('reports');
                    }}
                    className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <span>See sample reports</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Cue */}
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => onExploreDemoClick('overview')}
            className="inline-flex flex-col items-center gap-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer group"
          >
            <span className="text-xs font-medium tracking-wide">Explore media coverage &amp; interactive workspace</span>
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};
