import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  AlertCircle,
  Send,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Layers,
  ClipboardCheck,
} from 'lucide-react';
import { EnquiryType, QuotePrefillPayload } from '../types/mooviq';
import { MEDIA_CATALOG } from '../config/mediaAuditCatalog';
import { trackMooviqEvent } from '../lib/analytics';

interface ContactSectionProps {
  prefill?: QuotePrefillPayload | null;
}

type SubmitOutcome =
  | { kind: 'idle' }
  | { kind: 'stored'; referenceId: string; message: string }
  | { kind: 'unconfigured'; message: string; copyText: string }
  | { kind: 'error'; message: string };

const FEATURED_MEDIA_CHIPS = [
  'Billboards / Hoardings',
  'Digital OOH Screens',
  'Auto Branding',
  'Cab Branding',
  'Mall Media',
  'Lift Lobbies',
  'Airports',
  'Cinema On-Screen Ads',
  'Radio',
  'Television',
  'Print Media',
  'Activation / Event Campaigns',
];

export const ContactSection: React.FC<ContactSectionProps> = ({ prefill }) => {
  const [fullName, setFullName] = useState('');
  const [workEmail, setWorkEmail] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [enquiryType, setEnquiryType] = useState<EnquiryType>('Book a demo');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [companyType, setCompanyType] = useState('');
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>([]);
  const [expectedVolume, setExpectedVolume] = useState('');
  const [cities, setCities] = useState('');
  const [message, setMessage] = useState('');
  const [quoteSummary, setQuoteSummary] = useState('');
  const [consent, setConsent] = useState(false);
  const [honeypot, setHoneypot] = useState('');

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outcome, setOutcome] = useState<SubmitOutcome>({ kind: 'idle' });
  const [copiedFallback, setCopiedFallback] = useState(false);
  const hasStartedFormRef = useRef(false);
  const lastSubmittedFingerprintRef = useRef<string | null>(null);

  // Sync prefill from Hero, Pricing, MediaCoverage, or QuoteBuilder
  useEffect(() => {
    if (!prefill) return;
    setEnquiryType(prefill.enquiryType);

    if (prefill.selectedMediaNames && prefill.selectedMediaNames.length > 0) {
      setSelectedMediaTypes(prefill.selectedMediaNames);
    }
    if (prefill.totalAuditEvents !== undefined && prefill.totalAuditEvents > 0) {
      setExpectedVolume(`${prefill.totalAuditEvents.toLocaleString()} estimated audit events`);
    }
    if (prefill.cityScope) {
      setCities(prefill.cityScope);
    }
    if (prefill.summaryText) {
      setQuoteSummary(prefill.summaryText);
    }
    if (prefill.dashboardPlanLabel && !prefill.summaryText) {
      setMessage((prev) =>
        prev.trim()
          ? prev
          : `Interested in ${prefill.dashboardPlanLabel}. Please share onboarding details.`
      );
    }
    setOutcome({ kind: 'idle' });
  }, [prefill]);

  const markFormStarted = () => {
    if (!hasStartedFormRef.current) {
      hasStartedFormRef.current = true;
      trackMooviqEvent('form_start', { enquiry_type: enquiryType });
    }
  };

  const toggleMediaChip = (mediaName: string) => {
    markFormStarted();
    setSelectedMediaTypes((prev) =>
      prev.includes(mediaName)
        ? prev.filter((item) => item !== mediaName)
        : [...prev, mediaName]
    );
  };

  const validateClientSide = (): Record<string, string> => {
    const errors: Record<string, string> = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

    if (!fullName.trim() || fullName.trim().length < 2) {
      errors.fullName = 'Please enter your full name.';
    }
    if (!workEmail.trim() || !emailRegex.test(workEmail.trim())) {
      errors.workEmail = 'Please enter a valid work email address.';
    }
    if (!companyName.trim() || companyName.trim().length < 2) {
      errors.companyName = 'Please enter your company or agency name.';
    }
    if (!consent) {
      errors.consent = 'Consent is required before submitting your details.';
    }
    return errors;
  };

  const getUtmParams = (): Record<string, string> => {
    if (typeof window === 'undefined') return {};
    const params = new URLSearchParams(window.location.search);
    const utms: Record<string, string> = {};
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
      const val = params.get(key);
      if (val) utms[key] = val;
    });
    return utms;
  };

  const buildStructuredCopyText = () => {
    return [
      `Mooviq Enquiry (${enquiryType})`,
      `Name: ${fullName.trim()}`,
      `Work Email: ${workEmail.trim()}`,
      `Company: ${companyName.trim()}${companyType ? ` (${companyType})` : ''}`,
      phoneNumber.trim() ? `Phone: ${phoneNumber.trim()}` : null,
      selectedMediaTypes.length > 0 ? `Media Types: ${selectedMediaTypes.join(', ')}` : null,
      expectedVolume.trim() ? `Expected Volume: ${expectedVolume.trim()}` : null,
      cities.trim() ? `Cities: ${cities.trim()}` : null,
      quoteSummary.trim() ? `\nQuote Summary:\n${quoteSummary.trim()}` : null,
      message.trim() ? `\nMessage:\n${message.trim()}` : null,
    ]
      .filter(Boolean)
      .join('\n');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const clientErrors = validateClientSide();
    if (Object.keys(clientErrors).length > 0) {
      setFieldErrors(clientErrors);
      setOutcome({ kind: 'error', message: 'Please review the highlighted fields before submitting.' });
      trackMooviqEvent('form_submit_error', { reason: 'client_validation' });
      return;
    }

    const fingerprint = JSON.stringify({
      fullName: fullName.trim(),
      workEmail: workEmail.trim(),
      companyName: companyName.trim(),
      enquiryType,
      quoteSummary: quoteSummary.trim(),
      message: message.trim(),
    });

    if (lastSubmittedFingerprintRef.current === fingerprint && outcome.kind === 'stored') {
      setOutcome({
        kind: 'error',
        message: 'This identical enquiry has already been submitted.',
      });
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setOutcome({ kind: 'idle' });

    const endpoint =
      (import.meta as { env?: Record<string, string | undefined> }).env?.VITE_ENQUIRY_ENDPOINT ||
      '/api/enquiry';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName: fullName.trim(),
          workEmail: workEmail.trim(),
          companyName: companyName.trim(),
          enquiryType,
          consent: true,
          consentTimestamp: new Date().toISOString(),
          phoneNumber: phoneNumber.trim() || undefined,
          companyType: companyType || undefined,
          mediaTypes: selectedMediaTypes,
          expectedVolume: expectedVolume.trim() || undefined,
          cities: cities.trim() || undefined,
          message: message.trim() || undefined,
          quoteSummary: quoteSummary.trim() || undefined,
          sourcePage: 'mooviq',
          utmParams: getUtmParams(),
          honeypot,
        }),
      });

      const data = (await response.json().catch(() => null)) as {
        ok?: boolean;
        code?: string;
        message?: string;
        referenceId?: string;
        fieldErrors?: Record<string, string>;
      } | null;

      if (response.ok && data?.ok && data.code === 'ENQUIRY_STORED') {
        lastSubmittedFingerprintRef.current = fingerprint;
        setOutcome({
          kind: 'stored',
          referenceId: data.referenceId || 'Recorded',
          message: data.message || 'Your enquiry has been recorded.',
        });
        trackMooviqEvent('form_submit_success', { enquiry_type: enquiryType });
      } else if (response.status === 503 || data?.code === 'BACKEND_NOT_CONFIGURED') {
        setOutcome({
          kind: 'unconfigured',
          message:
            data?.message ||
            'No live lead backend is configured in this local environment. Nothing was stored or sent.',
          copyText: buildStructuredCopyText(),
        });
        trackMooviqEvent('form_submit_error', { reason: 'backend_not_configured' });
      } else {
        if (data?.fieldErrors) setFieldErrors(data.fieldErrors);
        setOutcome({
          kind: 'error',
          message: data?.message || 'Unable to submit your enquiry right now. Please check your entries.',
        });
        trackMooviqEvent('form_submit_error', { reason: data?.code || `http_${response.status}` });
      }
    } catch {
      setOutcome({
        kind: 'unconfigured',
        message:
          'Could not reach an active enquiry backend endpoint from this environment. Your submission was NOT stored or dispatched.',
        copyText: buildStructuredCopyText(),
      });
      trackMooviqEvent('form_submit_error', { reason: 'network_unavailable' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyFallback = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedFallback(true);
      setTimeout(() => setCopiedFallback(false), 2000);
    } catch {
      // Ignore if clipboard unavailable
    }
  };

  // Extra format options for dropdown/checklist completeness
  const allFormatCount = MEDIA_CATALOG.length;

  return (
    <section id="contact" className="scroll-mt-20 py-16 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start text-left">
          {/* Left Column: Value Proposition */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                Get Started
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Let’s plan your media audits
              </h2>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                Share your active advertising formats, cities, and reporting goals to schedule a walkthrough or request a tailored media-wise audit quote.
              </p>
            </div>

            <div className="space-y-3.5 pt-2">
              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center shrink-0">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Tailored across {allFormatCount} media formats
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Configure checklists for static OOH, transit wraps, digital screens, or playout log reconciliations.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                  <ClipboardCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Clear dashboard vs audit-service scoping
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Select dashboard access tiers separately from regional onsite visits or remote log audits.
                  </p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-slate-200/90 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900">
                    Pilot-first onboarding options
                  </h3>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    Validate verification workflows on a single campaign scope before multi-city expansion.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-xs text-slate-500">
              <p>
                Mooviq is built by{' '}
                <a
                  href="https://erazero.ai/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-800 hover:text-brand-600 underline decoration-slate-300"
                >
                  EraZero AI
                </a>
                . You can also reach EraZero directly at{' '}
                <a
                  href="https://erazero.ai/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-semibold text-brand-600 hover:underline"
                >
                  <span>erazero.ai/contact</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                .
              </p>
            </div>
          </div>

          {/* Right Column: Accessible Lead Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm">
            <form onSubmit={handleSubmit} noValidate className="space-y-5">
              {/* Honeypot anti-spam field */}
              <div className="hidden" aria-hidden="true">
                <label htmlFor="mooviq-website-hp">Leave this field empty</label>
                <input
                  id="mooviq-website-hp"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={honeypot}
                  onChange={(e) => setHoneypot(e.target.value)}
                />
              </div>

              {/* Enquiry Type Selector */}
              <div>
                <label htmlFor="enquiry-type" className="text-xs font-bold text-slate-700 block mb-1.5">
                  Enquiry Type <span className="text-brand-600">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(
                    [
                      'Book a demo',
                      'Request media-wise quote',
                      'Discuss pilot',
                      'Product question',
                    ] as EnquiryType[]
                  ).map((typeOpt) => (
                    <button
                      key={typeOpt}
                      type="button"
                      onClick={() => {
                        markFormStarted();
                        setEnquiryType(typeOpt);
                      }}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-colors cursor-pointer ${
                        enquiryType === typeOpt
                          ? 'bg-slate-900 text-white border-slate-900'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {typeOpt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Required Contact Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="full-name" className="text-xs font-bold text-slate-700 block mb-1">
                    Full Name <span className="text-brand-600">*</span>
                  </label>
                  <input
                    id="full-name"
                    type="text"
                    required
                    aria-invalid={Boolean(fieldErrors.fullName)}
                    value={fullName}
                    onFocus={markFormStarted}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (fieldErrors.fullName) setFieldErrors((p) => ({ ...p, fullName: '' }));
                    }}
                    placeholder="Your name"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border focus:bg-white focus:outline-none ${
                      fieldErrors.fullName ? 'border-rose-500' : 'border-slate-200 focus:border-brand-500'
                    }`}
                  />
                  {fieldErrors.fullName && (
                    <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.fullName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="work-email" className="text-xs font-bold text-slate-700 block mb-1">
                    Work Email <span className="text-brand-600">*</span>
                  </label>
                  <input
                    id="work-email"
                    type="email"
                    required
                    aria-invalid={Boolean(fieldErrors.workEmail)}
                    value={workEmail}
                    onFocus={markFormStarted}
                    onChange={(e) => {
                      setWorkEmail(e.target.value);
                      if (fieldErrors.workEmail) setFieldErrors((p) => ({ ...p, workEmail: '' }));
                    }}
                    placeholder="name@company.com"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border focus:bg-white focus:outline-none ${
                      fieldErrors.workEmail ? 'border-rose-500' : 'border-slate-200 focus:border-brand-500'
                    }`}
                  />
                  {fieldErrors.workEmail && (
                    <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.workEmail}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company-name" className="text-xs font-bold text-slate-700 block mb-1">
                    Company / Agency Name <span className="text-brand-600">*</span>
                  </label>
                  <input
                    id="company-name"
                    type="text"
                    required
                    aria-invalid={Boolean(fieldErrors.companyName)}
                    value={companyName}
                    onFocus={markFormStarted}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                      if (fieldErrors.companyName) setFieldErrors((p) => ({ ...p, companyName: '' }));
                    }}
                    placeholder="Organization name"
                    className={`w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border focus:bg-white focus:outline-none ${
                      fieldErrors.companyName ? 'border-rose-500' : 'border-slate-200 focus:border-brand-500'
                    }`}
                  />
                  {fieldErrors.companyName && (
                    <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.companyName}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="company-type" className="text-xs font-bold text-slate-700 block mb-1">
                    Organization Type (Optional)
                  </label>
                  <select
                    id="company-type"
                    value={companyType}
                    onFocus={markFormStarted}
                    onChange={(e) => setCompanyType(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
                  >
                    <option value="">Select role...</option>
                    <option value="Brand">Brand / Advertiser</option>
                    <option value="Agency">Media Agency</option>
                    <option value="Media owner">Media Owner / Network</option>
                    <option value="Audit operations">Audit Operations Partner</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              {/* Optional Phone, Volume, Cities */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="phone-number" className="text-xs font-bold text-slate-700 block mb-1">
                    Phone Number (Optional)
                  </label>
                  <input
                    id="phone-number"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+91 ..."
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="expected-volume" className="text-xs font-bold text-slate-700 block mb-1">
                    Expected Audit Volume
                  </label>
                  <input
                    id="expected-volume"
                    type="text"
                    value={expectedVolume}
                    onChange={(e) => setExpectedVolume(e.target.value)}
                    placeholder="e.g. 200 sites / month"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="target-cities" className="text-xs font-bold text-slate-700 block mb-1">
                    Target Cities
                  </label>
                  <input
                    id="target-cities"
                    type="text"
                    value={cities}
                    onChange={(e) => setCities(e.target.value)}
                    placeholder="e.g. Mumbai, Delhi"
                    className="w-full px-3.5 py-2 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              {/* Multi-Select Media Format Chips */}
              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1.5">
                  Media Formats of Interest (Optional multi-select)
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {FEATURED_MEDIA_CHIPS.map((media) => {
                    const selected = selectedMediaTypes.includes(media);
                    return (
                      <button
                        key={media}
                        type="button"
                        onClick={() => toggleMediaChip(media)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-colors cursor-pointer ${
                          selected
                            ? 'bg-brand-600 text-white border-brand-600'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {media}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Editable Quote Builder Summary (appears when prefilled or edited) */}
              {quoteSummary && (
                <div>
                  <label htmlFor="quote-summary" className="text-xs font-bold text-slate-700 block mb-1">
                    Attached Quote Builder Summary (Editable)
                  </label>
                  <textarea
                    id="quote-summary"
                    rows={4}
                    value={quoteSummary}
                    onChange={(e) => setQuoteSummary(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs font-mono bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-800"
                  />
                </div>
              )}

              {/* Message */}
              <div>
                <label htmlFor="enquiry-message" className="text-xs font-bold text-slate-700 block mb-1">
                  Requirements / Message (Optional)
                </label>
                <textarea
                  id="enquiry-message"
                  rows={3}
                  value={message}
                  onFocus={markFormStarted}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share campaign timelines, checklist requirements, or questions about log integrations..."
                  className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none text-slate-900"
                />
              </div>

              {/* Consent Checkbox */}
              <div>
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => {
                      setConsent(e.target.checked);
                      if (fieldErrors.consent) setFieldErrors((p) => ({ ...p, consent: '' }));
                    }}
                    className="mt-0.5 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I agree to let EraZero / Mooviq review these details to respond to my enquiry.{' '}
                    <span className="text-brand-600">*</span>
                  </span>
                </label>
                {fieldErrors.consent && (
                  <p className="text-[11px] text-rose-600 mt-1">{fieldErrors.consent}</p>
                )}
              </div>

              {/* Honest Outcome Banners */}
              {outcome.kind === 'stored' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Enquiry Recorded ({outcome.referenceId})</span>
                    <span>{outcome.message}</span>
                  </div>
                </div>
              )}

              {outcome.kind === 'unconfigured' && (
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-3">
                  <div className="flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold block">
                        Enquiry NOT saved or sent (Backend unconfigured in local preview)
                      </span>
                      <span>{outcome.message}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => handleCopyFallback(outcome.copyText)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-amber-300 text-amber-950 font-semibold hover:bg-amber-100/60 cursor-pointer"
                    >
                      {copiedFallback ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Structured summary copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy structured enquiry</span>
                        </>
                      )}
                    </button>
                    <a
                      href="https://erazero.ai/contact/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800"
                    >
                      <span>Open erazero.ai/contact</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              )}

              {outcome.kind === 'error' && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{outcome.message}</span>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm shadow-md shadow-brand-600/20 transition-all cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting enquiry...' : `Submit ${enquiryType}`}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
