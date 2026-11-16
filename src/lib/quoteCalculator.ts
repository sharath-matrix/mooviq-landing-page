import {
  NOMINAL_CREDIT_VALUE_INR,
  DASHBOARD_FEE_PER_USER_MONTHLY_INR,
  FIXED_MEDIA_RATE_CARD,
  CREDIT_WALLET_PACKAGES,
  FixedMediaRate,
  CreditWalletPackage,
  MediaBillingUnit,
} from '../config/pricingConfig';
import { QuoteMediaRow } from '../types/mooviq';

export interface CalculatedQuoteRow {
  id: string;
  mediaRateId: string;
  mediaName: string;
  category: string;
  units: number;
  multiplier: number;
  billableQuantity: number;
  cityScope: string;
  isCustomQuote: boolean;
  billingUnit: MediaBillingUnit | 'custom scope';
  creditsPerUnit: number | null;
  lineCredits: number | null;
  lineCostInr: number | null;
  fixedRate?: FixedMediaRate;
}

export interface WalletRecommendation {
  recommendedPackage: CreditWalletPackage | null;
  status: 'sufficient' | 'upgrade_needed' | 'exceeds_enterprise' | 'none';
  message: string;
  coverageRatio: number; // totalCredits / package.credits
}

export interface QuoteCalculationResult {
  dashboardUsers: number;
  dashboardMonthlyInr: number;
  totalMediaUnits: number;
  totalBillableEvents: number;
  totalCredits: number;
  totalAuditCostInr: number;
  fixedRateRowsCount: number;
  customQuoteRowsCount: number;
  hasCustomQuoteItems: boolean;
  rows: CalculatedQuoteRow[];
  walletRecommendation: WalletRecommendation;
}

export function clampQuantity(value: number, min: number, max: number): number {
  if (Number.isNaN(value) || !Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, Math.floor(value)));
}

export function formatInr(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}

export function calculateQuoteBreakdown(
  selectedUsers: number,
  mediaRows: QuoteMediaRow[]
): QuoteCalculationResult {
  const safeUsers = clampQuantity(selectedUsers, 0, 100);
  const dashboardMonthlyInr = safeUsers * DASHBOARD_FEE_PER_USER_MONTHLY_INR;

  let totalMediaUnits = 0;
  let totalBillableEvents = 0;
  let totalCredits = 0;
  let fixedRateRowsCount = 0;
  let customQuoteRowsCount = 0;

  const rows: CalculatedQuoteRow[] = mediaRows.map((row) => {
    const safeUnits = clampQuantity(row.units, 1, 100000);
    const safeMultiplier = clampQuantity(row.multiplier, 1, 365);
    const billableQuantity = safeUnits * safeMultiplier;

    totalMediaUnits += safeUnits;
    totalBillableEvents += billableQuantity;

    const fixedRate = FIXED_MEDIA_RATE_CARD.find((r) => r.id === row.mediaRateId);

    if (fixedRate && !row.isCustomQuote) {
      const lineCredits = billableQuantity * fixedRate.credits;
      const lineCostInr = lineCredits * NOMINAL_CREDIT_VALUE_INR;
      totalCredits += lineCredits;
      fixedRateRowsCount += 1;

      return {
        id: row.id,
        mediaRateId: row.mediaRateId,
        mediaName: fixedRate.name,
        category: fixedRate.category,
        units: safeUnits,
        multiplier: safeMultiplier,
        billableQuantity,
        cityScope: row.cityScope.trim() || 'Pan-India / Not specified',
        isCustomQuote: false,
        billingUnit: fixedRate.billingUnit,
        creditsPerUnit: fixedRate.credits,
        lineCredits,
        lineCostInr,
        fixedRate,
      };
    }

    // Custom Quote format
    customQuoteRowsCount += 1;
    return {
      id: row.id,
      mediaRateId: row.mediaRateId,
      mediaName: row.mediaName || 'Custom Media Format',
      category: row.category || 'Specialized Media',
      units: safeUnits,
      multiplier: safeMultiplier,
      billableQuantity,
      cityScope: row.cityScope.trim() || 'Pan-India / Not specified',
      isCustomQuote: true,
      billingUnit: 'custom scope',
      creditsPerUnit: null,
      lineCredits: null,
      lineCostInr: null,
    };
  });

  const totalAuditCostInr = totalCredits * NOMINAL_CREDIT_VALUE_INR;

  // Wallet recommendation
  const starter = CREDIT_WALLET_PACKAGES.find((p) => p.id === 'starter')!;
  const growth = CREDIT_WALLET_PACKAGES.find((p) => p.id === 'growth')!;
  const enterprise = CREDIT_WALLET_PACKAGES.find((p) => p.id === 'enterprise')!;

  let walletRecommendation: WalletRecommendation;

  if (totalCredits === 0) {
    walletRecommendation = {
      recommendedPackage: starter,
      status: 'none',
      message: 'Select media quantities to estimate credit consumption.',
      coverageRatio: 0,
    };
  } else if (totalCredits <= starter.credits) {
    walletRecommendation = {
      recommendedPackage: starter,
      status: 'sufficient',
      message: `Starter Wallet (${starter.credits.toLocaleString()} credits / ${formatInr(starter.priceInr)}) fully covers your estimated ${totalCredits.toLocaleString()} credits.`,
      coverageRatio: totalCredits / starter.credits,
    };
  } else if (totalCredits <= growth.credits) {
    walletRecommendation = {
      recommendedPackage: growth,
      status: 'sufficient',
      message: `Growth Wallet (${growth.credits.toLocaleString()} credits / ${formatInr(growth.priceInr)}) is recommended for your estimated ${totalCredits.toLocaleString()} credits.`,
      coverageRatio: totalCredits / growth.credits,
    };
  } else if (totalCredits <= enterprise.credits) {
    walletRecommendation = {
      recommendedPackage: enterprise,
      status: 'sufficient',
      message: `Enterprise Wallet (${enterprise.credits.toLocaleString()} credits / ${formatInr(enterprise.priceInr)}) covers your estimated ${totalCredits.toLocaleString()} credits.`,
      coverageRatio: totalCredits / enterprise.credits,
    };
  } else {
    walletRecommendation = {
      recommendedPackage: enterprise,
      status: 'exceeds_enterprise',
      message: `Your campaign requires ${totalCredits.toLocaleString()} credits, which exceeds the single 50,000 credit Enterprise Wallet. Multiple wallet packs or custom enterprise top-ups will be structured.`,
      coverageRatio: totalCredits / enterprise.credits,
    };
  }

  return {
    dashboardUsers: safeUsers,
    dashboardMonthlyInr,
    totalMediaUnits,
    totalBillableEvents,
    totalCredits,
    totalAuditCostInr,
    fixedRateRowsCount,
    customQuoteRowsCount,
    hasCustomQuoteItems: customQuoteRowsCount > 0,
    rows,
    walletRecommendation,
  };
}

export function buildQuotationSummaryText(result: QuoteCalculationResult): string {
  const lines: string[] = [];

  lines.push('=== Mooviq Multi-Media Audit Quotation Summary ===');
  lines.push(
    `Dashboard Subscription: ${result.dashboardUsers} user(s) × ₹${DASHBOARD_FEE_PER_USER_MONTHLY_INR}/mo = ${formatInr(
      result.dashboardMonthlyInr
    )}/month (Billed separately before GST)`
  );
  lines.push('');
  lines.push('Media Audit Requirements:');

  result.rows.forEach((row, idx) => {
    if (row.isCustomQuote) {
      lines.push(
        `${idx + 1}. ${row.mediaName} (${row.category})` +
          `\n   Units: ${row.units} | Multiplier: ${row.multiplier} | Cities: ${row.cityScope}` +
          `\n   Audit Pricing: Custom Quote Required (Unpriced)`
      );
    } else {
      lines.push(
        `${idx + 1}. ${row.mediaName} (${row.category})` +
          `\n   Units: ${row.units} × Multiplier: ${row.multiplier} = ${row.billableQuantity} ${row.billingUnit}` +
          `\n   Credits: ${row.lineCredits?.toLocaleString()} cr (${row.creditsPerUnit} cr/unit) | Est. Cost: ${formatInr(
            row.lineCostInr || 0
          )} | Cities: ${row.cityScope}`
      );
    }
  });

  lines.push('');
  lines.push('--- Financial & Credit Breakdown ---');
  lines.push(`Total Fixed-Rate Credits Required: ${result.totalCredits.toLocaleString()} Mooviq Credits`);
  lines.push(
    `Nominal Credit Value: 1 Credit = ₹${NOMINAL_CREDIT_VALUE_INR} (Est. Audit Services Cost: ${formatInr(
      result.totalAuditCostInr
    )})`
  );

  if (result.walletRecommendation.recommendedPackage) {
    const pkg = result.walletRecommendation.recommendedPackage;
    lines.push(
      `Recommended Prepaid Wallet: ${pkg.name} (${pkg.credits.toLocaleString()} credits for ${formatInr(
        pkg.priceInr
      )})`
    );
    lines.push(`Wallet Note: ${result.walletRecommendation.message}`);
  }

  if (result.hasCustomQuoteItems) {
    lines.push(
      `* Notice: ${result.customQuoteRowsCount} format(s) marked for custom quotation. Total cost will be finalized upon plan review.`
    );
  }

  lines.push('Standard Onboarding: ₹0 Standard Onboarding Charges included.');
  lines.push('All prices in INR and exclude applicable GST.');

  return lines.join('\n');
}
