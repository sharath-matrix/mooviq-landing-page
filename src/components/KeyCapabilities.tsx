import React from 'react';
import { 
  Layers, 
  CheckSquare, 
  Camera, 
  AlertOctagon, 
  Users2, 
  FileSpreadsheet,
  Info
} from 'lucide-react';

export const KeyCapabilities: React.FC = () => {
  const capabilities = [
    {
      title: 'Campaign and media unit tracking',
      description: 'Define scheduled checkpoints, target audit counts, and geographic media inventory per city cluster.',
      icon: Layers,
      tag: 'Core capability',
      tagColor: 'bg-slate-100 text-slate-700',
    },
    {
      title: 'Field tasks and submission status',
      description: 'Monitor ongoing versus completed audits with transparent percentage calculations based on verified submissions.',
      icon: CheckSquare,
      tag: 'Core capability',
      tagColor: 'bg-slate-100 text-slate-700',
    },
    {
      title: 'Structured photographic evidence',
      description: 'Organize field captures with associated media type, vehicle registration, and checkpoint notes.',
      icon: Camera,
      tag: 'Core capability',
      tagColor: 'bg-slate-100 text-slate-700',
    },
    {
      title: 'Review and exception handling',
      description: 'Flag potential duplicates, perspective occlusion, or location offsets for human supervisor inspection.',
      icon: AlertOctagon,
      tag: 'Platform capability / confirm in production build',
      tagColor: 'bg-amber-50 text-amber-800 border border-amber-200',
    },
    {
      title: 'Agency & brand visibility controls',
      description: 'Provide agencies with direct audit execution views while giving brand marketing leads high-level rollups.',
      icon: Users2,
      tag: 'Platform capability / confirm in production build',
      tagColor: 'bg-amber-50 text-amber-800 border border-amber-200',
    },
    {
      title: 'Exportable campaign reporting',
      description: 'Generate clean CSV summaries and presentation-ready audit logs with full timestamp and status trails.',
      icon: FileSpreadsheet,
      tag: 'Core capability',
      tagColor: 'bg-slate-100 text-slate-700',
    },
  ];

  return (
    <section id="features" className="scroll-mt-20 py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            System Architecture
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Built for proof, progress and accountability.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Every feature in Mooviq is engineered to transform field verification from an afterthought into a defensible competitive advantage.
          </p>
        </div>

        {/* 6 Capabilities Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50/60 border border-slate-200/80 hover:border-slate-300 hover:bg-white hover:shadow-md transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-brand-600">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded ${cap.tagColor}`}>
                      {cap.tag}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 mb-2">
                    {cap.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Capability 0{idx + 1}</span>
                  <span className="text-brand-600 font-medium">Documented &bull;</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footnote reassurance */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            Note: Platform capabilities tagged with confirmation badges represent planned production modules subject to client infrastructure setup.
          </p>
        </div>

      </div>
    </section>
  );
};

