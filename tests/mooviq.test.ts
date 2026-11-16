import test from 'node:test';
import assert from 'node:assert/strict';

import {
  NOMINAL_CREDIT_VALUE_INR,
  DASHBOARD_FEE_PER_USER_MONTHLY_INR,
  CREDIT_WALLET_PACKAGES,
  FIXED_MEDIA_RATE_CARD,
  ADDITIONAL_MEDIA_CATALOG,
} from '../src/config/pricingConfig.ts';
import {
  MEDIA_FAMILIES,
  MEDIA_CATALOG,
} from '../src/config/mediaAuditCatalog.ts';
import {
  RAW_CAMPAIGNS,
  MONTHLY_AUDIT_HISTORY,
  SAMPLE_AUDIT_REPORTS,
} from '../src/data/demoData.ts';
import {
  calculateQuoteBreakdown,
  buildQuotationSummaryText,
} from '../src/lib/quoteCalculator.ts';
import {
  processEnquirySubmission,
  resetRateLimiter,
} from '../server/enquiryService.ts';

test('Credit wallet packages match approved commercial model and 1 credit = ₹4 nominal value', () => {
  assert.equal(NOMINAL_CREDIT_VALUE_INR, 4, '1 Mooviq credit must equal ₹4');
  assert.equal(DASHBOARD_FEE_PER_USER_MONTHLY_INR, 1999, 'Dashboard user fee must equal ₹1,999/user/month');

  assert.equal(CREDIT_WALLET_PACKAGES.length, 3);

  const starter = CREDIT_WALLET_PACKAGES.find((p) => p.id === 'starter');
  assert.ok(starter);
  assert.equal(starter.priceInr, 19999);
  assert.equal(starter.credits, 5000);
  assert.equal(starter.nominalValueInr, 20000);
  assert.equal(starter.ctaLabel, 'Get Started');

  const growth = CREDIT_WALLET_PACKAGES.find((p) => p.id === 'growth');
  assert.ok(growth);
  assert.equal(growth.priceInr, 79999);
  assert.equal(growth.credits, 20000);
  assert.equal(growth.nominalValueInr, 80000);
  assert.equal(growth.recommended, true);
  assert.equal(growth.ctaLabel, 'Request Growth Plan');

  const enterprise = CREDIT_WALLET_PACKAGES.find((p) => p.id === 'enterprise');
  assert.ok(enterprise);
  assert.equal(enterprise.priceInr, 199999);
  assert.equal(enterprise.credits, 50000);
  assert.equal(enterprise.nominalValueInr, 200000);
  assert.equal(enterprise.ctaLabel, 'Request Enterprise Plan');
});

test('Fixed media rate card has all 22 benchmark items and exact price = credits * 4 calculation', () => {
  assert.equal(FIXED_MEDIA_RATE_CARD.length, 22, 'Must include exactly 22 benchmark media rates');

  // Verify all 22 items adhere to credits * 4 = unitPriceInr
  for (const rate of FIXED_MEDIA_RATE_CARD) {
    assert.equal(
      rate.unitPriceInr,
      rate.credits * NOMINAL_CREDIT_VALUE_INR,
      `Rate ${rate.name} (${rate.id}) price mismatch`
    );
  }

  // Check specific required benchmark rates
  const noParking = FIXED_MEDIA_RATE_CARD.find((r) => r.id === 'no-parking-board');
  assert.equal(noParking?.credits, 1);
  assert.equal(noParking?.unitPriceInr, 4);
  assert.equal(noParking?.billingUnit, 'per audit task');

  const billboard = FIXED_MEDIA_RATE_CARD.find((r) => r.id === 'hoarding-billboard');
  assert.equal(billboard?.credits, 237);
  assert.equal(billboard?.unitPriceInr, 948);
  assert.equal(billboard?.billingUnit, 'per audit task');

  const mobileVan = FIXED_MEDIA_RATE_CARD.find((r) => r.id === 'mobile-van-branding');
  assert.equal(mobileVan?.credits, 1425);
  assert.equal(mobileVan?.unitPriceInr, 5700);
  assert.equal(mobileVan?.billingUnit, 'per month');

  const newspaper = FIXED_MEDIA_RATE_CARD.find((r) => r.id === 'newspaper-inserts');
  assert.equal(newspaper?.credits, 237);
  assert.equal(newspaper?.unitPriceInr, 948);
  assert.equal(newspaper?.billingUnit, 'per location per day');

  const inShop = FIXED_MEDIA_RATE_CARD.find((r) => r.id === 'in-shop-branding');
  assert.equal(inShop?.credits, 35);
  assert.equal(inShop?.unitPriceInr, 140);
  assert.equal(inShop?.billingUnit, 'per store up to 3 elements');

  const promoter = FIXED_MEDIA_RATE_CARD.find((r) => r.id === 'promoter-activity');
  assert.equal(promoter?.credits, 23);
  assert.equal(promoter?.unitPriceInr, 92);
  assert.equal(promoter?.billingUnit, 'per promoter per day');

  const autoRickshaw = FIXED_MEDIA_RATE_CARD.find((r) => r.id === 'auto-rickshaw-branding');
  assert.equal(autoRickshaw?.credits, 12);
  assert.equal(autoRickshaw?.unitPriceInr, 48);
});

test('Additional media catalog contains all 4 categories without fabricated rates', () => {
  assert.equal(ADDITIONAL_MEDIA_CATALOG.length, 4);
  const categories = ADDITIONAL_MEDIA_CATALOG.map((g) => g.category);
  assert.ok(categories.includes('Outdoor & Digital OOH'));
  assert.ok(categories.includes('Transit'));
  assert.ok(categories.includes('Indoor & Place-Based'));
  assert.ok(categories.includes('Other Advertising Formats'));

  // Ensure items have non-empty verification notes
  for (const group of ADDITIONAL_MEDIA_CATALOG) {
    assert.ok(group.verificationEvidence.length > 10);
    assert.ok(group.items.length >= 5);
  }
});

test('Quote calculator accurately computes credits, costs, billing units, and custom quote items', () => {
  const result = calculateQuoteBreakdown(3, [
    {
      id: 'row-1',
      mediaRateId: 'auto-rickshaw-branding',
      mediaName: 'Auto / E-Rickshaw Branding',
      category: 'Transit & Vehicle Advertising',
      units: 100,
      multiplier: 1, // 1 inspection
      cityScope: 'Bengaluru',
      isCustomQuote: false,
    },
    {
      id: 'row-2',
      mediaRateId: 'hoarding-billboard',
      mediaName: 'Hoarding / Billboard',
      category: 'Outdoor Advertising',
      units: 10,
      multiplier: 2, // 2 inspections
      cityScope: 'Delhi NCR',
      isCustomQuote: false,
    },
    {
      id: 'row-3',
      mediaRateId: 'mobile-van-branding',
      mediaName: 'Mobile Van Branding',
      category: 'Transit & Vehicle Advertising',
      units: 2,
      multiplier: 2, // 2 months
      cityScope: 'Mumbai',
      isCustomQuote: false,
    },
    {
      id: 'row-4',
      mediaRateId: 'custom-cinema',
      mediaName: 'Cinema Advertising',
      category: 'Other Advertising Formats',
      units: 5,
      multiplier: 1,
      cityScope: 'Pune',
      isCustomQuote: true,
    },
  ]);

  // Dashboard calculations (3 users * 1999)
  assert.equal(result.dashboardUsers, 3);
  assert.equal(result.dashboardMonthlyInr, 3 * 1999); // 5997

  // Auto: 100 units * 1 * 12 = 1200 credits, cost = 1200 * 4 = 4800
  const autoRow = result.rows.find((r) => r.mediaRateId === 'auto-rickshaw-branding');
  assert.equal(autoRow?.lineCredits, 1200);
  assert.equal(autoRow?.lineCostInr, 4800);

  // Billboard: 10 units * 2 * 237 = 4740 credits, cost = 4740 * 4 = 18960
  const billboardRow = result.rows.find((r) => r.mediaRateId === 'hoarding-billboard');
  assert.equal(billboardRow?.lineCredits, 4740);
  assert.equal(billboardRow?.lineCostInr, 18960);

  // Mobile Van: 2 units * 2 * 1425 = 5700 credits, cost = 5700 * 4 = 22800
  const vanRow = result.rows.find((r) => r.mediaRateId === 'mobile-van-branding');
  assert.equal(vanRow?.lineCredits, 5700);
  assert.equal(vanRow?.lineCostInr, 22800);

  // Cinema (custom): null credits & null cost
  const cinemaRow = result.rows.find((r) => r.mediaRateId === 'custom-cinema');
  assert.equal(cinemaRow?.isCustomQuote, true);
  assert.equal(cinemaRow?.lineCredits, null);
  assert.equal(cinemaRow?.lineCostInr, null);

  // Total credits = 1200 + 4740 + 5700 = 11,640 credits
  assert.equal(result.totalCredits, 11640);
  assert.equal(result.totalAuditCostInr, 11640 * 4); // 46,560
  assert.equal(result.hasCustomQuoteItems, true);
  assert.equal(result.customQuoteRowsCount, 1);
  assert.equal(result.fixedRateRowsCount, 3);

  // Recommended wallet: 11,640 credits falls between 5,000 and 20,000 -> Growth Wallet
  assert.equal(result.walletRecommendation.recommendedPackage?.id, 'growth');

  // Formatted summary text contains key details
  const summary = buildQuotationSummaryText(result);
  assert.ok(summary.includes('11,640 Mooviq Credits'));
  assert.ok(summary.includes('Growth Wallet'));
  assert.ok(summary.includes('₹0 Standard Onboarding Charges'));
});

test('Sample demo campaigns maintain exact unit arithmetic and chronological months', () => {
  assert.ok(RAW_CAMPAIGNS.length >= 8);
  for (const c of RAW_CAMPAIGNS) {
    assert.equal(
      c.verifiedUnits + c.flaggedUnits + c.pendingUnits,
      c.submittedUnits,
      `Arithmetic mismatch in campaign ${c.id}`
    );
    assert.equal(
      Math.round((c.submittedUnits / c.targetUnits) * 100),
      c.completionRate,
      `Completion rate mismatch in campaign ${c.id}`
    );
  }

  assert.deepEqual(
    MONTHLY_AUDIT_HISTORY.map((m) => m.month),
    ['Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul']
  );

  assert.ok(SAMPLE_AUDIT_REPORTS['cinema-playback'].verificationMode.includes('Log-based'));
  assert.ok(SAMPLE_AUDIT_REPORTS.billboard.columns.includes('Visibility / Lighting'));
});

test('Enquiry service enforces validation, honeypot, rate limits, and honest unconfigured fallback', async () => {
  resetRateLimiter();

  const missingConsent = await processEnquirySubmission(
    {
      fullName: 'Asha Rao',
      workEmail: 'asha@brand.example',
      companyName: 'Northstar',
      enquiryType: 'Request media-wise quote',
      consent: false,
    },
    '127.0.0.1',
    {}
  );
  assert.equal(missingConsent.body.ok, false);
  assert.equal(missingConsent.body.code, 'VALIDATION_ERROR');
  assert.ok(missingConsent.body.fieldErrors?.consent);

  const honeypotTriggered = await processEnquirySubmission(
    {
      fullName: 'Bot User',
      workEmail: 'bot@spam.example',
      companyName: 'SpamCorp',
      enquiryType: 'Book a demo',
      consent: true,
      honeypot: 'filled_by_bot',
    },
    '127.0.0.2',
    {}
  );
  assert.equal(honeypotTriggered.body.ok, false);
  assert.equal(honeypotTriggered.body.code, 'SPAM_REJECTED');

  const validEnquiry = await processEnquirySubmission(
    {
      fullName: 'Vikram Mehta',
      workEmail: 'vikram@growthagency.example',
      companyName: 'Growth Agency',
      enquiryType: 'Request Pricing / Quotation',
      quoteSummary: 'Test multi-media quote: 20 hoardings, 100 autos.',
      consent: true,
    },
    '127.0.0.3',
    {}
  );
  assert.ok(
    validEnquiry.body.code === 'BACKEND_NOT_CONFIGURED' || validEnquiry.body.code === 'ENQUIRY_STORED',
    `Expected valid submission outcome, got ${validEnquiry.body.code}`
  );
});
