import React, { useState } from 'react';
import { 
  Check, 
  HelpCircle, 
  ArrowRight, 
  Calculator, 
  Sparkles, 
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react';

export const Pricing: React.FC = () => {
  // Calculator state
  const [selectedPlanKey, setSelectedPlanKey] = useState<'starter' | 'growth' | 'business'>('growth');
  const [targetAuditsInput, setTargetAuditsInput] = useState<number>(1400);

  const plans = [
    {
      key: 'pilot',
      name: 'Free Pilot',
      price: '₹0',
      period: 'for 14 days',
      badge: 'Evaluation',
      description: 'Test drive Mooviq workflow on a pilot campaign deployment.',
      campaignLimit: '1 active campaign',
      auditLimit: '50 completed audits total',
      userLimit: '2 dashboard users',
      features: [
        'Essential dashboard and proof capture',
        'Sample exportable reporting',
        'Standard email support',
        'Zero upfront commitment',
      ],
      ctaText: 'Request Pilot',
      ctaUrl: 'https://erazero.ai/contact/?plan=free-pilot',
      isPopular: false,
    },
    {
      key: 'starter',
      name: 'Starter',
      price: '₹4,999',
      period: '/month',
      baseAudits: 250,
      baseFee: 4999,
      overageRate: 20,
      badge: 'Early Stage',
      description: 'Ideal for local agencies managing focused city branding.',
      campaignLimit: '3 active campaigns',
      auditLimit: '250 completed audits/mo',
      userLimit: '3 dashboard users',
      features: [
        'Campaign and unit tracking',
        'Basic exception indicators',
        'Standard CSV export',
        'Overage at ₹20 per excess audit',
      ],
      ctaText: 'Discuss Starter',
      ctaUrl: 'https://erazero.ai/contact/?plan=starter',
      isPopular: false,
    },
    {
      key: 'growth',
      name: 'Growth',
      price: '₹14,999',
      period: '/month',
      baseAudits: 1000,
      baseFee: 14999,
      overageRate: 15,
      badge: 'Recommended',
      description: 'For growing agencies and brands running multi-city blitzes.',
      campaignLimit: '10 active campaigns',
      auditLimit: '1,000 completed audits/mo',
      userLimit: '10 dashboard users',
      features: [
        'Multi-city and multi-agency views',
        'Full anomaly inspection drawers',
        'Filterable CSV & audit logs',
        'Overage at ₹15 per excess audit',
        'Priority email & ticket support',
      ],
      ctaText: 'Discuss Growth',
      ctaUrl: 'https://erazero.ai/contact/?plan=growth',
      isPopular: true,
    },
    {
      key: 'business',
      name: 'Business',
      price: '₹39,999',
      period: '/month',
      baseAudits: 3500,
      baseFee: 39999,
      overageRate: 12,
      badge: 'Scale',
      description: 'For large networks with extensive nationwide placements.',
      campaignLimit: '30 active campaigns',
      auditLimit: '3,500 completed audits/mo',
      userLimit: '25 dashboard users',
      features: [
        'Cross-regional management controls',
        'Multi-agency oversight access',
        'Advanced audit report customization',
        'Overage at ₹12 per excess audit',
        'Dedicated onboarding specialist',
      ],
      ctaText: 'Discuss Business',
      ctaUrl: 'https://erazero.ai/contact/?plan=business',
      isPopular: false,
    },
  ];

  // Active plan for calculator
  const activeCalcPlan = plans.find((p) => p.key === selectedPlanKey)!;
  const planBaseLimit = activeCalcPlan.baseAudits || 1000;
  const excessAudits = Math.max(0, targetAuditsInput - planBaseLimit);
  const excessCost = excessAudits * (activeCalcPlan.overageRate || 15);
  const totalEstimatedCost = (activeCalcPlan.baseFee || 14999) + excessCost;

  return (
    <section id="pricing" className="scroll-mt-20 py-16 md:py-24 bg-white border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
            Transparent Pricing
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Clear pricing for every stage.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Illustrative launch pricing, subject to final confirmation. Audit limits and services are defined per plan.
          </p>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {plans.map((plan) => {
            return (
              <div
                key={plan.key}
                className={`rounded-2xl p-6 flex flex-col justify-between transition-all relative ${
                  plan.isPopular
                    ? 'bg-white border-2 border-brand-600 shadow-xl shadow-brand-600/10 scale-[1.02] z-10'
                    : 'bg-slate-50/70 border border-slate-200/90 shadow-xs hover:border-slate-300 hover:bg-white'
                }`}
              >
                {/* Popular Pill */}
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-brand-600 text-white text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
                    Recommended Plan
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-slate-900">
                      {plan.name}
                    </h3>
                    <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {plan.badge}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 min-h-[36px] mb-4">
                    {plan.description}
                  </p>

                  {/* Price */}
                  <div className="pb-4 border-b border-slate-100">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl font-extrabold text-slate-900 font-mono">
                        {plan.price}
                      </span>
                      <span className="text-xs text-slate-500">
                        {plan.period}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      Exclusive of GST and usage overages
                    </span>
                  </div>

                  {/* Limits summary */}
                  <div className="py-3.5 space-y-1.5 text-xs text-slate-700 border-b border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Campaigns:</span>
                      <span className="font-semibold">{plan.campaignLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Monthly Audits:</span>
                      <span className="font-semibold">{plan.auditLimit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Team Seats:</span>
                      <span className="font-semibold">{plan.userLimit}</span>
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="pt-4 space-y-2.5 text-xs text-slate-600">
                    {plan.features.map((feat, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Button */}
                <div className="mt-8 pt-4 border-t border-slate-100">
                  <a
                    href={plan.ctaUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-full inline-flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-bold transition-all shadow-xs ${
                      plan.isPopular
                        ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-600/20'
                        : 'bg-slate-900 hover:bg-slate-800 text-white'
                    }`}
                  >
                    <span>{plan.ctaText}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>

        {/* Enterprise Row Card */}
        <div className="mt-6 rounded-2xl p-6 bg-slate-900 text-white flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold text-white">Enterprise Tier</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-slate-800 text-brand-400 rounded border border-slate-700">
                Custom Volume
              </span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Custom multi-region configurations, tailored approval hierarchies, bespoke ERP integrations, dedicated security audits, and dedicated SLA support.
            </p>
          </div>

          <a
            href="https://erazero.ai/contact/?plan=enterprise"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shrink-0 transition-colors"
          >
            <span>Contact Sales for Enterprise</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Audit Definition & Exclusion Clarifications */}
        <div className="mt-8 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Definition of 1 Audit:</strong> One completed audit event for one physical media unit at one scheduled checkpoint, with multiple verification photographs attached. Re-uploading evidence for a rejected audit does not consume an extra audit credit.
            </div>
          </div>
          <div className="flex items-start gap-2.5">
            <HelpCircle className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-800">Separate Disclosed Expenses:</strong> Platform subscriptions exclude local government taxes (GST), WhatsApp delivery costs, on-ground third-party audit execution crew, and customized hardware mounts.
            </div>
          </div>
        </div>

        {/* Working Interactive Cost Calculator */}
        <div className="mt-12 bg-slate-50/70 rounded-3xl p-6 sm:p-8 border border-slate-200 max-w-4xl mx-auto text-left">
          <div className="flex items-center gap-2.5 mb-2">
            <Calculator className="w-5 h-5 text-brand-600" />
            <h3 className="text-lg font-bold text-slate-900">
              Interactive Audit Cost Estimator
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-6">
            Estimate your base monthly fee plus usage overage based on your expected physical audit volume.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Controls */}
            <div className="md:col-span-7 space-y-5">
              
              {/* Plan Picker */}
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-2">
                  Select Base Subscription Tier:
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['starter', 'growth', 'business'] as const).map((key) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setSelectedPlanKey(key)}
                      className={`p-2.5 rounded-xl text-xs font-semibold border transition-all text-center capitalize cursor-pointer ${
                        selectedPlanKey === key
                          ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {key}
                    </button>
                  ))}
                </div>
              </div>

              {/* Numeric Input + Slider for Completed Audits */}
              <div>
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 mb-2 gap-3">
                  <label htmlFor="audit-volume-number">Planned Monthly Completed Audits:</label>
                  <div className="flex items-center gap-1.5">
                    <input
                      id="audit-volume-number"
                      type="number"
                      min={0}
                      max={10000}
                      step={50}
                      value={targetAuditsInput}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        if (!Number.isNaN(val)) {
                          setTargetAuditsInput(Math.max(0, Math.min(10000, val)));
                        }
                      }}
                      className="w-24 px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-mono text-brand-600 font-bold text-sm text-right focus:outline-none focus:border-brand-500"
                    />
                    <span className="text-xs font-medium text-slate-500">audits</span>
                  </div>
                </div>
                <input
                  type="range"
                  aria-label="Planned monthly completed audits slider"
                  min={100}
                  max={5000}
                  step={50}
                  value={Math.min(5000, Math.max(100, targetAuditsInput))}
                  onChange={(e) => setTargetAuditsInput(Number(e.target.value))}
                  className="w-full accent-brand-600 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                  <span>100 audits</span>
                  <span>Plan base: {planBaseLimit.toLocaleString()} audits</span>
                  <span>5,000+ audits</span>
                </div>
              </div>

            </div>

            {/* Right Calculation Outcome Card */}
            <div className="md:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-center">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Estimated Monthly Charge
              </span>
              
              <div className="text-3xl font-extrabold text-slate-900 font-mono mt-1">
                ₹{totalEstimatedCost.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 block mt-0.5">
                + applicable taxes
              </span>

              {/* Breakdown */}
              <div className="mt-4 pt-3 border-t border-slate-100 text-xs space-y-1.5 text-left text-slate-600">
                <div className="flex justify-between">
                  <span>Base Plan Fee:</span>
                  <span className="font-semibold text-slate-800">₹{activeCalcPlan.baseFee?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Excess Audits ({excessAudits}):</span>
                  <span className="font-semibold text-slate-800">
                    ₹{excessCost.toLocaleString()}
                    <span className="text-[10px] text-slate-400 ml-1">(@₹{activeCalcPlan.overageRate}/audit)</span>
                  </span>
                </div>
              </div>

              <a
                href={activeCalcPlan.ctaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs transition-colors shadow-xs"
              >
                <span>Book a Demo for this Estimate</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
};

