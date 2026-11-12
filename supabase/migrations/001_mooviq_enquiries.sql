-- Mooviq Public Lead Enquiry Storage Migration
-- Enforces strict RLS: anonymous/public roles CANNOT read or write directly.
-- Writes occur strictly through a server-side endpoint or Supabase Edge Function using service_role.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS public.mooviq_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  source_page TEXT NOT NULL DEFAULT 'mooviq',
  full_name TEXT NOT NULL CHECK (char_length(full_name) BETWEEN 2 AND 120),
  work_email TEXT NOT NULL CHECK (char_length(work_email) BETWEEN 5 AND 160),
  company_name TEXT NOT NULL CHECK (char_length(company_name) BETWEEN 2 AND 160),
  enquiry_type TEXT NOT NULL CHECK (
    enquiry_type IN ('Book a demo', 'Request media-wise quote', 'Discuss pilot', 'Product question')
  ),
  consent_granted BOOLEAN NOT NULL DEFAULT FALSE CHECK (consent_granted = TRUE),
  consent_timestamp TIMESTAMPTZ NOT NULL,
  phone_number TEXT,
  company_type TEXT,
  media_types JSONB NOT NULL DEFAULT '[]'::jsonb,
  expected_volume TEXT,
  cities TEXT,
  message TEXT,
  quote_summary TEXT,
  utm_params JSONB NOT NULL DEFAULT '{}'::jsonb
);

ALTER TABLE public.mooviq_enquiries ENABLE ROW LEVEL SECURITY;

-- Explicitly revoke direct client access for anon & authenticated public users
REVOKE ALL ON TABLE public.mooviq_enquiries FROM anon, authenticated;

-- Admin-only policy (expects JWT app_metadata.role = 'admin' or service_role bypass)
CREATE POLICY "mooviq_enquiries_admin_select"
  ON public.mooviq_enquiries
  FOR SELECT
  TO authenticated
  USING ((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin');

-- Admin export view (accessible only to authenticated admins / service_role)
CREATE OR REPLACE VIEW public.mooviq_enquiries_admin_export
WITH (security_invoker = true) AS
SELECT
  id,
  created_at,
  source_page,
  full_name,
  work_email,
  company_name,
  company_type,
  enquiry_type,
  phone_number,
  media_types,
  expected_volume,
  cities,
  quote_summary,
  message,
  consent_timestamp,
  utm_params
FROM public.mooviq_enquiries
ORDER BY created_at DESC;
