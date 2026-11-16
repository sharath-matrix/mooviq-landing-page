/**
 * Server-Side Confidential Pricing Engine for Mooviq
 *
 * This file lives STRICTLY on the server and is never bundled into public frontend code.
 * Prices and credit rates are calculated only after successful dual contact verification.
 */

export const NOMINAL_CREDIT_VALUE_INR = 4;
export const DASHBOARD_FEE_PER_USER_MONTHLY_INR = 1999;
export const GST_RATE = 0.18; // 18% GST

export interface ServerMediaRate {
  id: string;
  name: string;
  category: string;
  credits: number;
  billingUnit: string;
  unitPriceInr: number; // credits * 4
  defaultMultiplier: number;
}

// 22 Approved Benchmark Media Rates
export const SERVER_MEDIA_RATES: ServerMediaRate[] = [
  // Outdoor Advertising (8)
  { id: 'no-parking-board', name: 'No Parking Board', category: 'Outdoor & OOH', credits: 1, billingUnit: 'per audit task', unitPriceInr: 4, defaultMultiplier: 1 },
  { id: 'pole-board', name: 'Pole Board', category: 'Outdoor & OOH', credits: 4, billingUnit: 'per audit task', unitPriceInr: 16, defaultMultiplier: 1 },
  { id: 'standee', name: 'Standee', category: 'Outdoor & OOH', credits: 12, billingUnit: 'per audit task', unitPriceInr: 48, defaultMultiplier: 1 },
  { id: 'umbrella-branding', name: 'Umbrella Branding', category: 'Outdoor & OOH', credits: 12, billingUnit: 'per audit task', unitPriceInr: 48, defaultMultiplier: 1 },
  { id: 'wall-painting', name: 'Wall Painting', category: 'Outdoor & OOH', credits: 47, billingUnit: 'per audit task', unitPriceInr: 188, defaultMultiplier: 1 },
  { id: 'bus-shelter', name: 'Bus Shelter', category: 'Outdoor & OOH', credits: 59, billingUnit: 'per audit task', unitPriceInr: 236, defaultMultiplier: 1 },
  { id: 'billboard-hoarding', name: 'Billboard / Hoarding', category: 'Outdoor & OOH', credits: 237, billingUnit: 'per audit task', unitPriceInr: 948, defaultMultiplier: 2 },
  { id: 'newspaper-inserts', name: 'Newspaper Inserts', category: 'Outdoor & OOH', credits: 237, billingUnit: 'per location per day', unitPriceInr: 948, defaultMultiplier: 1 },

  // Transit & Vehicle (5)
  { id: 'auto-sticker', name: 'Auto Sticker', category: 'Transit & Vehicle', credits: 4, billingUnit: 'per audit task', unitPriceInr: 16, defaultMultiplier: 1 },
  { id: 'auto-e-rickshaw-branding', name: 'Auto / E-Rickshaw Branding', category: 'Transit & Vehicle', credits: 12, billingUnit: 'per audit task', unitPriceInr: 48, defaultMultiplier: 1 },
  { id: 'cab-branding', name: 'Cab Branding', category: 'Transit & Vehicle', credits: 35, billingUnit: 'per audit task', unitPriceInr: 140, defaultMultiplier: 1 },
  { id: 'bus-branding', name: 'Bus Branding', category: 'Transit & Vehicle', credits: 71, billingUnit: 'per audit task', unitPriceInr: 284, defaultMultiplier: 1 },
  { id: 'mobile-van-branding', name: 'Mobile Van Branding', category: 'Transit & Vehicle', credits: 1425, billingUnit: 'per month', unitPriceInr: 5700, defaultMultiplier: 1 },

  // Mall, Retail & Indoor (6)
  { id: 'arch-gate', name: 'Arch Gate', category: 'Mall, Retail & Indoor', credits: 23, billingUnit: 'per audit task', unitPriceInr: 92, defaultMultiplier: 1 },
  { id: 'in-shop-branding', name: 'In-Shop Branding', category: 'Mall, Retail & Indoor', credits: 35, billingUnit: 'per store up to 3 elements', unitPriceInr: 140, defaultMultiplier: 1 },
  { id: 'requirement-gathering', name: 'Requirement Gathering', category: 'Mall, Retail & Indoor', credits: 47, billingUnit: 'per audit task', unitPriceInr: 188, defaultMultiplier: 1 },
  { id: 'shop-name-board-recce', name: 'Shop Name Board Recce', category: 'Mall, Retail & Indoor', credits: 47, billingUnit: 'per audit task', unitPriceInr: 188, defaultMultiplier: 1 },
  { id: 'shop-name-board-execution', name: 'Shop Name Board Execution', category: 'Mall, Retail & Indoor', credits: 47, billingUnit: 'per audit task', unitPriceInr: 188, defaultMultiplier: 1 },
  { id: 'recce-execution-requirements', name: 'Recce + Execution + Requirements', category: 'Mall, Retail & Indoor', credits: 118, billingUnit: 'per audit task', unitPriceInr: 472, defaultMultiplier: 1 },

  // Residential & Community (3)
  { id: 'lift-posters', name: 'Lift Posters', category: 'Residential & Community', credits: 12, billingUnit: 'per audit task', unitPriceInr: 48, defaultMultiplier: 1 },
  { id: 'promoter-activity', name: 'Promoter Activity', category: 'Residential & Community', credits: 23, billingUnit: 'per promoter per day', unitPriceInr: 92, defaultMultiplier: 1 },
  { id: 'rwa-gate-banners', name: 'RWA Gate Banners', category: 'Residential & Community', credits: 59, billingUnit: 'per audit task', unitPriceInr: 236, defaultMultiplier: 1 },
];

export interface ServerWalletPackage {
  id: 'starter' | 'growth' | 'enterprise';
  name: string;
  credits: number;
  packagePriceInr: number;
  nominalValueInr: number;
  recommended?: boolean;
}

export const SERVER_WALLET_PACKAGES: ServerWalletPackage[] = [
  { id: 'starter', name: 'Starter Wallet', credits: 5000, packagePriceInr: 19999, nominalValueInr: 20000 },
  { id: 'growth', name: 'Growth Wallet', credits: 20000, packagePriceInr: 79999, nominalValueInr: 80000, recommended: true },
  { id: 'enterprise', name: 'Enterprise Wallet', credits: 50000, packagePriceInr: 199999, nominalValueInr: 200000 },
];

export interface QuoteItemInput {
  mediaId: string;
  mediaName: string;
  category: string;
  units: number;
  multiplier: number;
  cityScope: string;
  frequency?: string;
  specialNotes?: string;
}

export interface CalculatedQuoteLineItem {
  mediaId: string;
  mediaName: string;
  category: string;
  units: number;
  multiplier: number;
  billableQuantity: number;
  billingUnit: string;
  cityScope: string;
  isCustomQuote: boolean;
  unitPriceInr: number | null;
  creditsPerUnit: number | null;
  totalCredits: number | null;
  lineCostInr: number | null;
}

export interface CalculatedQuotation {
  quotationRef: string;
  generatedAt: string;
  client: {
    fullName: string;
    companyName: string;
    mobileNumber: string;
    workEmail: string;
  };
  dashboard: {
    users: number;
    monthlyFeeInr: number;
    perUserRateInr: number;
  };
  items: CalculatedQuoteLineItem[];
  totals: {
    totalMediaUnits: number;
    totalBillableEvents: number;
    totalCredits: number;
    auditSubtotalInr: number;
    dashboardMonthlyInr: number;
    gstInr: number; // 18% on (auditSubtotal + dashboardMonthly)
    totalEstimateWithGstInr: number;
  };
  customQuoteItemsCount: number;
  hasCustomQuoteItems: boolean;
  walletRecommendation: {
    packageName: string;
    packagePriceInr: number;
    packageCredits: number;
    message: string;
  };
  onboardingBenefit: {
    standardOnboardingFeeInr: 0;
    label: string;
  };
  termsNotes: string[];
}

export function calculateSecureQuotation(
  client: { fullName: string; companyName: string; mobileNumber: string; workEmail: string },
  dashboardUsers: number,
  items: QuoteItemInput[]
): CalculatedQuotation {
  const safeUsers = Math.max(1, Math.min(100, Math.floor(dashboardUsers || 1)));
  const dashboardMonthlyFeeInr = safeUsers * DASHBOARD_FEE_PER_USER_MONTHLY_INR;

  let totalMediaUnits = 0;
  let totalBillableEvents = 0;
  let totalCredits = 0;
  let auditSubtotalInr = 0;
  let customQuoteItemsCount = 0;

  const calculatedItems: CalculatedQuoteLineItem[] = items.map((item) => {
    const safeUnits = Math.max(1, Math.min(100000, Math.floor(item.units || 1)));
    const safeMultiplier = Math.max(1, Math.min(365, Math.floor(item.multiplier || 1)));
    const billableQuantity = safeUnits * safeMultiplier;

    totalMediaUnits += safeUnits;
    totalBillableEvents += billableQuantity;

    // Match against approved server rates
    const matchedRate = SERVER_MEDIA_RATES.find(
      (r) =>
        r.id === item.mediaId ||
        r.name.toLowerCase() === item.mediaName.toLowerCase() ||
        (item.mediaId === 'auto-branding' && r.id === 'auto-e-rickshaw-branding') ||
        (item.mediaId === 'e-rickshaw-branding' && r.id === 'auto-e-rickshaw-branding') ||
        r.id.replace(/-/g, '') === item.mediaId.replace(/-/g, '')
    );

    if (matchedRate) {
      const lineCredits = billableQuantity * matchedRate.credits;
      const lineCost = lineCredits * NOMINAL_CREDIT_VALUE_INR;
      totalCredits += lineCredits;
      auditSubtotalInr += lineCost;

      return {
        mediaId: matchedRate.id,
        mediaName: matchedRate.name,
        category: matchedRate.category,
        units: safeUnits,
        multiplier: safeMultiplier,
        billableQuantity,
        billingUnit: matchedRate.billingUnit,
        cityScope: item.cityScope.trim() || 'Pan-India',
        isCustomQuote: false,
        unitPriceInr: matchedRate.unitPriceInr,
        creditsPerUnit: matchedRate.credits,
        totalCredits: lineCredits,
        lineCostInr: lineCost,
      };
    }

    // Custom Quote format
    customQuoteItemsCount += 1;
    return {
      mediaId: item.mediaId,
      mediaName: item.mediaName,
      category: item.category || 'Specialized Media',
      units: safeUnits,
      multiplier: safeMultiplier,
      billableQuantity,
      billingUnit: 'custom inspection scope',
      cityScope: item.cityScope.trim() || 'Pan-India',
      isCustomQuote: true,
      unitPriceInr: null,
      creditsPerUnit: null,
      totalCredits: null,
      lineCostInr: null,
    };
  });

  // Calculate wallet recommendation
  let walletRecommendation: CalculatedQuotation['walletRecommendation'];
  if (totalCredits <= 5000) {
    const p = SERVER_WALLET_PACKAGES[0];
    walletRecommendation = {
      packageName: p.name,
      packagePriceInr: p.packagePriceInr,
      packageCredits: p.credits,
      message: `Starter Wallet (${p.credits.toLocaleString()} credits / ₹${p.packagePriceInr.toLocaleString('en-IN')}) covers your estimated ${totalCredits.toLocaleString()} credits.`,
    };
  } else if (totalCredits <= 20000) {
    const p = SERVER_WALLET_PACKAGES[1];
    walletRecommendation = {
      packageName: p.name,
      packagePriceInr: p.packagePriceInr,
      packageCredits: p.credits,
      message: `Growth Wallet (${p.credits.toLocaleString()} credits / ₹${p.packagePriceInr.toLocaleString('en-IN')}) is recommended for your ${totalCredits.toLocaleString()} credits.`,
    };
  } else if (totalCredits <= 50000) {
    const p = SERVER_WALLET_PACKAGES[2];
    walletRecommendation = {
      packageName: p.name,
      packagePriceInr: p.packagePriceInr,
      packageCredits: p.credits,
      message: `Enterprise Wallet (${p.credits.toLocaleString()} credits / ₹${p.packagePriceInr.toLocaleString('en-IN')}) covers your ${totalCredits.toLocaleString()} credits.`,
    };
  } else {
    walletRecommendation = {
      packageName: 'Custom Enterprise Allocation',
      packagePriceInr: Math.ceil(totalCredits * NOMINAL_CREDIT_VALUE_INR),
      packageCredits: totalCredits,
      message: `Your planned ${totalCredits.toLocaleString()} credits exceed standard wallet tiers. Multi-wallet packs or custom enterprise allocation will be structured.`,
    };
  }

  const combinedPreTax = auditSubtotalInr + dashboardMonthlyFeeInr;
  const gstInr = Math.round(combinedPreTax * GST_RATE);
  const totalEstimateWithGstInr = combinedPreTax + gstInr;

  const refNum = Math.floor(1000 + Math.random() * 9000);
  const quotationRef = `MVQ-2026-${refNum}`;

  return {
    quotationRef,
    generatedAt: new Date().toISOString(),
    client,
    dashboard: {
      users: safeUsers,
      monthlyFeeInr: dashboardMonthlyFeeInr,
      perUserRateInr: DASHBOARD_FEE_PER_USER_MONTHLY_INR,
    },
    items: calculatedItems,
    totals: {
      totalMediaUnits,
      totalBillableEvents,
      totalCredits,
      auditSubtotalInr,
      dashboardMonthlyInr: dashboardMonthlyFeeInr,
      gstInr,
      totalEstimateWithGstInr,
    },
    customQuoteItemsCount,
    hasCustomQuoteItems: customQuoteItemsCount > 0,
    walletRecommendation,
    onboardingBenefit: {
      standardOnboardingFeeInr: 0,
      label: '₹0 Standard Onboarding Charges included',
    },
    termsNotes: [
      'Standard platform onboarding is included at ₹0. Custom integrations or bespoke data feeds are scoped separately.',
      'Nominal credit value: 1 Mooviq Credit = ₹4. Audit services consume credits from your prepaid wallet balance.',
      'Dashboard software subscriptions are billed separately from audit credit consumption.',
      'Custom-quoted formats will have final scope and evidence mechanisms confirmed during campaign onboarding.',
      'All estimates in INR before applicable 18% GST. Quotation is subject to formal commercial agreement.',
    ],
  };
}
