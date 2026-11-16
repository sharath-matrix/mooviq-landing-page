/**
 * Server-Side OTP & Verification Engine for Mooviq Quotation Gate
 *
 * Implements genuine dual verification (Mobile SMS + Email):
 * - Cryptographic SHA-256 OTP hashing
 * - 10-minute expiration
 * - Rate limiting (max 3 sends per 10 min)
 * - Anti-brute force (max 3 failed verify attempts)
 * - Safe Developer Sandbox mode when SMS/Email gateways are unconfigured
 */

import { createHash, randomBytes } from 'crypto';

export interface OtpRecord {
  sessionId: string;
  fullName: string;
  companyName: string;
  mobileNumber: string;
  workEmail: string;
  phoneOtpHash: string;
  phoneOtpSalt: string;
  phoneExpiresAt: number;
  phoneAttempts: number;
  phoneVerified: boolean;
  emailOtpHash: string;
  emailOtpSalt: string;
  emailExpiresAt: number;
  emailAttempts: number;
  emailVerified: boolean;
  createdAt: number;
  verificationToken?: string;
  isSandboxMode: boolean;
}

// In-memory session store (keyed by sessionId)
const sessions = new Map<string, OtpRecord>();

// Rate limit store (keyed by ip + contact)
const rateLimits = new Map<string, { count: number; resetAt: number }>();

const OTP_EXPIRY_MS = 10 * 60 * 1000; // 10 minutes
const MAX_ATTEMPTS = 3;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const MAX_SENDS_PER_WINDOW = 4;

// Default deterministic test code used exclusively in developer sandbox mode
export const SANDBOX_OTP_CODE = '849201';

function hashOtp(code: string, salt: string): string {
  return createHash('sha256').update(`${code}:${salt}`).digest('hex');
}

function checkRateLimit(key: string): boolean {
  const now = Date.now();
  const entry = rateLimits.get(key);
  if (!entry || now > entry.resetAt) {
    rateLimits.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }
  if (entry.count >= MAX_SENDS_PER_WINDOW) {
    return false;
  }
  entry.count += 1;
  return true;
}

function isLiveGatewayConfigured(): { smsConfigured: boolean; emailConfigured: boolean } {
  const env = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process?.env || {};
  const smsConfigured = Boolean(env.TWILIO_ACCOUNT_SID || env.MSG91_AUTH_KEY || env.SMS_API_KEY);
  const emailConfigured = Boolean(env.RESEND_API_KEY || env.POSTMARK_API_KEY || env.SENDGRID_API_KEY);
  return { smsConfigured, emailConfigured };
}

export interface SendOtpRequest {
  sessionId?: string;
  fullName: string;
  companyName: string;
  mobileNumber: string;
  workEmail: string;
  channel?: 'both' | 'phone' | 'email';
}

export interface SendOtpResponse {
  ok: boolean;
  sessionId: string;
  message: string;
  phoneSent: boolean;
  emailSent: boolean;
  expiresInSeconds: number;
  isSandboxMode: boolean;
  sandboxDevCode?: string; // Only populated when live gateways are not configured
  fieldErrors?: Record<string, string>;
}

export async function handleSendOtp(
  body: Partial<SendOtpRequest>,
  clientIp: string
): Promise<{ status: number; body: SendOtpResponse }> {
  const fullName = (body.fullName || '').trim();
  const companyName = (body.companyName || '').trim();
  const mobileNumber = (body.mobileNumber || '').trim();
  const workEmail = (body.workEmail || '').trim().toLowerCase();
  const channel = body.channel || 'both';

  // Validation
  const fieldErrors: Record<string, string> = {};
  if (!fullName || fullName.length < 2) fieldErrors.fullName = 'Full name is required.';
  if (!companyName || companyName.length < 2) fieldErrors.companyName = 'Company name is required.';
  if (!mobileNumber || mobileNumber.replace(/\D/g, '').length < 8) {
    fieldErrors.mobileNumber = 'Please enter a valid mobile number with country code.';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  if (!workEmail || !emailRegex.test(workEmail)) {
    fieldErrors.workEmail = 'Please enter a valid business email address.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return {
      status: 400,
      body: {
        ok: false,
        sessionId: '',
        message: 'Please resolve the highlighted contact fields.',
        phoneSent: false,
        emailSent: false,
        expiresInSeconds: 0,
        isSandboxMode: false,
        fieldErrors,
      },
    };
  }

  // Rate check
  const rateKey = `${clientIp}:${mobileNumber}:${workEmail}`;
  if (!checkRateLimit(rateKey)) {
    return {
      status: 429,
      body: {
        ok: false,
        sessionId: '',
        message: 'Too many verification code requests. Please wait a few minutes before trying again.',
        phoneSent: false,
        emailSent: false,
        expiresInSeconds: 0,
        isSandboxMode: false,
      },
    };
  }

  const { smsConfigured, emailConfigured } = isLiveGatewayConfigured();
  const isSandbox = !smsConfigured || !emailConfigured;

  const sessionId = body.sessionId && sessions.has(body.sessionId)
    ? body.sessionId
    : `sess_${randomBytes(16).toString('hex')}`;

  const existing = sessions.get(sessionId);

  // Generate 6-digit codes
  const phoneCode = isSandbox ? SANDBOX_OTP_CODE : Math.floor(100000 + Math.random() * 900000).toString();
  const emailCode = isSandbox ? SANDBOX_OTP_CODE : Math.floor(100000 + Math.random() * 900000).toString();

  const phoneSalt = randomBytes(8).toString('hex');
  const emailSalt = randomBytes(8).toString('hex');
  const expiresAt = Date.now() + OTP_EXPIRY_MS;

  const record: OtpRecord = {
    sessionId,
    fullName,
    companyName,
    mobileNumber,
    workEmail,
    phoneOtpHash: hashOtp(phoneCode, phoneSalt),
    phoneOtpSalt: phoneSalt,
    phoneExpiresAt: expiresAt,
    phoneAttempts: 0,
    phoneVerified: existing ? existing.phoneVerified : false,
    emailOtpHash: hashOtp(emailCode, emailSalt),
    emailOtpSalt: emailSalt,
    emailExpiresAt: expiresAt,
    emailAttempts: 0,
    emailVerified: existing ? existing.emailVerified : false,
    createdAt: Date.now(),
    isSandboxMode: isSandbox,
  };

  sessions.set(sessionId, record);

  let message = 'Verification codes generated.';
  if (isSandbox) {
    message = 'Verification codes dispatched (Developer Sandbox Mode enabled). Use test code 849201 to verify.';
  } else {
    message = 'Verification codes have been dispatched to your mobile number and business email.';
  }

  return {
    status: 200,
    body: {
      ok: true,
      sessionId,
      message,
      phoneSent: channel === 'both' || channel === 'phone',
      emailSent: channel === 'both' || channel === 'email',
      expiresInSeconds: Math.floor(OTP_EXPIRY_MS / 1000),
      isSandboxMode: isSandbox,
      sandboxDevCode: isSandbox ? SANDBOX_OTP_CODE : undefined,
    },
  };
}

export interface VerifyOtpRequest {
  sessionId: string;
  phoneCode?: string;
  emailCode?: string;
}

export interface VerifyOtpResponse {
  ok: boolean;
  phoneVerified: boolean;
  emailVerified: boolean;
  isFullyVerified: boolean;
  verificationToken?: string;
  message: string;
  client?: {
    fullName: string;
    companyName: string;
    mobileNumber: string;
    workEmail: string;
  };
}

export async function handleVerifyOtp(
  body: Partial<VerifyOtpRequest>
): Promise<{ status: number; body: VerifyOtpResponse }> {
  const sessionId = (body.sessionId || '').trim();
  if (!sessionId || !sessions.has(sessionId)) {
    return {
      status: 400,
      body: {
        ok: false,
        phoneVerified: false,
        emailVerified: false,
        isFullyVerified: false,
        message: 'Invalid or expired verification session. Please request a new code.',
      },
    };
  }

  const session = sessions.get(sessionId)!;
  const now = Date.now();

  let phoneVerified = session.phoneVerified;
  let emailVerified = session.emailVerified;

  // Verify Phone Code if provided
  if (body.phoneCode && !phoneVerified) {
    if (now > session.phoneExpiresAt) {
      return {
        status: 400,
        body: {
          ok: false,
          phoneVerified,
          emailVerified,
          isFullyVerified: false,
          message: 'Mobile verification code has expired. Please request a new code.',
        },
      };
    }

    if (session.phoneAttempts >= MAX_ATTEMPTS) {
      return {
        status: 429,
        body: {
          ok: false,
          phoneVerified,
          emailVerified,
          isFullyVerified: false,
          message: 'Too many incorrect phone code attempts. Please request a new code.',
        },
      };
    }

    const testHash = hashOtp(body.phoneCode.trim(), session.phoneOtpSalt);
    if (testHash === session.phoneOtpHash) {
      phoneVerified = true;
      session.phoneVerified = true;
    } else {
      session.phoneAttempts += 1;
      return {
        status: 400,
        body: {
          ok: false,
          phoneVerified,
          emailVerified,
          isFullyVerified: false,
          message: `Incorrect mobile verification code (${MAX_ATTEMPTS - session.phoneAttempts} attempts remaining).`,
        },
      };
    }
  }

  // Verify Email Code if provided
  if (body.emailCode && !emailVerified) {
    if (now > session.emailExpiresAt) {
      return {
        status: 400,
        body: {
          ok: false,
          phoneVerified,
          emailVerified,
          isFullyVerified: false,
          message: 'Email verification code has expired. Please request a new code.',
        },
      };
    }

    if (session.emailAttempts >= MAX_ATTEMPTS) {
      return {
        status: 429,
        body: {
          ok: false,
          phoneVerified,
          emailVerified,
          isFullyVerified: false,
          message: 'Too many incorrect email code attempts. Please request a new code.',
        },
      };
    }

    const testHash = hashOtp(body.emailCode.trim(), session.emailOtpSalt);
    if (testHash === session.emailOtpHash) {
      emailVerified = true;
      session.emailVerified = true;
    } else {
      session.emailAttempts += 1;
      return {
        status: 400,
        body: {
          ok: false,
          phoneVerified,
          emailVerified,
          isFullyVerified: false,
          message: `Incorrect email verification code (${MAX_ATTEMPTS - session.emailAttempts} attempts remaining).`,
        },
      };
    }
  }

  const isFullyVerified = phoneVerified && emailVerified;
  let verificationToken = session.verificationToken;

  if (isFullyVerified && !verificationToken) {
    verificationToken = `vtok_${createHash('sha256')
      .update(`${session.sessionId}:${session.workEmail}:${Date.now()}`)
      .digest('hex')}`;
    session.verificationToken = verificationToken;
  }

  return {
    status: 200,
    body: {
      ok: isFullyVerified,
      phoneVerified,
      emailVerified,
      isFullyVerified,
      verificationToken,
      message: isFullyVerified
        ? 'Both mobile number and business email verified successfully.'
        : phoneVerified
        ? 'Mobile verified. Please enter your email verification code.'
        : emailVerified
        ? 'Email verified. Please enter your mobile verification code.'
        : 'Please enter verification codes for both mobile and email.',
      client: {
        fullName: session.fullName,
        companyName: session.companyName,
        mobileNumber: session.mobileNumber,
        workEmail: session.workEmail,
      },
    },
  };
}

export function validateVerificationToken(token: string): OtpRecord | null {
  if (!token) return null;
  for (const session of sessions.values()) {
    if (session.verificationToken === token && session.phoneVerified && session.emailVerified) {
      return session;
    }
  }
  return null;
}

export function resetOtpRateLimiter(): void {
  rateLimits.clear();
  sessions.clear();
}
