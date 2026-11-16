import React from 'react';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { trackMooviqEvent } from '../lib/analytics';

interface ZeroOnboardingBannerProps {
  onCreateAuditPlanClick: () => void;
}

export const ZeroOnboardingBanner: React.FC<ZeroOnboardingBannerProps> = ({
  onCreateAuditPlanClick,
}) => {
  return (
    <section className="py-8 bg-slate-50 border-t border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white p-7 sm:p-10 shadow-lg border border-slate-800">
          {/* Subtle background glow */}
          <div
            className="absolute -right-20 -top-20 w-80 h-80 bg-brand-600/20 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="absolute -left-20 -bottom-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            {/* Left Content */}
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-bold tracking-wide uppercase">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Standard Onboarding Benefit</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Get Started with ₹0 Standard Onboarding Charges
              </h2>

              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                Start organizing campaigns and media audits without a standard platform setup fee.
              </p>

              {/* Three supporting bullets */}
              <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-200">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No standard onboarding fee</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Flexible media auditing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Centralized campaign visibility</span>
                </div>
              </div>

              <p className="text-[11px] text-slate-400 pt-1 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  Standard onboarding is free. Custom API integrations, bespoke development, data migration,
                  or specialized team training are scoped and quoted separately.
                </span>
              </p>
            </div>

            {/* Right Action */}
            <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  trackMooviqEvent('cta_click', { location: 'zero_onboarding_strip', action: 'create_audit_plan' });
                  onCreateAuditPlanClick();
                }}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md hover:shadow-lg cursor-pointer"
              >
                <span>Create Your Audit Plan</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
