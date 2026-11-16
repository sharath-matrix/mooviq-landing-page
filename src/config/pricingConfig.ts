/**
 * Mooviq Pricing & Rate Card Configuration
 *
 * Commercial Model:
 * - Prepaid Credit Wallet + Monthly Dashboard Access Subscription.
 * - Nominal Credit Value: 1 Mooviq Credit = ₹4.
 * - Standard Onboarding: ₹0 (Free standard onboarding included).
 * - All listed prices exclude applicable GST and are proposed/indicative.
 */

export const NOMINAL_CREDIT_VALUE_INR = 4;

export const DASHBOARD_FEE_PER_USER_MONTHLY_INR = 1999;

export interface CreditWalletPackage {
  id: 'starter' | 'growth' | 'enterprise';
  name: string;
  priceInr: number;
  credits: number;
  nominalValueInr: number;
  tagline: string;
  description: string;
  recommended?: boolean;
  features: string[];
  ctaLabel: string;
}

export const CREDIT_WALLET_PACKAGES: CreditWalletPackage[] = [
  {
    id: 'starter',
    name: 'STARTER WALLET',
    priceInr: 19999,
    credits: 5000,
    nominalValueInr: 20000,
    tagline: '5,000 Credits · ₹19,999',
    description: 'Suitable for smaller advertising agencies and businesses exploring media auditing.',
    recommended: false,
    features: [
      'Prepaid audit credit wallet',
      'Multi-media campaign tracking',
      'Media audit evidence management',
      'Campaign progress monitoring',
      'Standard audit reports',
      'Access to the interactive dashboard with separately billed user licences',
      'Standard onboarding included',
    ],
    ctaLabel: 'Get Started',
  },
  {
    id: 'growth',
    name: 'GROWTH WALLET',
    priceInr: 79999,
    credits: 20000,
    nominalValueInr: 80000,
    tagline: '20,000 Credits · ₹79,999',
    description: 'Suitable for agencies managing multiple advertising campaigns and cities.',
    recommended: true,
    features: [
      'Prepaid audit credit wallet',
      'Multi-city campaign tracking',
      'Multi-media audit support',
      'Centralized audit evidence',
      'Issue identification and review',
      'Downloadable campaign reports',
      'Standard onboarding included',
    ],
    ctaLabel: 'Request Growth Plan',
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE WALLET',
    priceInr: 199999,
    credits: 50000,
    nominalValueInr: 200000,
    tagline: '50,000 Credits · ₹1,99,999',
    description: 'Suitable for brands, agencies and media owners with large-scale campaigns.',
    recommended: false,
    features: [
      'Prepaid audit credit wallet',
      'Multi-agency campaign management',
      'Multi-location audit operations',
      'Advanced reporting options',
      'Centralized media-proof management',
      'Role-based dashboard access',
      'Standard onboarding included',
      'Custom integrations available separately',
    ],
    ctaLabel: 'Request Enterprise Plan',
  },
];

export const DASHBOARD_ACCESS_INFO = {
  pricePerUserMonthlyInr: DASHBOARD_FEE_PER_USER_MONTHLY_INR,
  headline: '₹1,999 / user / month',
  explanation:
    'Access campaign progress, media proofs, flagged issues, audit history, and reports through the Mooviq dashboard.',
  features: [
    'Campaign monitoring',
    'Multi-media audit visibility',
    'Evidence gallery',
    'Audit issue tracking',
    'Standard reporting',
    'Role-based user access',
  ],
  standardTiers: [
    { users: 1, monthlyInr: 1999, label: '1 User · ₹1,999 / mo' },
    { users: 3, monthlyInr: 5997, label: '3 Users · ₹5,997 / mo' },
    { users: 5, monthlyInr: 9995, label: '5 Users · ₹9,995 / mo' },
    { users: 10, monthlyInr: 19990, label: '10 Users · ₹19,990 / mo' },
  ],
};

export type FixedMediaCategory =
  | 'Outdoor Advertising'
  | 'Transit & Vehicle Advertising'
  | 'Retail Advertising'
  | 'Residential Society Advertising';

export type MediaBillingUnit =
  | 'per audit task'
  | 'per month'
  | 'per location per day'
  | 'per store up to 3 elements'
  | 'per promoter per day';

export interface FixedMediaRate {
  id: string;
  name: string;
  category: FixedMediaCategory;
  credits: number;
  billingUnit: MediaBillingUnit;
  unitPriceInr: number; // credits * NOMINAL_CREDIT_VALUE_INR
  unitLabel: string; // e.g. "locations", "vehicles", "stores", "promoters"
  multiplierLabel: string; // e.g. "Inspections per unit", "Months", "Days"
  defaultMultiplier: number;
  notes?: string;
}

export const FIXED_MEDIA_RATE_CARD: FixedMediaRate[] = [
  // Outdoor Advertising
  {
    id: 'no-parking-board',
    name: 'No Parking Board',
    category: 'Outdoor Advertising',
    credits: 1,
    billingUnit: 'per audit task',
    unitPriceInr: 1 * NOMINAL_CREDIT_VALUE_INR, // ₹4
    unitLabel: 'boards',
    multiplierLabel: 'Inspections per board',
    defaultMultiplier: 1,
  },
  {
    id: 'pole-board',
    name: 'Pole Board',
    category: 'Outdoor Advertising',
    credits: 4,
    billingUnit: 'per audit task',
    unitPriceInr: 4 * NOMINAL_CREDIT_VALUE_INR, // ₹16
    unitLabel: 'boards',
    multiplierLabel: 'Inspections per board',
    defaultMultiplier: 1,
  },
  {
    id: 'standee',
    name: 'Standee',
    category: 'Outdoor Advertising',
    credits: 12,
    billingUnit: 'per audit task',
    unitPriceInr: 12 * NOMINAL_CREDIT_VALUE_INR, // ₹48
    unitLabel: 'standees',
    multiplierLabel: 'Inspections per standee',
    defaultMultiplier: 1,
  },
  {
    id: 'umbrella-branding',
    name: 'Umbrella Branding',
    category: 'Outdoor Advertising',
    credits: 12,
    billingUnit: 'per audit task',
    unitPriceInr: 12 * NOMINAL_CREDIT_VALUE_INR, // ₹48
    unitLabel: 'umbrellas',
    multiplierLabel: 'Inspections per umbrella',
    defaultMultiplier: 1,
  },
  {
    id: 'wall-painting',
    name: 'Wall Painting',
    category: 'Outdoor Advertising',
    credits: 47,
    billingUnit: 'per audit task',
    unitPriceInr: 47 * NOMINAL_CREDIT_VALUE_INR, // ₹188
    unitLabel: 'walls',
    multiplierLabel: 'Inspections per wall',
    defaultMultiplier: 1,
  },
  {
    id: 'bus-shelter',
    name: 'Bus Shelter',
    category: 'Outdoor Advertising',
    credits: 59,
    billingUnit: 'per audit task',
    unitPriceInr: 59 * NOMINAL_CREDIT_VALUE_INR, // ₹236
    unitLabel: 'shelters',
    multiplierLabel: 'Inspections per shelter',
    defaultMultiplier: 1,
  },
  {
    id: 'hoarding-billboard',
    name: 'Hoarding / Billboard',
    category: 'Outdoor Advertising',
    credits: 237,
    billingUnit: 'per audit task',
    unitPriceInr: 237 * NOMINAL_CREDIT_VALUE_INR, // ₹948
    unitLabel: 'billboard locations',
    multiplierLabel: 'Inspections per billboard',
    defaultMultiplier: 2,
  },
  {
    id: 'newspaper-inserts',
    name: 'Newspaper Inserts',
    category: 'Outdoor Advertising',
    credits: 237,
    billingUnit: 'per location per day',
    unitPriceInr: 237 * NOMINAL_CREDIT_VALUE_INR, // ₹948
    unitLabel: 'distribution points',
    multiplierLabel: 'Days audited',
    defaultMultiplier: 1,
    notes: 'Billed per distribution location per insertion day.',
  },

  // Transit & Vehicle Advertising
  {
    id: 'auto-sticker',
    name: 'Auto Sticker',
    category: 'Transit & Vehicle Advertising',
    credits: 4,
    billingUnit: 'per audit task',
    unitPriceInr: 4 * NOMINAL_CREDIT_VALUE_INR, // ₹16
    unitLabel: 'vehicles',
    multiplierLabel: 'Inspections per vehicle',
    defaultMultiplier: 1,
  },
  {
    id: 'auto-rickshaw-branding',
    name: 'Auto / E-Rickshaw Branding',
    category: 'Transit & Vehicle Advertising',
    credits: 12,
    billingUnit: 'per audit task',
    unitPriceInr: 12 * NOMINAL_CREDIT_VALUE_INR, // ₹48
    unitLabel: 'vehicles',
    multiplierLabel: 'Inspections per vehicle',
    defaultMultiplier: 1,
  },
  {
    id: 'cab-branding',
    name: 'Cab Branding',
    category: 'Transit & Vehicle Advertising',
    credits: 35,
    billingUnit: 'per audit task',
    unitPriceInr: 35 * NOMINAL_CREDIT_VALUE_INR, // ₹140
    unitLabel: 'cabs',
    multiplierLabel: 'Inspections per cab',
    defaultMultiplier: 1,
  },
  {
    id: 'bus-branding',
    name: 'Bus Branding',
    category: 'Transit & Vehicle Advertising',
    credits: 71,
    billingUnit: 'per audit task',
    unitPriceInr: 71 * NOMINAL_CREDIT_VALUE_INR, // ₹284
    unitLabel: 'buses',
    multiplierLabel: 'Inspections per bus',
    defaultMultiplier: 1,
  },
  {
    id: 'mobile-van-branding',
    name: 'Mobile Van Branding',
    category: 'Transit & Vehicle Advertising',
    credits: 1425,
    billingUnit: 'per month',
    unitPriceInr: 1425 * NOMINAL_CREDIT_VALUE_INR, // ₹5,700
    unitLabel: 'vans',
    multiplierLabel: 'Campaign duration (Months)',
    defaultMultiplier: 1,
    notes: 'Billed per van per month of continuous route monitoring.',
  },

  // Retail Advertising
  {
    id: 'arch-gate',
    name: 'Arch Gate',
    category: 'Retail Advertising',
    credits: 23,
    billingUnit: 'per audit task',
    unitPriceInr: 23 * NOMINAL_CREDIT_VALUE_INR, // ₹92
    unitLabel: 'arch gates',
    multiplierLabel: 'Inspections per gate',
    defaultMultiplier: 1,
  },
  {
    id: 'in-shop-branding',
    name: 'In-Shop Branding',
    category: 'Retail Advertising',
    credits: 35,
    billingUnit: 'per store up to 3 elements',
    unitPriceInr: 35 * NOMINAL_CREDIT_VALUE_INR, // ₹140
    unitLabel: 'stores',
    multiplierLabel: 'Audit visits per store',
    defaultMultiplier: 1,
    notes: 'Covers up to three distinct branding elements per retail store visit.',
  },
  {
    id: 'requirement-gathering',
    name: 'Requirement Gathering',
    category: 'Retail Advertising',
    credits: 47,
    billingUnit: 'per audit task',
    unitPriceInr: 47 * NOMINAL_CREDIT_VALUE_INR, // ₹188
    unitLabel: 'retail sites',
    multiplierLabel: 'Assessment tasks',
    defaultMultiplier: 1,
  },
  {
    id: 'shop-name-board-recce',
    name: 'Shop Name Board Recce',
    category: 'Retail Advertising',
    credits: 47,
    billingUnit: 'per audit task',
    unitPriceInr: 47 * NOMINAL_CREDIT_VALUE_INR, // ₹188
    unitLabel: 'shop boards',
    multiplierLabel: 'Recce visits',
    defaultMultiplier: 1,
  },
  {
    id: 'shop-name-board-execution',
    name: 'Shop Name Board Execution',
    category: 'Retail Advertising',
    credits: 47,
    billingUnit: 'per audit task',
    unitPriceInr: 47 * NOMINAL_CREDIT_VALUE_INR, // ₹188
    unitLabel: 'shop boards',
    multiplierLabel: 'Installation audit visits',
    defaultMultiplier: 1,
  },
  {
    id: 'recce-execution-requirements',
    name: 'Recce + Execution + Requirements',
    category: 'Retail Advertising',
    credits: 118,
    billingUnit: 'per audit task',
    unitPriceInr: 118 * NOMINAL_CREDIT_VALUE_INR, // ₹472
    unitLabel: 'complete storefronts',
    multiplierLabel: 'Full lifecycle audit cycles',
    defaultMultiplier: 1,
  },

  // Residential Society Advertising
  {
    id: 'lift-posters',
    name: 'Lift Posters',
    category: 'Residential Society Advertising',
    credits: 12,
    billingUnit: 'per audit task',
    unitPriceInr: 12 * NOMINAL_CREDIT_VALUE_INR, // ₹48
    unitLabel: 'lift frames',
    multiplierLabel: 'Inspections per frame',
    defaultMultiplier: 1,
  },
  {
    id: 'promoter-activity',
    name: 'Promoter Activity',
    category: 'Residential Society Advertising',
    credits: 23,
    billingUnit: 'per promoter per day',
    unitPriceInr: 23 * NOMINAL_CREDIT_VALUE_INR, // ₹92
    unitLabel: 'promoters',
    multiplierLabel: 'Activity days',
    defaultMultiplier: 1,
    notes: 'Billed per promoter per activation day.',
  },
  {
    id: 'rwa-gate-banners',
    name: 'RWA Gate Banners',
    category: 'Residential Society Advertising',
    credits: 59,
    billingUnit: 'per audit task',
    unitPriceInr: 59 * NOMINAL_CREDIT_VALUE_INR, // ₹236
    unitLabel: 'society gates',
    multiplierLabel: 'Inspections per gate',
    defaultMultiplier: 1,
  },
];

export interface AdditionalMediaGroup {
  category: string;
  description: string;
  verificationEvidence: string;
  items: {
    id: string;
    name: string;
    details: string;
  }[];
}

export const ADDITIONAL_MEDIA_CATALOG: AdditionalMediaGroup[] = [
  {
    category: 'Outdoor & Digital OOH',
    description: 'High-visibility urban infrastructure and digital network displays.',
    verificationEvidence: 'High-res time-stamped visual proof, illumination checks, and CMS playback status.',
    items: [
      { id: 'custom-unipoles', name: 'Unipoles', details: 'Highway & arterial junction single-pole structures.' },
      { id: 'custom-gantries', name: 'Gantries', details: 'Overhead road-spanning structural media displays.' },
      { id: 'custom-digital-billboards', name: 'Digital Billboards', details: 'LED screen playback, loop verification & operational uptime.' },
      { id: 'custom-led-screens', name: 'LED Advertising Screens', details: 'Commercial hub LED video displays & spot timing checks.' },
      { id: 'custom-street-furniture', name: 'Street Furniture', details: 'Kiosks, utility panels, and smart city pedestrian media.' },
      { id: 'custom-metro-station', name: 'Metro Station Advertising', details: 'Platform pillar wraps, concourse lightboxes & turnstile media.' },
    ],
  },
  {
    category: 'Transit',
    description: 'Mobile public transit and commercial delivery fleet networks.',
    verificationEvidence: 'Route telematics, depot inspection visual proof, and wrap condition reviews.',
    items: [
      { id: 'custom-bus-fleets', name: 'Bus Branding (Fleet Networks)', details: 'Full bus wraps, side panels, and back panel fleets.' },
      { id: 'custom-metro-train', name: 'Metro Train Branding', details: 'Interior train panels and exterior train wrap inspections.' },
      { id: 'custom-railway', name: 'Railway Advertising', details: 'Platform hoardings, bridge wraps, and train coach branding.' },
      { id: 'custom-fleet-branding', name: 'Fleet Branding', details: 'Corporate logistics trucks, delivery vans, and commercial vehicles.' },
      { id: 'custom-delivery-vehicles', name: 'Delivery Vehicles', details: 'Hyperlocal last-mile 2-wheeler and 3-wheeler delivery fleets.' },
    ],
  },
  {
    category: 'Indoor & Place-Based',
    description: 'Controlled environment venues with captive audience footfall.',
    verificationEvidence: 'Geo-tagged atrium photos, screen condition checks, and venue authorization records.',
    items: [
      { id: 'custom-mall', name: 'Shopping Mall Advertising', details: 'Atrium drop banners, pillar wraps, elevator branding, and digital totems.' },
      { id: 'custom-airport', name: 'Airport Advertising', details: 'Departure/arrival conveyor wraps, boarding gate lightboxes & aero-bridge panels.' },
      { id: 'custom-society-screens', name: 'Residential Society Digital Screens', details: 'Lift lobby screens and community notice board digital displays.' },
      { id: 'custom-corporate-parks', name: 'Corporate Park Advertising', details: 'Tech park campus totems, cafeteria displays, and turnstile branding.' },
      { id: 'custom-retail-displays', name: 'Retail Store Displays', details: 'Endcaps, shelf talkers, checkout counter POSM, and window graphics.' },
      { id: 'custom-lift-lobbies', name: 'Lift Lobby Advertising', details: 'High-rise residential and commercial elevator waiting area media.' },
    ],
  },
  {
    category: 'Other Advertising Formats',
    description: 'Screen, audio, broadcast, and experiential marketing activations.',
    verificationEvidence: 'Automated playback logs, broadcast transmission logs, and event execution checklists.',
    items: [
      { id: 'custom-cinema', name: 'Cinema Advertising', details: 'On-screen slide and video playback verified via theatre server logs & audit visits.' },
      { id: 'custom-radio', name: 'Radio Advertising', details: 'Broadcast transmission log reconciliation & spot time compliance.' },
      { id: 'custom-television', name: 'Television Advertising', details: 'Commercial playout log verification across regional and national channels.' },
      { id: 'custom-digital-inapp', name: 'Digital & In-App Campaigns', details: 'Impression delivery verification, publisher logs & placement compliance.' },
      { id: 'custom-events', name: 'Event Activations', details: 'Stalls, sampling counters, experiential pop-ups, and promoter presence.' },
      { id: 'custom-print', name: 'Print Advertising', details: 'Newspaper mastheads, front-page jackets, and magazine insertion audits.' },
    ],
  },
];

export const PRICING_POLICY_NOTES = {
  nominalCreditValue: '1 Mooviq Credit = ₹4 (Nominal value used for audit usage calculation).',
  packageLevelDiscount:
    'The displayed credit package prices include package-level adjustments (5,000 credits nominal ₹20,000 for ₹19,999; 20,000 credits nominal ₹80,000 for ₹79,999; 50,000 credits nominal ₹2,00,000 for ₹1,99,999). The ₹1 adjustment is a package-level pricing structure, not a different per-credit consumption rate.',
  taxDisclaimer: 'All listed prices exclude applicable GST and are proposed/indicative subject to final commercial agreement.',
  separationNote:
    'Dashboard subscriptions cover workspace software access and are billed separately from audit credit consumption. Field audits consume credits from your prepaid wallet based on your media plan.',
  zeroOnboardingNote:
    'Standard platform onboarding is included at ₹0. Custom API integrations, bespoke configurations, historical data migration, or specialized training are quoted separately.',
  walletTermsNote:
    'Credit validity, rollover, and refund terms are governed by your final commercial agreement. A wallet is a prepaid balance, not an additional audit-service fee.',
};
