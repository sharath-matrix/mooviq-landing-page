// Supabase Edge Function for Mooviq Lead Capture
// Deploy with: supabase functions deploy mooviq-enquiry
// Set secrets: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ALLOWED_ORIGIN

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';
import { processEnquirySubmission, resetRateLimiter } from '../../../server/enquiryService.ts';

const ALLOWED_ORIGIN = Deno.env.get('ALLOWED_ORIGIN') || 'https://erazero.ai';

function corsHeaders(origin: string | null) {
  const allow = origin === ALLOWED_ORIGIN || origin?.startsWith('http://localhost:') ? origin : ALLOWED_ORIGIN;
  return {
    'Access-Control-Allow-Origin': allow,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };
}

serve(async (req: Request) => {
  const origin = req.headers.get('origin');
  const headers = corsHeaders(origin);

  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ ok: false, message: 'Method not allowed' }), {
      status: 405,
      headers,
    });
  }

  try {
    const body = await req.json();
    const clientIp =
      req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('cf-connecting-ip') ||
      'unknown';

    const result = await processEnquirySubmission(body, clientIp, {
      supabaseUrl: Deno.env.get('SUPABASE_URL'),
      supabaseServiceRoleKey: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'),
      webhookUrl: Deno.env.get('MOOVIQ_ENQUIRY_WEBHOOK_URL'),
    });

    return new Response(JSON.stringify(result.body), {
      status: result.status,
      headers,
    });
  } catch {
    return new Response(
      JSON.stringify({
        ok: false,
        code: 'VALIDATION_ERROR',
        message: 'Invalid JSON request body.',
      }),
      { status: 400, headers }
    );
  }
});

// Keep import cleanly referenced if linted
void resetRateLimiter;
