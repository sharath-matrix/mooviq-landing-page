import React, { useState, useMemo, useEffect } from 'react';
import {
  Camera,
  FileSpreadsheet,
  MapPin,
  Calendar,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { MediaProof, Campaign } from '../../types/mooviq';
import { MEDIA_FAMILIES, MediaFamilyId } from '../../config/mediaAuditCatalog';

interface ProofsTabProps {
  proofs: MediaProof[];
  campaigns: Campaign[];
  initialCampaignId?: string;
  initialFamilyFilter?: 'All' | MediaFamilyId;
  onOpenProofModal: (proof: MediaProof) => void;
}

export const ProofsTab: React.FC<ProofsTabProps> = ({
  proofs,
  campaigns,
  initialCampaignId = 'All',
  initialFamilyFilter = 'All',
  onOpenProofModal,
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCampaignId, setSelectedCampaignId] = useState<string>(initialCampaignId);
  const [selectedFamily, setSelectedFamily] = useState<'All' | MediaFamilyId>(initialFamilyFilter);

  useEffect(() => {
    setSelectedCampaignId(initialCampaignId || 'All');
  }, [initialCampaignId]);

  useEffect(() => {
    setSelectedFamily(initialFamilyFilter || 'All');
  }, [initialFamilyFilter]);

  const filteredProofs = useMemo(() => {
    return proofs.filter((p) => {
      const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;
      const matchesCampaign = selectedCampaignId === 'All' || p.campaignId === selectedCampaignId;
      const matchesFamily = selectedFamily === 'All' || p.mediaFamilyId === selectedFamily;
      return matchesStatus && matchesCampaign && matchesFamily;
    });
  }, [proofs, selectedStatus, selectedCampaignId, selectedFamily]);

  return (
    <div className="space-y-6 text-left">
      {/* Filter Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">
                Media Proofs &amp; Playout Gallery
              </h3>
              <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                Fictional sample evidence
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Media-unit IDs, checkpoint timestamps, condition observations, and reviewer notes
            </p>
          </div>

          <span className="text-xs text-slate-500 font-medium">
            Showing <strong className="text-slate-800">{filteredProofs.length}</strong> entries
          </span>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2.5 pt-2 border-t border-slate-100">
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

          <select
            aria-label="Filter media proofs by family"
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value as 'All' | MediaFamilyId)}
            className="px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
          >
            <option value="All">All media families</option>
            {MEDIA_FAMILIES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>

          <div className="flex-1 min-w-[180px]">
            <select
              aria-label="Filter media proofs by campaign"
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="w-full px-3 py-1.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
            >
              <option value="All">All sample campaigns</option>
              {campaigns.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} ({c.mediaType})
                </option>
              ))}
            </select>
          </div>

          {(selectedStatus !== 'All' || selectedCampaignId !== 'All' || selectedFamily !== 'All') && (
            <button
              type="button"
              onClick={() => {
                setSelectedStatus('All');
                setSelectedCampaignId('All');
                setSelectedFamily('All');
              }}
              className="px-2.5 py-1.5 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Proof Cards */}
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
                aria-label={`Inspect proof ${proof.mediaUnitId} for ${proof.campaignName}`}
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
                  <div className="h-36 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 p-3.5 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex items-center justify-between gap-2 z-10">
                      <span className="text-[10px] font-mono uppercase tracking-wider bg-black/50 text-white/90 px-2 py-0.5 rounded border border-white/10 truncate">
                        {proof.mediaType}
                      </span>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ${
                          isVerified
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40'
                            : isFlagged
                            ? 'bg-rose-500/20 text-rose-300 border-rose-400/40'
                            : 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                        }`}
                      >
                        {proof.status}
                      </span>
                    </div>

                    <div className="flex flex-col items-center justify-center my-auto z-10 text-white/50 group-hover:text-white/80 transition-colors">
                      {proof.isLogBased ? (
                        <>
                          <FileSpreadsheet className="w-7 h-7" />
                          <span className="text-[9px] font-mono mt-1 uppercase tracking-wider text-slate-300">
                            Playout Log Extract
                          </span>
                        </>
                      ) : (
                        <>
                          <Camera className="w-7 h-7" />
                          <span className="text-[9px] font-mono mt-1 uppercase tracking-wider text-slate-400">
                            Sample Placeholder
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-white/70 font-mono z-10 border-t border-white/10 pt-2">
                      <span className="truncate">{proof.mediaUnitId}</span>
                      <span>{proof.city}</span>
                    </div>
                  </div>

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
                      {proof.reviewerNotes}
                    </p>
                  </div>
                </div>

                <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-[10px] font-mono text-slate-400">{proof.taskId}</span>
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
          <p className="text-sm font-semibold text-slate-700">No sample proofs match current filters</p>
          <button
            type="button"
            onClick={() => {
              setSelectedStatus('All');
              setSelectedCampaignId('All');
              setSelectedFamily('All');
            }}
            className="mt-3 px-3.5 py-1.5 text-xs font-semibold bg-slate-900 text-white rounded-lg cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
