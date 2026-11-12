export type MooviqAnalyticsEvent =
  | 'cta_click'
  | 'quote_builder_update'
  | 'quote_builder_submit'
  | 'form_start'
  | 'form_submit_success'
  | 'form_submit_error';

export interface AnalyticsPayload {
  [key: string]: string | number | boolean | undefined;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

/**
 * Explicit analytics integration hook.
 * Pushes events to window.dataLayer ONLY if existing analytics infrastructure
 * is present on the host EraZero site; otherwise emits a harmless CustomEvent
 * (`mooviq:analytics`) for future host listeners without faking tracking.
 */
export function trackMooviqEvent(event: MooviqAnalyticsEvent, payload: AnalyticsPayload = {}): void {
  if (typeof window === 'undefined') return;

  const eventRecord = {
    event: `mooviq_${event}`,
    source_page: 'mooviq',
    timestamp: new Date().toISOString(),
    ...payload,
  };

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(eventRecord);
  }

  window.dispatchEvent(new CustomEvent('mooviq:analytics', { detail: eventRecord }));
}
