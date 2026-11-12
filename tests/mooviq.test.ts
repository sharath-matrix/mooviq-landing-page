import test from 'node:test';
import assert from 'node:assert/strict';

import {
  DASHBOARD_ACCESS_PACKAGES,
  APPROVED_PER_MEDIA_RATES,
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
import { calculateQuoteBreakdown } from '../src/lib/quoteCalculator.ts';
import {
  processEnquirySubmission,
  resetRateLimiter,
} from '../server/enquiryService.ts';

test('Dashboard access pricing uses approved proposed tiers and omits old overage model', () => {
  const expected: Record<string, number | null> = {
    'single-user': 2299,
    team: 6499,
    agency: 9999,
    'enterprise-team': 18999,
    'custom-enterprise': null,
  };

  for (const [id, fee] of Object.entries(expected)) {
    const pkg = DASHBOARD_ACCESS_PACKAGES.find((p) => p.id === id);
    assert.ok(pkg, `Expected dashboard package ${id}`);
    assert.equal(pkg.monthlyPriceInr, fee);
  }

  assert.equal(Object.keys(APPROVED_PER_MEDIA_RATES).length, 0);
});

test('Multi-media catalog includes all 4 families and non-universal verification modes', () => {
  assert.equal(MEDIA_FAMILIES.length, 4);
  for (const family of MEDIA_FAMILIES) {
    const items = MEDIA_CATALOG.filter((m) => m.familyId === family.id);
    assert.ok(items.length >= 6, `Expected >=6 items in family ${family.id}`);
  }

  const cinema = MEDIA_CATALOG.find((m) => m.id === 'cinema-on-screen');
  assert.equal(cinema?.workflowStatus, 'Log-based verification (integration required)');
});

test('Quote builder computes mixed media audit events accurately and flags unpriced items', () => {
  const result = calculateQuoteBreakdown('agency', [
    {
      id: '1',
      familyId: 'transit-vehicle',
      mediaTypeId: 'auto-branding',
      units: 100,
      rounds: 2,
      cityScope: 'Bengaluru',
    },
    {
      id: '2',
      familyId: 'outdoor-ooh',
      mediaTypeId: 'billboards-hoardings',
      units: 15,
      rounds: 3,
      cityScope: 'Delhi',
    },
    {
      id: '3',
      familyId: 'screen-broadcast',
      mediaTypeId: 'cinema-on-screen',
      units: 20,
      rounds: 4,
      cityScope: 'Pune',
    },
  ]);

  assert.equal(result.dashboardMonthlyInr, 9999);
  assert.equal(result.totalMediaUnits, 135);
  assert.equal(result.totalAuditEvents, 100 * 2 + 15 * 3 + 20 * 4);
  assert.equal(result.hasUnpricedItems, true);
  assert.equal(result.partialServiceSubtotalInr, 0);
  result.rows.forEach((row) => assert.equal(row.lineSubtotalInr, null));
});

test('Quote builder computes partial subtotal cleanly when an approved rate config is provided', () => {
  const partialRates = {
    'billboards-hoardings': {
      mediaId: 'billboards-hoardings',
      unitPriceInr: 450,
      serviceUnit: 'per site audit',
      taxNote: 'Before GST',
      effectiveDate: '2026-11-01',
    },
  };

  const result = calculateQuoteBreakdown(
    'team',
    [
      {
        id: '1',
        familyId: 'outdoor-ooh',
        mediaTypeId: 'billboards-hoardings',
        units: 10,
        rounds: 2,
        cityScope: 'Mumbai',
      },
      {
        id: '2',
        familyId: 'screen-broadcast',
        mediaTypeId: 'cinema-on-screen',
        units: 5,
        rounds: 2,
        cityScope: 'Pune',
      },
    ],
    partialRates
  );

  assert.equal(result.dashboardMonthlyInr, 6499);
  assert.equal(result.pricedRowsCount, 1);
  assert.equal(result.unpricedRowsCount, 1);
  assert.equal(result.partialServiceSubtotalInr, 20 * 450);
  assert.equal(result.hasUnpricedItems, true);
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
      enquiryType: 'Book a demo',
      consent: false,
    },
    'ip-1',
    {}
  );
  assert.equal(missingConsent.status, 400);
  assert.equal(missingConsent.body.code, 'VALIDATION_ERROR');
  assert.ok(missingConsent.body.fieldErrors?.consent);

  const spamBot = await processEnquirySubmission(
    {
      fullName: 'Bot',
      workEmail: 'bot@spam.example',
      companyName: 'Spam Co',
      enquiryType: 'Book a demo',
      consent: true,
      honeypot: 'http://spam.link',
    },
    'ip-2',
    {}
  );
  assert.equal(spamBot.status, 400);
  assert.equal(spamBot.body.code, 'SPAM_REJECTED');

  const unconfigured = await processEnquirySubmission(
    {
      fullName: 'Asha Rao',
      workEmail: 'asha@brand.example',
      companyName: 'Northstar',
      enquiryType: 'Request media-wise quote',
      consent: true,
    },
    'ip-3',
    {}
  );
  assert.equal(unconfigured.status, 503);
  assert.equal(unconfigured.body.ok, false);
  assert.equal(unconfigured.body.code, 'BACKEND_NOT_CONFIGURED');

  // Mocked Supabase success + rate limiting after 5 hits
  const mockFetch = async () =>
    new Response(JSON.stringify([{ id: 'enq-123' }]), { status: 201 });

  for (let i = 0; i < 5; i++) {
    const okRes = await processEnquirySubmission(
      {
        fullName: 'Asha Rao',
        workEmail: 'asha@brand.example',
        companyName: 'Northstar',
        enquiryType: 'Book a demo',
        consent: true,
      },
      'ip-4',
      { supabaseUrl: 'https://example.supabase.co', supabaseServiceRoleKey: 'secret' },
      mockFetch
    );
    assert.equal(okRes.status, 201);
    assert.equal(okRes.body.code, 'ENQUIRY_STORED');
  }

  const rateLimited = await processEnquirySubmission(
    {
      fullName: 'Asha Rao',
      workEmail: 'asha@brand.example',
      companyName: 'Northstar',
      enquiryType: 'Book a demo',
      consent: true,
    },
    'ip-4',
    { supabaseUrl: 'https://example.supabase.co', supabaseServiceRoleKey: 'secret' },
    mockFetch
  );
  assert.equal(rateLimited.status, 429);
  assert.equal(rateLimited.body.code, 'RATE_LIMITED');
});
