export interface DashboardPackage {
  id: 'single-user' | 'team' | 'agency' | 'enterprise-team' | 'custom-enterprise';
  name: string;
  monthlyPriceInr: number | null; // null => Custom quote
  priceLabel: string;
  userLimitLabel: string;
  maxUsers: number | null;
  badge: string;
  description: string;
  highlights: string[];
  recommended?: boolean;
}

export interface ApprovedMediaRate {
  mediaId: string;
  unitPriceInr: number;
  serviceUnit: string; // e.g., "per unit audit checkpoint"
  taxNote: string;
  effectiveDate: string;
}

export const DASHBOARD_ACCESS_PACKAGES: DashboardPackage[] = [
  {
    id: 'single-user',
    name: 'Single User',
    monthlyPriceInr: 2299,
    priceLabel: '₹2,299',
    userLimitLabel: '1 dashboard user',
    maxUsers: 1,
    badge: 'Individual',
    description: 'For independent audit leads or single-brand campaign managers.',
    highlights: [
      '1 named dashboard user seat',
      'Multi-media campaign & unit tracking',
      'Media proof gallery & review queue',
      'Exportable sample-format CSV reports',
    ],
  },
  {
    id: 'team',
    name: 'Team',
    monthlyPriceInr: 6499,
    priceLabel: '₹6,499',
    userLimitLabel: 'Up to 3 dashboard users',
    maxUsers: 3,
    badge: 'Small Team',
    description: 'For brand marketing teams coordinating audits with internal ops.',
    highlights: [
      'Up to 3 dashboard user seats',
      'Shared campaign status & issue queues',
      'Multi-city & media-family filtering',
      'Structured exception documentation',
    ],
  },
  {
    id: 'agency',
    name: 'Agency',
    monthlyPriceInr: 9999,
    priceLabel: '₹9,999',
    userLimitLabel: 'Up to 5 dashboard users',
    maxUsers: 5,
    badge: 'Recommended',
    recommended: true,
    description: 'For media agencies and OOH/transit execution teams managing client campaigns.',
    highlights: [
      'Up to 5 dashboard user seats',
      'Cross-client campaign workspace views',
      'Format-adapted audit report exports',
      'Configurable checklist review workflows',
    ],
  },
  {
    id: 'enterprise-team',
    name: 'Enterprise Team',
    monthlyPriceInr: 18999,
    priceLabel: '₹18,999',
    userLimitLabel: 'Up to 10 dashboard users',
    maxUsers: 10,
    badge: 'Multi-Team',
    description: 'For regional brands, media networks, and multi-agency operations.',
    highlights: [
      'Up to 10 dashboard user seats',
      'Multi-region & multi-agency rollups',
      'Structured proof & log reconciliation views',
      'Dedicated onboarding coordination',
    ],
  },
  {
    id: 'custom-enterprise',
    name: 'Custom Enterprise',
    monthlyPriceInr: null,
    priceLabel: 'Custom',
    userLimitLabel: '10+ users · SSO & integrations',
    maxUsers: null,
    badge: 'Tailored',
    description: 'For large teams requiring SSO, custom log integrations, or bespoke retention.',
    highlights: [
      'Custom user tiers & approval roles',
      'SSO & enterprise security review (planned/scoped)',
      'Custom telematics, DOOH CMS & playback log feeds',
      'Dedicated implementation scoping',
    ],
  },
];

/**
 * Approved per-media service rate configuration.
 * Left empty intentionally: Mooviq does not publish unapproved per-media tariffs
 * or fabricate flat rates across OOH, transit, digital, and broadcast formats.
 * When approved per-media tariffs are added here, QuoteBuilder calculates exact
 * partial subtotals for priced items while keeping unpriced items flagged as
 * "Custom quote required".
 */
export const APPROVED_PER_MEDIA_RATES: Record<string, ApprovedMediaRate | undefined> = {};

export const AUDIT_PRICING_FACTORS = [
  {
    title: 'Media Type & Evidence Model',
    detail: 'Static hoardings, vehicle panels, digital screens, and broadcast log reconciliations require different effort.',
  },
  {
    title: 'Asset Volume & Audit Rounds',
    detail: 'Total media units audited and number of scheduled checkpoints (one-time, weekly, or monthly).',
  },
  {
    title: 'Cities & Route Density',
    detail: 'Single-metro clusters vs multi-city rollouts, highway stretches, or dispersed rural wall paintings.',
  },
  {
    title: 'Location Accessibility',
    detail: 'Open-street sites vs restricted corporate parks, gated residential societies, malls, or airport terminals.',
  },
  {
    title: 'Onsite Visits vs Remote Log Checks',
    detail: 'Physical ground inspection dispatch vs ingesting and reconciling proof-of-play or broadcast logs.',
  },
  {
    title: 'Turnaround & Custom Analytics',
    detail: 'Standard reporting cadences vs rapid SLA turnarounds or custom reconciliation dashboards.',
  },
];

export const PRICING_POLICY_NOTES = {
  taxDisclaimer: 'All dashboard access prices are in INR, per month, before GST.',
  separationNote:
    'Dashboard subscriptions cover workspace software access only. Field-auditing execution, log ingestion integrations, and custom analytics are quoted and billed separately based on your media plan.',
  approvalStatus: 'Proposed launch structure; final commercial terms confirmed during onboarding.',
};
