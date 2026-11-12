import React, { useState } from 'react';
import { 
  Building2, 
  Car, 
  Tv, 
  Store, 
  Briefcase, 
  Monitor, 
  CheckCircle2, 
  ShieldCheck, 
  Users2, 
  Zap,
  ArrowRight
} from 'lucide-react';

export const UseCases: React.FC = () => {
  const [activeAudience, setActiveAudience] = useState<'brands' | 'agencies' | 'field'>('brands');

  const mediaTypes = [
    {
      title: 'OOH & Billboards',
      description: 'Daytime sightline checks, night illumination verification, and structural mounting audits.',
      icon: Building2,
      evidenceReq: 'Requires wide sightline photo + night floodlight capture',
    },
    {
      title: 'Cab & Auto Branding',
      description: 'Rear-hood, side-wrap, and taxi roof-top audits with vehicle registration match.',
      icon: Car,
      evidenceReq: 'Requires license plate registration + multi-angle vinyl check',
    },
    {
      title: 'Mall Advertising',
      description: 'Atrium totems, pillar wraps, elevator digital displays, and food court placements.',
      icon: Tv,
      evidenceReq: 'Requires digital slot verification + time-stamped video frame',
    },
    {
      title: 'Residential Screens',
      description: 'Lift lobby screens, clubhouse noticeboards, and community gate security branding.',
      icon: Monitor,
      evidenceReq: 'Requires tower geofence match + screen operational status',
    },
    {
      title: 'Corporate Park Media',
      description: 'Turnstile branding, cafeteria digital totems, and tech park shuttle bus networks.',
      icon: Briefcase,
      evidenceReq: 'Requires business park gate pass validation + high-res frame capture',
    },
    {
      title: 'Retail & Dealer Boards',
      description: 'Dealer shopfront fascias, point-of-sale display boards, and dark store wraps.',
      icon: Store,
      evidenceReq: 'Requires store nameboard match + retailer confirmation check',
    },
  ];

  const audienceBenefits = {
    brands: {
      headline: 'For Enterprise Brands & Advertisers',
      subhead: 'Eliminate phantom placements and protect marketing investments.',
      points: [
        'Centralized dashboard tracking every city campaign concurrently',
        'Independent proof verifying that physical placements match booked plans',
        'Immediate notification if scheduled media is damaged or non-operational',
        'Defensible audit documentation for internal finance and compliance audit',
      ],
      badge: 'Brand Governance',
    },
    agencies: {
      headline: 'For Media Agencies & Execution Partners',
      subhead: 'Demonstrate operational excellence and accelerate client campaign sign-offs.',
      points: [
        'Unified system replacing fragmented WhatsApp groups and photo spreadsheets',
        'Automated progress tracking that proves deliverables without manual PPT prep',
        'Fast exception resolution before clients flag missing or defective placements',
        'Exportable branded reports that build long-term trust and retention',
      ],
      badge: 'Agency Efficiency',
    },
    field: {
      headline: 'For Field Operations & Audit Supervisors',
      subhead: 'Standardize evidence collection protocols across distributed field crews.',
      points: [
        'Structured photo capture requirements tailored to static vs digital media',
        'Immediate feedback on image resolution and coordinate thresholds',
        'Clear daily audit task queues organized by route and neighborhood',
        'Audit trail verifying genuine physical presence at media locations',
      ],
      badge: 'Field Operations',
    },
  };

  const activeContent = audienceBenefits[activeAudience];

  return (
    <section id="use-cases" className="scroll-mt-20 py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Versatile Inventory Coverage
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Tailored verification across all physical media formats.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Every physical media type has unique validation needs. Mooviq standardizes proof requirements across transit, digital, and stationary inventory.
          </p>
        </div>

        {/* 6 Compact Media Format Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {mediaTypes.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 hover:bg-white hover:shadow-xs transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-800 shadow-2xs">
                      <Icon className="w-4 h-4 text-brand-600" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 uppercase">
                      Supported Format
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2.5 border-t border-slate-200/60">
                  <span className="text-[10px] text-slate-500 font-medium flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                    {item.evidenceReq}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactive Audience Switcher */}
        <div className="mt-16 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Tailored Perspectives
              </span>
              <h3 className="text-xl font-bold text-slate-900 mt-1">
                Who benefits from Mooviq?
              </h3>
            </div>

            {/* Audience Tab Buttons */}
            <div className="inline-flex rounded-xl bg-white p-1 border border-slate-200 shadow-xs self-start md:self-auto">
              {(['brands', 'agencies', 'field'] as const).map((aud) => (
                <button
                  key={aud}
                  type="button"
                  onClick={() => setActiveAudience(aud)}
                  className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all cursor-pointer capitalize ${
                    activeAudience === aud
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {aud === 'field' ? 'Field Operations' : aud}
                </button>
              ))}
            </div>
          </div>

          {/* Active Audience Details Banner */}
          <div className="pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center text-left">
            <div className="lg:col-span-5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md">
                {activeContent.badge}
              </span>
              <h4 className="text-2xl font-extrabold text-slate-900 mt-3 leading-snug">
                {activeContent.headline}
              </h4>
              <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                {activeContent.subhead}
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activeContent.points.map((pt, i) => (
                <div 
                  key={i}
                  className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-start gap-2.5 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{pt}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

