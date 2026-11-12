import React, { useEffect } from 'react';
import { X, CheckCircle2, AlertTriangle, Clock, MapPin, Calendar, FileText, ShieldAlert, Camera } from 'lucide-react';
import { MediaProof } from '../../types/mooviq';

interface ProofModalProps {
  proof: MediaProof | null;
  onClose: () => void;
}

export const ProofModal: React.FC<ProofModalProps> = ({ proof, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (proof) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [proof, onClose]);

  if (!proof) return null;

  const getStatusBadge = () => {
    switch (proof.status) {
      case 'Verified':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Verified Submission
          </span>
        );
      case 'Flagged':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            Flagged for Exception Review
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending Verification
          </span>
        );
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proof-modal-title"
    >
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="proof-modal-title" className="text-base font-bold text-slate-900">
                  Media Proof Details
                </h3>
                <span className="text-[10px] font-semibold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
                  Sample evidence
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Task ID: {proof.taskId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-left subtle-scrollbar">
          
          {/* Status and Campaign summary */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Associated Campaign
              </span>
              <span className="text-sm font-bold text-slate-900">
                {proof.campaignName}
              </span>
            </div>
            <div>{getStatusBadge()}</div>
          </div>

          {/* Illustrative Media Canvas */}
          <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-white min-h-[220px] flex flex-col justify-between">
            <div className="flex items-start justify-between">
              <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-mono font-medium tracking-wide">
                  {proof.mediaType} · {proof.city}
                </span>
              </div>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/15 text-slate-200 border border-white/10">
                Visual Inspection Preview
              </span>
            </div>

            {/* Simulated Geometric Audit Vector Graphic */}
            <div className="py-6 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-brand-400 mb-3 shadow-inner">
                <Camera className="w-8 h-8" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                {proof.evidenceType}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Simulated field capture snapshot · Ratio {proof.aspectRatio}
              </p>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 border-t border-white/10 pt-3">
              <span className="flex items-center gap-1 font-mono">
                <MapPin className="w-3.5 h-3.5 text-brand-400" />
                {proof.locationString}
              </span>
              <span className="flex items-center gap-1 font-mono">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {proof.timestamp}
              </span>
            </div>
          </div>

          {/* Audit Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-medium block">Verification Location</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {proof.locationString}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                City: {proof.city} (Geofenced cluster)
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-medium block">Submission Timestamp</span>
              <span className="font-semibold text-slate-800 mt-0.5 block font-mono">
                {proof.timestamp}
              </span>
              <span className="text-[10px] text-slate-400 mt-1 block">
                Auditor device sync validated
              </span>
            </div>
          </div>

          {/* Auditor Field Notes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Auditor Notes & Quality Check</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {proof.notes}
            </p>
          </div>

          {/* Disclaimer Banner */}
          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Interactive demo note:</span> This sample evidence modal displays local mock data for evaluation purposes. No connection to live campaign feeds or real customer media files is implied.
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors"
          >
            Close Details
          </button>
        </div>

      </div>
    </div>
  );
};

