import React, { useState, useMemo, useEffect } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Download,
} from 'lucide-react';
import { Campaign } from '../../types/mooviq';
import { MEDIA_FAMILIES, MediaFamilyId } from '../../config/mediaAuditCatalog';

interface CampaignsTabProps {
  campaigns: Campaign[];
  initialSearchQuery?: string;
  initialFamilyFilter?: 'All' | MediaFamilyId;
  onSelectCampaign: (campaign: Campaign) => void;
  onExportCsv: (rows: Campaign[]) => void;
}

export const CampaignsTab: React.FC<CampaignsTabProps> = ({
  campaigns,
  initialSearchQuery = '',
  initialFamilyFilter = 'All',
  onSelectCampaign,
  onExportCsv,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [familyFilter, setFamilyFilter] = useState<'All' | MediaFamilyId>(initialFamilyFilter);
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [cityFilter, setCityFilter] = useState<string>('All');
  const [mediaFilter, setMediaFilter] = useState<string>('All');
  const [agencyFilter, setAgencyFilter] = useState<string>('All');

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  useEffect(() => {
    setFamilyFilter(initialFamilyFilter);
  }, [initialFamilyFilter]);

  const cities = useMemo(() => ['All', ...Array.from(new Set(campaigns.map((c) => c.city)))], [campaigns]);
  const mediaTypes = useMemo(() => ['All', ...Array.from(new Set(campaigns.map((c) => c.mediaType)))], [campaigns]);
  const agencies = useMemo(() => ['All', ...Array.from(new Set(campaigns.map((c) => c.agency)))], [campaigns]);

  const filteredCampaigns = useMemo(() => {
    return campaigns.filter((c) => {
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.mediaType.toLowerCase().includes(q) ||
        c.agency.toLowerCase().includes(q);

      const matchesFamily = familyFilter === 'All' || c.mediaFamilyId === familyFilter;
      const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchesCity = cityFilter === 'All' || c.city === cityFilter;
      const matchesMedia = mediaFilter === 'All' || c.mediaType === mediaFilter;
      const matchesAgency = agencyFilter === 'All' || c.agency === agencyFilter;

      return (
        matchesSearch &&
        matchesFamily &&
        matchesStatus &&
        matchesCity &&
        matchesMedia &&
        matchesAgency
      );
    });
  }, [campaigns, searchQuery, familyFilter, statusFilter, cityFilter, mediaFilter, agencyFilter]);

  const hasActiveFilters =
    searchQuery !== '' ||
    familyFilter !== 'All' ||
    statusFilter !== 'All' ||
    cityFilter !== 'All' ||
    mediaFilter !== 'All' ||
    agencyFilter !== 'All';

  const handleResetFilters = () => {
    setSearchQuery('');
    setFamilyFilter('All');
    setStatusFilter('All');
    setCityFilter('All');
    setMediaFilter('All');
    setAgencyFilter('All');
  };

  return (
    <div className="space-y-6 text-left">
      {/* Filter Toolbar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Multi-Media Sample Campaigns
            </h3>
            <p className="text-xs text-slate-500">
              Filter across media families, formats, cities, and audit statuses
            </p>
          </div>

          <button
            type="button"
            onClick={() => onExportCsv(filteredCampaigns)}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Export Sample CSV ({filteredCampaigns.length})</span>
          </button>
        </div>

        {/* Filter Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 border-t border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              aria-label="Search campaigns, brands, cities, or media formats"
              placeholder="Search campaigns, brands, cities..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:border-brand-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          <select
            aria-label="Filter by media family"
            value={familyFilter}
            onChange={(e) => setFamilyFilter(e.target.value as 'All' | MediaFamilyId)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
          >
            <option value="All">All media families</option>
            {MEDIA_FAMILIES.map((f) => (
              <option key={f.id} value={f.id}>
                {f.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by specific media format"
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
          >
            {mediaTypes.map((media) => (
              <option key={media} value={media}>
                {media === 'All' ? 'All media formats' : media}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by city"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
          >
            {cities.map((city) => (
              <option key={city} value={city}>
                {city === 'All' ? 'All cities' : city}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by audit status"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
          >
            <option value="All">All status (Any)</option>
            <option value="Ongoing">Ongoing</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            aria-label="Filter by partner agency"
            value={agencyFilter}
            onChange={(e) => setAgencyFilter(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
          >
            {agencies.map((agency) => (
              <option key={agency} value={agency}>
                {agency === 'All' ? 'All agencies' : agency}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
          <span>
            Showing <strong className="text-slate-800">{filteredCampaigns.length}</strong> of {campaigns.length} sample campaigns
          </span>
          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="text-brand-600 hover:text-brand-700 font-semibold flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Clear filters</span>
            </button>
          )}
        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredCampaigns.map((campaign) => {
            const familyLabel = MEDIA_FAMILIES.find((f) => f.id === campaign.mediaFamilyId)?.shortLabel;

            return (
              <div
                key={campaign.id}
                className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-slate-900 text-white font-bold text-xs flex items-center justify-center shrink-0">
                        {campaign.brand.substring(0, 2).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-sm font-bold text-slate-900 truncate">
                          {campaign.name}
                        </h4>
                        <p className="text-xs text-slate-500 truncate">
                          {campaign.brand} · {campaign.agency}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full shrink-0 ${
                        campaign.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {campaign.status}
                    </span>
                  </div>

                  {/* Metadata */}
                  <div className="grid grid-cols-3 gap-2 py-3 mt-3 border-y border-slate-100 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Family</span>
                      <span className="font-semibold text-slate-800 truncate block">{familyLabel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">Format</span>
                      <span className="font-semibold text-slate-800 truncate block">{campaign.mediaType}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block font-medium">City</span>
                      <span className="font-semibold text-slate-800 truncate block">{campaign.city}</span>
                    </div>
                  </div>

                  {/* Progress & Counts */}
                  <div className="mt-3.5">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-slate-500">
                        Submitted: <strong className="text-slate-800">{campaign.submittedUnits}</strong> / {campaign.targetUnits}
                      </span>
                      <span className="font-bold text-slate-900">{campaign.completionRate}%</span>
                    </div>

                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden flex">
                      <div
                        className={`h-full rounded-full transition-all ${
                          campaign.status === 'Completed' ? 'bg-emerald-600' : 'bg-brand-600'
                        }`}
                        style={{ width: `${campaign.completionRate}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[11px] mt-2 text-slate-500">
                      <span className="text-emerald-700 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        {campaign.verifiedUnits} verified · {campaign.pendingUnits} pending
                      </span>
                      {campaign.flaggedUnits > 0 ? (
                        <span className="text-rose-600 font-medium flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-500" />
                          {campaign.flaggedUnits} flagged
                        </span>
                      ) : (
                        <span className="text-slate-400">No flags</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 truncate max-w-[200px]">
                    {campaign.workflowStatus}
                  </span>

                  <button
                    type="button"
                    onClick={() => onSelectCampaign(campaign)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100/70 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View details</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
            <Filter className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-slate-800">No matching sample campaigns</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Adjust your media family, city, or search filters to view matching campaigns.
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
  );
};
