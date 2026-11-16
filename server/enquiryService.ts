export type ValidEnquiryType =
  | 'Book a demo'
  | 'Request media-wise quote'
  | 'Request Pricing / Quotation'
  | 'Discuss pilot'
  | 'Product question';

export interface EnquiryPayload {
  fullName: string;
  workEmail: string;
  companyName: string;
  enquiryType: ValidEnquiryType;
  consent: boolean;
  consentTimestamp?: string;
  phoneNumber?: string;
  companyType?: string;
  mediaTypes?: string[];
  expectedVolume?: string;
  cities?: string;
  message?: string;
  quoteSummary?: string;
  sourcePage?: string;
  utmParams?: Record<string, string>;
  honeypot?: string;
}

export interface EnquiryBackendConfig {
  supabaseUrl?: string;
  supabaseServiceRoleKey?: string;
  webhookUrl?: string;
}

export interface EnquiryHandlerResponse {
  status: number;
  body: {
    ok: boolean;
    code:
      | 'ENQUIRY_STORED'
      | 'VALIDATION_ERROR'
      | 'RATE_LIMITED'
      | 'SPAM_REJECTED'
      | 'BACKEND_NOT_CONFIGURED'
      | 'BACKEND_ERROR';
    message: string;
    referenceId?: string;
    fieldErrors?: Record<string, string>;
    storage?: 'supabase' | 'webhook';
  };
}

const ALLOWED_ENQUIRY_TYPES: ValidEnquiryType[] = [
  'Book a demo',
  'Request media-wise quote',
  'Request Pricing / Quotation',
  'Discuss pilot',
  'Product question',
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Simple in-memory sliding-window rate limiter keyed by client IP
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_REQUESTS_PER_WINDOW = 5;
const ipHits = new Map<string, number[]>();

export function resetRateLimiter(): void {
  ipHits.clear();
}

export function checkRateLimit(clientKey: string, nowMs: number = Date.now()): boolean {
  const recent = (ipHits.get(clientKey) || []).filter((ts) => nowMs - ts < RATE_WINDOW_MS);
  if (recent.length >= MAX_REQUESTS_PER_WINDOW) {
    ipHits.set(clientKey, recent);
    return false;
  }
  recent.push(nowMs);
  ipHits.set(clientKey, recent);
  return true;
}

export function validateEnquiryPayload(
  raw: Partial<EnquiryPayload>
): { valid: true; data: EnquiryPayload } | { valid: false; fieldErrors: Record<string, string> } {
  const fieldErrors: Record<string, string> = {};

  const fullName = typeof raw.fullName === 'string' ? raw.fullName.trim() : '';
  const workEmail = typeof raw.workEmail === 'string' ? raw.workEmail.trim() : '';
  const companyName = typeof raw.companyName === 'string' ? raw.companyName.trim() : '';
  const enquiryType = raw.enquiryType;
  const consent = raw.consent === true;

  if (!fullName || fullName.length < 2 || fullName.length > 120) {
    fieldErrors.fullName = 'Please enter your full name (2–120 characters).';
  }

  if (!workEmail || !EMAIL_REGEX.test(workEmail) || workEmail.length > 160) {
    fieldErrors.workEmail = 'Please enter a valid work email address.';
  }

  if (!companyName || companyName.length < 2 || companyName.length > 160) {
    fieldErrors.companyName = 'Please enter your company or agency name.';
  }

  if (!enquiryType || !ALLOWED_ENQUIRY_TYPES.includes(enquiryType)) {
    fieldErrors.enquiryType = 'Please select a valid enquiry type.';
  }

  if (!consent) {
    fieldErrors.consent = 'Please confirm consent so our team can respond to your enquiry.';
  }

  if (typeof raw.message === 'string' && raw.message.length > 2500) {
    fieldErrors.message = 'Message must be 2,500 characters or fewer.';
  }

  if (typeof raw.phoneNumber === 'string' && raw.phoneNumber.trim().length > 30) {
    fieldErrors.phoneNumber = 'Phone number must be 30 characters or fewer.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { valid: false, fieldErrors };
  }

  const sanitizedMediaTypes = Array.isArray(raw.mediaTypes)
    ? raw.mediaTypes
        .filter((item): item is string => typeof item === 'string' && item.trim().length > 0)
        .slice(0, 30)
    : [];

  const sanitizedUtms: Record<string, string> = {};
  if (raw.utmParams && typeof raw.utmParams === 'object') {
    for (const [k, v] of Object.entries(raw.utmParams)) {
      if (k.startsWith('utm_') && typeof v === 'string' && v.trim().length > 0) {
        sanitizedUtms[k.slice(0, 40)] = v.trim().slice(0, 160);
      }
    }
  }

  return {
    valid: true,
    data: {
      fullName,
      workEmail,
      companyName,
      enquiryType: enquiryType!,
      consent: true,
      consentTimestamp:
        typeof raw.consentTimestamp === 'string' && raw.consentTimestamp
          ? raw.consentTimestamp
          : new Date().toISOString(),
      phoneNumber: typeof raw.phoneNumber === 'string' ? raw.phoneNumber.trim() : undefined,
      companyType: typeof raw.companyType === 'string' ? raw.companyType.trim().slice(0, 60) : undefined,
      mediaTypes: sanitizedMediaTypes,
      expectedVolume: typeof raw.expectedVolume === 'string' ? raw.expectedVolume.trim().slice(0, 80) : undefined,
      cities: typeof raw.cities === 'string' ? raw.cities.trim().slice(0, 200) : undefined,
      message: typeof raw.message === 'string' ? raw.message.trim().slice(0, 2500) : undefined,
      quoteSummary: typeof raw.quoteSummary === 'string' ? raw.quoteSummary.trim().slice(0, 2000) : undefined,
      sourcePage: 'mooviq',
      utmParams: sanitizedUtms,
      honeypot: typeof raw.honeypot === 'string' ? raw.honeypot : '',
    },
  };
}

export async function processEnquirySubmission(
  rawBody: Partial<EnquiryPayload>,
  clientKey: string,
  config: EnquiryBackendConfig,
  fetchImpl: typeof fetch = fetch
): Promise<EnquiryHandlerResponse> {
  // 1. Honeypot check (silent rejection or clean error for bots)
  if (typeof rawBody.honeypot === 'string' && rawBody.honeypot.trim().length > 0) {
    return {
      status: 400,
      body: {
        ok: false,
        code: 'SPAM_REJECTED',
        message: 'Submission rejected by spam filter.',
      },
    };
  }

  // 2. Rate limiting
  if (!checkRateLimit(clientKey)) {
    return {
      status: 429,
      body: {
        ok: false,
        code: 'RATE_LIMITED',
        message: 'Too many submissions from this session. Please wait a few minutes before trying again.',
      },
    };
  }

  // 3. Server-side validation
  const validation = validateEnquiryPayload(rawBody);
  if (!validation.valid) {
    return {
      status: 400,
      body: {
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Please correct the highlighted fields and try again.',
        fieldErrors: validation.fieldErrors,
      },
    };
  }

  const record = {
    created_at: new Date().toISOString(),
    source_page: 'mooviq',
    full_name: validation.data.fullName,
    work_email: validation.data.workEmail,
    company_name: validation.data.companyName,
    enquiry_type: validation.data.enquiryType,
    consent_granted: validation.data.consent,
    consent_timestamp: validation.data.consentTimestamp,
    phone_number: validation.data.phoneNumber || null,
    company_type: validation.data.companyType || null,
    media_types: validation.data.mediaTypes || [],
    expected_volume: validation.data.expectedVolume || null,
    cities: validation.data.cities || null,
    message: validation.data.message || null,
    quote_summary: validation.data.quoteSummary || null,
    utm_params: validation.data.utmParams || {},
  };

  // 4. Persist via configured server-side integration (never public client DB writes)
  if (config.supabaseUrl && config.supabaseServiceRoleKey) {
    try {
      const endpoint = `${config.supabaseUrl.replace(/\/$/, '')}/rest/v1/mooviq_enquiries`;
      const res = await fetchImpl(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: config.supabaseServiceRoleKey,
          Authorization: `Bearer ${config.supabaseServiceRoleKey}`,
          Prefer: 'return=representation',
        },
        body: JSON.stringify(record),
      });

      if (!res.ok) {
        return {
          status: 502,
          body: {
            ok: false,
            code: 'BACKEND_ERROR',
            message: 'Unable to store enquiry in the configured database right now. Please try again later.',
          },
        };
      }

      const rows = (await res.json()) as Array<{ id?: string }>;
      return {
        status: 201,
        body: {
          ok: true,
          code: 'ENQUIRY_STORED',
          message: 'Your enquiry has been recorded cleanly. Our team will review your media plan details.',
          referenceId: rows?.[0]?.id || `MQ-${Date.now()}`,
          storage: 'supabase',
        },
      };
    } catch {
      return {
        status: 502,
        body: {
          ok: false,
          code: 'BACKEND_ERROR',
          message: 'Database request failed while submitting your enquiry.',
        },
      };
    }
  }

  if (config.webhookUrl) {
    try {
      const res = await fetchImpl(config.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(record),
      });

      if (!res.ok) {
        return {
          status: 502,
          body: {
            ok: false,
            code: 'BACKEND_ERROR',
            message: 'Enquiry webhook returned an unexpected status.',
          },
        };
      }

      return {
        status: 201,
        body: {
          ok: true,
          code: 'ENQUIRY_STORED',
          message: 'Your enquiry has been dispatched to our team webhook.',
          referenceId: `MQ-WH-${Date.now()}`,
          storage: 'webhook',
        },
      };
    } catch {
      return {
        status: 502,
        body: {
          ok: false,
          code: 'BACKEND_ERROR',
          message: 'Failed to reach enquiry dispatch webhook.',
        },
      };
    }
  }

  // 5. Honest unconfigured state — NEVER fake success when nothing was stored or dispatched
  return {
    status: 503,
    body: {
      ok: false,
      code: 'BACKEND_NOT_CONFIGURED',
      message:
        'No live lead database or dispatch webhook is configured in this local preview environment. Your enquiry was NOT saved or transmitted.',
    },
  };
}

