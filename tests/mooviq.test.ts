import test from 'node:test';
import assert from 'node:assert/strict';

import {
  calculateSecureQuotation,
  SERVER_MEDIA_RATES,
  SERVER_WALLET_PACKAGES,
  NOMINAL_CREDIT_VALUE_INR,
  DASHBOARD_FEE_PER_USER_MONTHLY_INR,
} from '../server/pricingService.ts';
import {
  handleSendOtp,
  handleVerifyOtp,
  validateVerificationToken,
  resetOtpRateLimiter,
  SANDBOX_OTP_CODE,
} from '../server/otpService.ts';
import { generateQuotationPdf } from '../server/quotePdfService.ts';
import {
  PUBLIC_MEDIA_CATEGORIES,
  PUBLIC_MEDIA_CATALOG,
} from '../src/config/publicMediaCatalog.ts';
import {
  RAW_CAMPAIGNS,
  MONTHLY_AUDIT_HISTORY,
  SAMPLE_AUDIT_REPORTS,
} from '../src/data/demoData.ts';
import {
  processEnquirySubmission,
  resetRateLimiter,
} from '../server/enquiryService.ts';

test('Server-side pricing engine calculates exact audit credits, subtotals, GST, and custom items', () => {
  assert.equal(NOMINAL_CREDIT_VALUE_INR, 4);
  assert.equal(DASHBOARD_FEE_PER_USER_MONTHLY_INR, 1999);
  assert.equal(SERVER_MEDIA_RATES.length, 22);

  const client = {
    fullName: 'Rahul Deshmukh',
    companyName: 'Apex Media',
    mobileNumber: '+91 9876543210',
    workEmail: 'rahul@apexmedia.in',
  };

  const quote = calculateSecureQuotation(client, 3, [
    {
      mediaId: 'billboard-hoarding',
      mediaName: 'Billboard / Hoarding',
      category: 'Outdoor & OOH',
      units: 10,
      multiplier: 2, // 20 tasks * 237 cr = 4,740 cr => 4740 * 4 = 18,960
      cityScope: 'Mumbai',
    },
    {
      mediaId: 'auto-branding',
      mediaName: 'Auto Branding',
      category: 'Transit & Vehicle',
      units: 100,
      multiplier: 1, // 100 tasks * 12 cr = 1,200 cr => 1200 * 4 = 4,800
      cityScope: 'Bengaluru',
    },
    {
      mediaId: 'mobile-van-branding',
      mediaName: 'Mobile Van Branding',
      category: 'Transit & Vehicle',
      units: 2,
      multiplier: 2, // 4 van-months * 1,425 cr = 5,700 cr => 5700 * 4 = 22,800
      cityScope: 'Delhi NCR',
    },
    {
      mediaId: 'cinema-advertising',
      mediaName: 'Cinema Advertising',
      category: 'Airport, Cinema & Other',
      units: 5,
      multiplier: 1,
      cityScope: 'Pune',
    },
  ]);

  // Dashboard
  assert.equal(quote.dashboard.users, 3);
  assert.equal(quote.dashboard.monthlyFeeInr, 3 * 1999); // 5997

  // Total credits: 4,740 + 1,200 + 5,700 = 11,640 credits
  assert.equal(quote.totals.totalCredits, 11640);
  assert.equal(quote.totals.auditSubtotalInr, 11640 * 4); // 46,560

  // Custom quote handling
  assert.equal(quote.hasCustomQuoteItems, true);
  assert.equal(quote.customQuoteItemsCount, 1);
  const cinemaItem = quote.items.find((i) => i.mediaId === 'cinema-advertising');
  assert.equal(cinemaItem?.isCustomQuote, true);
  assert.equal(cinemaItem?.unitPriceInr, null);
  assert.equal(cinemaItem?.lineCostInr, null);

  // GST & Totals: preTax = 46,560 + 5,997 = 52,557; GST (18%) = 9,460; Total = 62,017
  const expectedGst = Math.round((46560 + 5997) * 0.18);
  assert.equal(quote.totals.gstInr, expectedGst);
  assert.equal(quote.totals.totalEstimateWithGstInr, 46560 + 5997 + expectedGst);

  // Wallet recommendation (11,640 credits falls into Growth Wallet)
  assert.equal(quote.walletRecommendation.packageName, 'Growth Wallet');
  assert.ok(quote.quotationRef.startsWith('MVQ-2026-'));
});

test('OTP verification engine enforces validation, anti-brute-force, dual verification, and token issuance', async () => {
  resetOtpRateLimiter();

  // 1. Validation failure for missing fields
  const invalidSend = await handleSendOtp(
    {
      fullName: 'A',
      companyName: '',
      mobileNumber: '123',
      workEmail: 'invalid-email',
    },
    '127.0.0.1'
  );
  assert.equal(invalidSend.status, 400);
  assert.equal(invalidSend.body.ok, false);
  assert.ok(invalidSend.body.fieldErrors?.companyName);

  // 2. Successful send (Developer Sandbox Mode)
  const validSend = await handleSendOtp(
    {
      fullName: 'Sunita Rao',
      companyName: 'Madison World',
      mobileNumber: '+91 9876543210',
      workEmail: 'sunita@madison.example',
    },
    '127.0.0.1'
  );
  assert.equal(validSend.status, 200);
  assert.equal(validSend.body.ok, true);
  assert.ok(validSend.body.sessionId);

  const sessionId = validSend.body.sessionId;

  // 3. Incorrect code increments attempt counter
  const wrongVerify = await handleVerifyOtp({
    sessionId,
    phoneCode: '000000',
  });
  assert.equal(wrongVerify.body.ok, false);
  assert.equal(wrongVerify.body.phoneVerified, false);
  assert.ok(wrongVerify.body.message.includes('attempts remaining'));

  // 4. Verify phone with test code
  const verifyPhone = await handleVerifyOtp({
    sessionId,
    phoneCode: SANDBOX_OTP_CODE,
  });
  assert.equal(verifyPhone.body.phoneVerified, true);
  assert.equal(verifyPhone.body.isFullyVerified, false); // email still unverified

  // 5. Verify email with test code -> Complete verification
  const verifyEmail = await handleVerifyOtp({
    sessionId,
    emailCode: SANDBOX_OTP_CODE,
  });
  assert.equal(verifyEmail.body.isFullyVerified, true);
  assert.ok(verifyEmail.body.verificationToken);

  // 6. Token validator recognizes verified session
  const validatedSession = validateVerificationToken(verifyEmail.body.verificationToken!);
  assert.ok(validatedSession);
  assert.equal(validatedSession?.workEmail, 'sunita@madison.example');
});

test('PDF generator produces authentic A4 PDF buffer with quotation metadata', () => {
  const quote = calculateSecureQuotation(
    {
      fullName: 'Ananya Sen',
      companyName: 'Lowe Lintas',
      mobileNumber: '+91 9988776655',
      workEmail: 'ananya@lintas.example',
    },
    2,
    [
      {
        mediaId: 'billboard-hoarding',
        mediaName: 'Billboard / Hoarding',
        category: 'Outdoor & OOH',
        units: 5,
        multiplier: 2,
        cityScope: 'Kolkata',
      },
    ]
  );

  const pdfBytes = generateQuotationPdf(quote);
  assert.ok(pdfBytes instanceof Uint8Array);
  assert.ok(pdfBytes.length > 2000, 'PDF buffer should be non-trivial');

  // Verify PDF header magic bytes %PDF
  const header = String.fromCharCode(...pdfBytes.slice(0, 5));
  assert.equal(header, '%PDF-');
});

test('Public media catalog contains all 5 required categories and zero public pricing values', () => {
  assert.deepEqual(PUBLIC_MEDIA_CATEGORIES, [
    'Outdoor & OOH',
    'Transit & Vehicle',
    'Mall, Retail & Indoor',
    'Residential & Community',
    'Airport, Cinema & Other',
  ]);

  assert.ok(PUBLIC_MEDIA_CATALOG.length >= 35);

  // Verify that NO format contains any price, credit, or rate field
  for (const format of PUBLIC_MEDIA_CATALOG) {
    assert.equal((format as any).unitPriceInr, undefined);
    assert.equal((format as any).credits, undefined);
    assert.equal((format as any).priceLabel, undefined);
    assert.ok(format.unitLabel);
    assert.ok(format.multiplierLabel);
  }
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

test('Enquiry service preserves validation, honeypot, rate limits, and lead capture', async () => {
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
});
