import React from 'react';
import { 
  PlusCircle, 
  MapPin, 
  Smartphone, 
  AlertTriangle, 
  Share2, 
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

interface HowItWorksProps {
  onSelectDemoTab?: (tab: 'overview' | 'campaigns' | 'proofs' | 'alerts' | 'analytics') => void;
}

export const HowItWorks: React.FC<HowItWorksProps> = ({ onSelectDemoTab }) => {
  const steps = [
    {
      num: '01',
      title: 'Create an audit campaign',
      description: 'Set target media units, specify city clusters, dates, and assign your executing field agency partner.',
      icon: PlusCircle,
      targetTab: 'campaigns' as const,
      linkText: 'See sample campaigns',
    },
    {
      num: '02',
      title: 'Assign media units',
      description: 'Define specific inventory types: auto branding, transit wraps, retail billboards, or digital mall totems.',
      icon: MapPin,
      targetTab: 'overview' as const,
      linkText: 'Inspect city coverage',
    },
    {
      num: '03',
      title: 'Collect field evidence',
      description: 'Auditors submit proof photos, vehicle identifiers, and checkpoint status notes from field locations.',
      icon: Smartphone,
      targetTab: 'proofs' as const,
      linkText: 'Explore 10 proofs',
    },
    {
      num: '04',
      title: 'Review and resolve issues',
      description: 'Automated exception checks flag suspicious duplicates or location drift for human auditor verification.',
      icon: AlertTriangle,
      targetTab: 'alerts' as const,
      linkText: 'Check exception queue',
    },
    {
      num: '05',
      title: 'Share campaign results',
      description: 'Export audit logs, verified proof summaries, and completion metrics with marketing leadership and brands.',
      icon: Share2,
      targetTab: 'analytics' as const,
      linkText: 'View reporting metrics',
    },
  ];

  const handleJumpToDemo = (tab: 'overview' | 'campaigns' | 'proofs' | 'alerts' | 'analytics') => {
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
    <section id="how-it-works" className="scroll-mt-20 py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Operational Lifecycle
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Mooviq verifies campaign execution.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            From initial placement planning to audit sign-off, maintain an unbroken chain of custody for every media asset.
          </p>
        </div>

        {/* Stepper Grid (Horizontal on Desktop, Vertical on Mobile) */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <div
                key={step.num}
                className="relative p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Step Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-black text-slate-200 font-mono">
                      {step.num}
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-brand-600 flex items-center justify-center">
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

                {/* Explore in demo link */}
                <div className="mt-5 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => handleJumpToDemo(step.targetTab)}
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

