import React, { useEffect } from 'react';
import {
  X,
  MapPin,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react';
import { Campaign, MediaProof, FraudAlert } from '../../types/mooviq';
import { MEDIA_FAMILIES } from '../../config/mediaAuditCatalog';

interface CampaignDrawerProps {
  campaign: Campaign | null;
  proofs: MediaProof[];
  alerts: FraudAlert[];
  onClose: () => void;
  onNavigateToProofs: (campaignId: string) => void;
  onNavigateToAlerts: (campaignId: string) => void;
  onOpenProofModal: (proof: MediaProof) => void;
}

export const CampaignDrawer: React.FC<CampaignDrawerProps> = ({
  campaign,
  proofs,
  alerts,
  onClose,
  onNavigateToProofs,
  onNavigateToAlerts,
  onOpenProofModal,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (campaign) {
      window.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [campaign, onClose]);

  if (!campaign) return null;

  const campaignProofs = proofs.filter((p) => p.campaignId === campaign.id);
  const campaignAlerts = alerts.filter((a) => a.campaignId === campaign.id);
  const familyLabel = MEDIA_FAMILIES.find((f) => f.id === campaign.mediaFamilyId)?.label || '';

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs animate-in fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="campaign-drawer-title"
    >
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right border-l border-slate-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/90 text-left">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                  campaign.status === 'Completed'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-amber-50 text-amber-700 border border-amber-200'
                }`}
              >
                {campaign.status}
              </span>
              <span className="text-[10px] font-semibold bg-slate-200/80 text-slate-700 px-2 py-0.5 rounded">
                Interactive sample data
              </span>
            </div>
            <h3 id="campaign-drawer-title" className="text-lg font-bold text-slate-900 mt-1">
              {campaign.name}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Fictional Brand: {campaign.brand} · Partner: {campaign.agency}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            aria-label="Close campaign details"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-left subtle-scrollbar">
          {/* Progress Breakdown */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-semibold text-slate-700">Audit Completion Progress</span>
              <span className="font-bold text-slate-900 text-sm">{campaign.completionRate}%</span>
            </div>

            <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden flex">
              <div
                className="bg-emerald-600 h-full transition-all"
                style={{ width: `${(campaign.verifiedUnits / campaign.targetUnits) * 100}%` }}
                title={`Verified: ${campaign.verifiedUnits} units`}
              />
              <div
                className="bg-rose-500 h-full transition-all"
                style={{ width: `${(campaign.flaggedUnits / campaign.targetUnits) * 100}%` }}
                title={`Flagged: ${campaign.flaggedUnits} units`}
              />
              <div
                className="bg-amber-400 h-full transition-all"
                style={{ width: `${(campaign.pendingUnits / campaign.targetUnits) * 100}%` }}
                title={`Pending: ${campaign.pendingUnits} units`}
              />
            </div>

            <div className="grid grid-cols-5 gap-2 mt-4 pt-3 border-t border-slate-200/70 text-center">
              <div className="p-1.5 rounded-lg bg-white border border-slate-100">
                <span className="text-[10px] text-slate-400 block font-medium">Expected</span>
                <span className="text-xs font-bold text-slate-800">{campaign.targetUnits}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-slate-100">
                <span className="text-[10px] text-slate-500 block font-medium">Submitted</span>
                <span className="text-xs font-bold text-slate-900">{campaign.submittedUnits}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-emerald-100">
                <span className="text-[10px] text-emerald-600 block font-medium">Verified</span>
                <span className="text-xs font-bold text-emerald-700">{campaign.verifiedUnits}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-rose-100">
                <span className="text-[10px] text-rose-600 block font-medium">Flagged</span>
                <span className="text-xs font-bold text-rose-700">{campaign.flaggedUnits}</span>
              </div>
              <div className="p-1.5 rounded-lg bg-white border border-amber-100">
                <span className="text-[10px] text-amber-600 block font-medium">Pending</span>
                <span className="text-xs font-bold text-amber-700">{campaign.pendingUnits}</span>
              </div>
            </div>
          </div>

          {/* Metadata Attributes */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-medium block">Media Family &amp; Format</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {campaign.mediaType}
              </span>
              <span className="text-[10px] text-slate-500">{familyLabel}</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-medium block">Verification Method</span>
              <span className="font-semibold text-slate-800 mt-0.5 block">
                {campaign.workflowStatus}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-medium block">City Cluster</span>
              <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-brand-600" />
                {campaign.city}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80">
              <span className="text-slate-400 font-medium block">Audit Window</span>
              <span className="font-semibold text-slate-800 mt-0.5 flex items-center gap-1 font-mono text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {campaign.startDate} – {campaign.endDate}
              </span>
            </div>
          </div>

          {/* Description & Scope */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Audit Scope
            </h4>
            <p className="text-xs text-slate-600 leading-relaxed p-3.5 rounded-xl bg-slate-50 border border-slate-200">
              {campaign.description}
            </p>
          </div>

          {/* Connected Media Proofs Preview */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sample Evidence ({campaignProofs.length})
              </h4>
              <button
                type="button"
                onClick={() => {
                  onNavigateToProofs(campaign.id);
                  onClose();
                }}
                className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Open in Media Proofs</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {campaignProofs.length > 0 ? (
              <div className="space-y-2">
                {campaignProofs.slice(0, 3).map((proof) => (
                  <div
                    key={proof.id}
                    onClick={() => onOpenProofModal(proof)}
                    className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-800 font-mono">
                          {proof.mediaUnitId}
                        </span>
                        <span
                          className={`text-[10px] font-semibold px-2 py-0.2 rounded ${
                            proof.status === 'Verified'
                              ? 'bg-emerald-50 text-emerald-700'
                              : proof.status === 'Flagged'
                              ? 'bg-rose-50 text-rose-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {proof.status}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 truncate block max-w-xs mt-0.5">
                        {proof.locationString}
                      </span>
                    </div>
                    <span className="text-[11px] font-semibold text-brand-600">Inspect &rarr;</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">
                No sample proofs attached to this campaign in the preview set.
              </p>
            )}
          </div>

          {/* Exceptions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Sample Exceptions ({campaignAlerts.length})
              </h4>
              <button
                type="button"
                onClick={() => {
                  onNavigateToAlerts(campaign.id);
                  onClose();
                }}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
              >
                <span>Open in Exceptions</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {campaignAlerts.length > 0 ? (
              <div className="space-y-2">
                {campaignAlerts.map((alt) => (
                  <div
                    key={alt.id}
                    className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 flex items-start gap-2.5 text-xs text-rose-900"
                  >
                    <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{alt.alertType}</span>
                      <p className="text-[11px] text-rose-700 mt-0.5">{alt.detailNotes}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-700 bg-emerald-50/70 border border-emerald-200 p-3 rounded-xl flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Zero open sample exceptions for this campaign.
              </p>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-[11px] text-slate-400">
            Interactive sample data — not live client records
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
