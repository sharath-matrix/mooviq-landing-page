import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  Smartphone,
  Mail,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { trackMooviqEvent } from '../lib/analytics';

interface VerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (verifiedSession: {
    verificationToken: string;
    client: {
      fullName: string;
      companyName: string;
      mobileNumber: string;
      workEmail: string;
    };
  }) => void;
}

const COUNTRY_CODES = [
  { code: '+91', country: 'India (IN)' },
  { code: '+1', country: 'United States / Canada (US/CA)' },
  { code: '+44', country: 'United Kingdom (UK)' },
  { code: '+971', country: 'United Arab Emirates (UAE)' },
  { code: '+65', country: 'Singapore (SG)' },
  { code: '+61', country: 'Australia (AU)' },
  { code: '+49', country: 'Germany (DE)' },
];

export const VerificationModal: React.FC<VerificationModalProps> = ({
  isOpen,
  onClose,
  onVerificationComplete,
}) => {
  const [step, setStep] = useState<'contact' | 'otp'>('contact');

  // Contact fields
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [countryCode, setCountryCode] = useState('+91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [marketingConsent, setMarketingConsent] = useState(false);

  // OTP fields
  const [sessionId, setSessionId] = useState('');
  const [phoneCode, setPhoneCode] = useState('');
  const [emailCode, setEmailCode] = useState('');
  const [phoneVerified, setPhoneVerified] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(30);
  const [isSandboxMode, setIsSandboxMode] = useState(false);
  const [sandboxDevCode, setSandboxDevCode] = useState<string | null>(null);

  // Status & error states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (step === 'otp' && resendCooldown > 0) {
      timer = setTimeout(() => setResendCooldown((p) => p - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, resendCooldown]);

  if (!isOpen) return null;

  const fullMobileNumber = `${countryCode} ${phoneNumber.trim()}`;

  const handleSendCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');
    setFieldErrors({});

    try {
      const res = await fetch('/api/quote/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId || undefined,
          fullName: fullName.trim(),
          companyName: companyName.trim(),
          mobileNumber: fullMobileNumber,
          workEmail: workEmail.trim(),
          channel: 'both',
        }),
      });

      const data = await res.json();
      if (res.ok && data.ok) {
        setSessionId(data.sessionId);
        setIsSandboxMode(Boolean(data.isSandboxMode));
        if (data.sandboxDevCode) {
          setSandboxDevCode(data.sandboxDevCode);
        }
        setStep('otp');
        setResendCooldown(30);
        trackMooviqEvent('form_start', { enquiry_type: 'Quote Verification OTP Sent' });
      } else {
        if (data.fieldErrors) setFieldErrors(data.fieldErrors);
        setErrorMessage(data.message || 'Unable to send verification codes. Please check your entries.');
      }
    } catch {
      setErrorMessage('Network connection error. Please verify your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCodes = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch('/api/quote/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          phoneCode: phoneCode.trim(),
          emailCode: emailCode.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok && data.isFullyVerified && data.verificationToken) {
        setPhoneVerified(true);
        setEmailVerified(true);
        trackMooviqEvent('form_submit_success', { enquiry_type: 'Quote Verification Complete' });
        onVerificationComplete({
          verificationToken: data.verificationToken,
          client: data.client || {
            fullName: fullName.trim(),
            companyName: companyName.trim(),
            mobileNumber: fullMobileNumber,
            workEmail: workEmail.trim(),
          },
        });
      } else {
        if (data.phoneVerified) setPhoneVerified(true);
        if (data.emailVerified) setEmailVerified(true);
        setErrorMessage(data.message || 'Verification could not be completed. Please re-check the codes.');
      }
    } catch {
      setErrorMessage('Verification request failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch('/api/quote/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          fullName: fullName.trim(),
          companyName: companyName.trim(),
          mobileNumber: fullMobileNumber,
          workEmail: workEmail.trim(),
          channel: 'both',
        }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        setResendCooldown(30);
        if (data.sandboxDevCode) setSandboxDevCode(data.sandboxDevCode);
      } else {
        setErrorMessage(data.message || 'Could not resend codes.');
      }
    } catch {
      setErrorMessage('Network error during resend.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-left animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">
                {step === 'contact' ? 'Unlock Your Mooviq Quotation' : 'Verify Contact Details'}
              </h3>
              <p className="text-xs text-slate-500">
                {step === 'contact'
                  ? 'Verify your contact information to view itemized pricing & download PDF'
                  : 'Enter the 6-digit codes sent to your phone and email'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'contact' ? (
            /* STEP 1: CONTACT DETAILS */
            <form onSubmit={handleSendCodes} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name <span className="text-brand-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border ${
                    fieldErrors.fullName ? 'border-rose-500' : 'border-slate-200'
                  } focus:bg-white focus:outline-none focus:border-brand-500`}
                />
                {fieldErrors.fullName && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.fullName}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Company / Agency Name <span className="text-brand-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Omnicom Media / Tata Motors"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border ${
                    fieldErrors.companyName ? 'border-rose-500' : 'border-slate-200'
                  } focus:bg-white focus:outline-none focus:border-brand-500`}
                />
                {fieldErrors.companyName && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.companyName}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number (SMS Verification) <span className="text-brand-600">*</span>
                </label>
                <div className="flex gap-2">
                  <select
                    value={countryCode}
                    onChange={(e) => setCountryCode(e.target.value)}
                    className="w-28 px-2.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 font-medium focus:bg-white focus:outline-none"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} {c.country.split(' ')[0]}
                      </option>
                    ))}
                  </select>
                  <input
                    type="tel"
                    required
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="98765 43210"
                    className={`flex-1 px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border ${
                      fieldErrors.mobileNumber ? 'border-rose-500' : 'border-slate-200'
                    } focus:bg-white focus:outline-none focus:border-brand-500`}
                  />
                </div>
                {fieldErrors.mobileNumber && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.mobileNumber}</p>
                )}
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Business Email Address (Email Verification) <span className="text-brand-600">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={workEmail}
                  onChange={(e) => setWorkEmail(e.target.value)}
                  placeholder="name@company.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border ${
                    fieldErrors.workEmail ? 'border-rose-500' : 'border-slate-200'
                  } focus:bg-white focus:outline-none focus:border-brand-500`}
                />
                {fieldErrors.workEmail && (
                  <p className="text-[11px] text-rose-600 mt-0.5">{fieldErrors.workEmail}</p>
                )}
              </div>

              {/* Privacy Notice */}
              <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                Your contact details will be used strictly to prepare, authorize, and deliver your personalized Mooviq audit quotation. No public sharing.
              </p>

              {/* Marketing Checkbox (Optional) */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={marketingConsent}
                    onChange={(e) => setMarketingConsent(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs text-slate-600">
                    Send me periodic offline media auditing benchmarks and product updates (optional).
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Sending Codes...' : 'Send Verification Codes'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: DUAL OTP VERIFICATION */
            <form onSubmit={handleVerifyCodes} className="space-y-4">
              {isSandboxMode && (
                <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block font-bold">Developer Sandbox Mode Active</strong>
                    <span>
                      Live SMS &amp; Email gateways are in preview mode. Use test verification code{' '}
                      <code className="px-1.5 py-0.5 bg-amber-200/80 rounded font-bold font-mono">
                        {sandboxDevCode || '849201'}
                      </code>{' '}
                      for both fields below.
                    </span>
                  </div>
                </div>
              )}

              {/* Phone OTP Field */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Smartphone className="w-4 h-4 text-brand-600" />
                    <span>Mobile SMS Code</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{fullMobileNumber}</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={phoneCode}
                    onChange={(e) => setPhoneCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit mobile OTP"
                    className="flex-1 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-widest text-center bg-white border border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                  {phoneVerified && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 px-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Email OTP Field */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900">
                    <Mail className="w-4 h-4 text-brand-600" />
                    <span>Business Email Code</span>
                  </div>
                  <span className="text-slate-500 font-mono text-[11px]">{workEmail}</span>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    required
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value.replace(/\D/g, ''))}
                    placeholder="Enter 6-digit email OTP"
                    className="flex-1 px-3.5 py-2.5 rounded-xl text-sm font-mono tracking-widest text-center bg-white border border-slate-200 focus:outline-none focus:border-brand-500"
                  />
                  {emailVerified && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 px-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Verified</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Verification Actions */}
              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <button
                  type="button"
                  onClick={() => setStep('contact')}
                  className="hover:text-slate-800 underline cursor-pointer"
                >
                  Edit phone or email
                </button>

                <button
                  type="button"
                  onClick={handleResend}
                  disabled={resendCooldown > 0 || isLoading}
                  className="flex items-center gap-1 font-semibold text-brand-600 hover:text-brand-700 disabled:opacity-40 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>
                    {resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend Codes'}
                  </span>
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Verifying...' : 'Verify & Unlock Quotation'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
