import React, { useState, useMemo, useEffect } from 'react';
import { 
  Camera, 
  MapPin, 
  Calendar, 
  RotateCcw,
  Eye
} from 'lucide-react';
import { MediaProof, Campaign } from '../../types/mooviq';

interface ProofsTabProps {
  proofs: MediaProof[];
  campaigns: Campaign[];
  initialCampaignId?: string;
  onOpenProofModal: (proof: MediaProof) => void;
}

export const ProofsTab: React.FC<ProofsTabProps> = ({
  proofs,
  campaigns,
  initialCampaignId,
  onOpenProofModal,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(initialCampaignId || 'All');

  useEffect(() => {
    setSelectedCampaignId(initialCampaignId || 'All');
  }, [initialCampaignId]);

  const filteredProofs = useMemo(() => {
    return proofs.filter((p) => {
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      const matchesCampaign = selectedCampaignId === 'All' || p.campaignId === selectedCampaignId;
      return matchesStatus && matchesCampaign;
    });
  }, [proofs, selectedStatus, selectedCampaignId]);

  return (
    <div className="space-y-6 text-left">
      
      {/* Proof Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Media Proofs Repository
              </h3>
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                Sample evidence
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Photographic evidence, location strings, and timestamp verification records
            </p>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredProofs.length}</strong> proofs
          </span>
        </div>

        {/* Filter Selectors */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
          {/* Status Buttons */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/60">
            {['All', 'Verified', 'Pending', 'Flagged'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setSelectedStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  selectedStatus === status
                    ? 'bg-white text-slate-900 shadow-xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Campaign Selector */}
          <div className="flex-1 min-w-[200px]">
            <select
              aria-label="Filter media proofs by campaign"
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 text-slate-900"
            >
              <option value="All">All campaigns</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.city})
                </option>
              ))}
            </select>
          </div>

          {(selectedStatus !== 'All' || selectedCampaignId !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSelectedStatus('All');
                setSelectedCampaignId('All');
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Proof Cards Grid */}
      {filteredProofs.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProofs.map((proof) => {
            const isVerified = proof.status === 'Verified';
            const isFlagged = proof.status === 'Flagged';

            return (
              <div
                key={proof.id}
                role="button"
                tabIndex={0}
                aria-label={`Inspect media proof ${proof.taskId} for ${proof.campaignName}`}
                onClick={() => onOpenProofModal(proof)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onOpenProofModal(proof);
                  }
                }}
                className="group rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between cursor-pointer"
              >
                <div>
                  {/* Top Illustrative Placeholder Image Graphic */}
                  <div className="h-36 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-3.5 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between z-10">
                      <span className="text-[10px] font-mono uppercase tracking-wider bg-black/50 backdrop-blur-xs text-white/90 px-2 py-0.5 rounded border border-white/10">
                        {proof.mediaType}
                      </span>
                      
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border backdrop-blur-xs ${
                        isVerified ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40' :
                        isFlagged ? 'bg-rose-500/20 text-rose-300 border-rose-400/40' :
                        'bg-amber-500/20 text-amber-300 border-amber-400/40'
                      }`}>
                        {proof.status}
                      </span>
                    </div>

                    {/* Center Icon Graphic */}
                    <div className="flex items-center justify-center my-auto z-10 text-white/40 group-hover:text-white/70 group-hover:scale-105 transition-all">
                      <Camera className="w-8 h-8" />
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-white/60 font-mono z-10 border-t border-white/10 pt-2">
                      <span>{proof.taskId}</span>
                      <span>{proof.city}</span>
                    </div>
                  </div>

                  {/* Card Content Info */}
                  <div className="p-4 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 truncate block">
                      {proof.campaignName}
                    </span>

                    <div className="flex items-start gap-1.5 text-xs text-slate-800 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-brand-600 shrink-0 mt-0.5" />
                      <span className="truncate">{proof.locationString}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-mono">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      <span>{proof.timestamp}</span>
                    </div>

                    <p className="text-xs text-slate-600 line-clamp-2 mt-2 pt-2 border-t border-slate-100">
                      {proof.notes}
                    </p>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] text-slate-400">
                    Click to inspect full audit
                  </span>
                  <span className="text-brand-600 font-semibold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    <span>Inspect</span>
                    <Eye className="w-3 h-3" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200">
          <p className="text-sm font-semibold text-slate-700">No media proofs match current filters</p>
          <button
            type="button"
            onClick={() => {
              setSelectedStatus('All');
              setSelectedCampaignId('All');
            }}
            className="mt-3 px-3 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg"
          >
            Reset Filters
          </button>
        </div>
      )}

    </div>
  );
};

