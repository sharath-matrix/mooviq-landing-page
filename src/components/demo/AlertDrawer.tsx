import React, { useEffect } from 'react';
import { X, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight, UserCheck, HelpCircle } from 'lucide-react';
import { FraudAlert } from '../../types/mooviq';

interface AlertDrawerProps {
  alert: FraudAlert | null;
  onClose: () => void;
  onResolve?: (id: string) => void;
}

export const AlertDrawer: React.FC<AlertDrawerProps> = ({ alert, onClose, onResolve }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (alert) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [alert, onClose]);

  if (!alert) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="alert-drawer-title"
    >
      {/* Backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Drawer Container */}
      <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200 border-l border-slate-200">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              alert.riskLevel === 'Needs review' 
                ? 'bg-rose-100 text-rose-700' 
                : 'bg-emerald-100 text-emerald-700'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="alert-drawer-title" className="text-base font-bold text-slate-900">
                  Exception Review
                </h3>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  alert.riskLevel === 'Needs review'
                    ? 'bg-rose-50 text-rose-700 border border-rose-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {alert.riskLevel}
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                Task Ref: {alert.taskId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left subtle-scrollbar">
          
          {/* Important Human Verification Notice */}
          <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 text-amber-900 text-xs flex items-start gap-3">
            <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block mb-0.5">
                Illustrative alert; human verification required.
              </span>
              Mooviq surfaces potential anomalies for operational review. Automated indicators flag items for double-checking, but human auditors make all final verification determinations.
            </div>
          </div>

          {/* Exception Details Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Flag Category
              </span>
              <span className="text-base font-bold text-slate-900">
                {alert.alertType}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200/80 text-xs">
              <div>
                <span className="text-slate-500 block">Campaign:</span>
                <span className="font-semibold text-slate-800">{alert.campaignName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Agency Partner:</span>
                <span className="font-semibold text-slate-800">{alert.agency}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Media & City:</span>
                <span className="font-semibold text-slate-800">{alert.mediaType} · {alert.city}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Flagged:</span>
                <span className="font-semibold text-slate-800">{alert.timestamp}</span>
              </div>
            </div>
          </div>

          {/* Anomaly Technical Findings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Anomaly Finding Summary
            </h4>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
              {alert.detailNotes}
            </div>
          </div>

          {/* Recommended Investigation Steps */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Recommended Protocol Steps
            </h4>
            <div className="space-y-2">
              {alert.suggestedSteps.map((step, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-50 border border-slate-200/70 text-xs text-slate-800"
                >
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Trail Note */}
          <div className="p-4 rounded-xl bg-slate-900 text-white text-xs space-y-2">
            <div className="flex items-center gap-2 font-semibold text-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Mooviq Audit Trail Integrity</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Every status change, re-upload request, and resolution note is permanently logged to ensure transparent accountability between brands and field agencies.
            </p>
          </div>

        </div>

        {/* Drawer Footer Actions */}
        <div className="p-5 border-t border-slate-100 bg-slate-50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-200/70 transition-colors"
          >
            Close Review
          </button>

          {alert.riskLevel === 'Needs review' ? (
            <button
              type="button"
              onClick={() => {
                if (onResolve) onResolve(alert.id);
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-colors cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Mark Exception Resolved</span>
            </button>
          ) : (
            <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Verified & Documented
            </span>
          )}
        </div>

      </div>
    </div>
  );
};

