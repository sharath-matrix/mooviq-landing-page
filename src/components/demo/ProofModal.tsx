import React, { useEffect } from 'react';
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Clock,
  MapPin,
  Calendar,
  FileText,
  ShieldAlert,
  Camera,
  FileSpreadsheet,
} from 'lucide-react';
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
            Verified
          </span>
        );
      case 'Flagged':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            <AlertTriangle className="w-3.5 h-3.5" />
            Flagged Exception
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            Pending Review
          </span>
        );
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="proof-modal-title"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3 text-left">
            <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-700">
              {proof.isLogBased ? (
                <FileSpreadsheet className="w-5 h-5" />
              ) : (
                <Camera className="w-5 h-5" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 id="proof-modal-title" className="text-base font-bold text-slate-900">
                  {proof.isLogBased ? 'Sample Playout Log Record' : 'Sample Media Proof Record'}
                </h3>
                <span className="text-[10px] font-semibold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
                  Fictional placeholder
                </span>
              </div>
              <p className="text-xs text-slate-500 font-mono">
                Unit ID: {proof.mediaUnitId} · Task: {proof.taskId}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Close proof modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-left subtle-scrollbar">
          {/* Status + Campaign */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200/70">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Campaign &amp; Format
              </span>
              <span className="text-sm font-bold text-slate-900">
                {proof.campaignName} · {proof.mediaType}
              </span>
            </div>
            <div>{getStatusBadge()}</div>
          </div>

          {/* Evidence Preview: Log Table for Log-Based vs Placeholder Canvas for Physical Media */}
          {proof.isLogBased ? (
            <div className="rounded-xl border border-slate-200 bg-slate-900 p-5 text-white space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-mono text-emerald-400 font-semibold">
                  PROOF-OF-PLAY LOG EXTRACT (INTEGRATION REQUIRED)
                </span>
                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded border border-slate-700 text-slate-300">
                  Sample Log Row
                </span>
              </div>
              <div className="rounded-lg bg-slate-950 border border-slate-800 p-3 font-mono text-[11px] space-y-1.5 text-slate-300">
                <div><span className="text-slate-500">screen_id:</span> {proof.mediaUnitId}</div>
                <div><span className="text-slate-500">venue_slot:</span> {proof.locationString}</div>
                <div><span className="text-slate-500">logged_at:</span> {proof.timestamp}</div>
                <div><span className="text-slate-500">reconciliation:</span> {proof.notes}</div>
              </div>
              <p className="text-[11px] text-slate-400">
                Note: Log-based formats rely on exhibitor/CMS playout reconciliation rather than a single photograph.
              </p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-6 text-white min-h-[200px] flex flex-col justify-between">
              <div className="flex items-start justify-between">
                <div className="bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                  <span className="text-xs font-mono font-medium tracking-wide">
                    {proof.mediaType} · {proof.mediaUnitId}
                  </span>
                </div>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded bg-white/15 text-slate-200 border border-white/10">
                  Illustrative Placeholder
                </span>
              </div>

              <div className="py-5 flex flex-col items-center justify-center text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-brand-400 mb-3">
                  <Camera className="w-7 h-7" />
                </div>
                <p className="text-sm font-semibold text-slate-200">{proof.evidenceType}</p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Fictional sample visual placeholder · Aspect {proof.aspectRatio}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 border-t border-white/10 pt-3">
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
          )}

          {/* Notes & Reviewer Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                <FileText className="w-3.5 h-3.5 text-slate-500" />
                <span>Submission Observation</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{proof.notes}</p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 mb-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
                <span>Reviewer Notes</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">{proof.reviewerNotes}</p>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-2.5 text-xs text-amber-800">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Interactive sample data — not live client records.</span>{' '}
              This preview displays local demonstration entries without connecting to real cameras or private campaigns.
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 border-t border-slate-100 bg-slate-50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
