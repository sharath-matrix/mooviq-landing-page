import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { processEnquirySubmission } from './server/enquiryService';
import { handleSendOtp, handleVerifyOtp, validateVerificationToken } from './server/otpService';
import { calculateSecureQuotation } from './server/pricingService';
import { generateQuotationPdf } from './server/quotePdfService';

interface NodeReadableReq {
  url?: string;
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  socket?: { remoteAddress?: string };
  on(event: 'data', listener: (chunk: { toString(): string }) => void): void;
  on(event: 'end', listener: () => void): void;
  on(event: 'error', listener: (err: unknown) => void): void;
}

interface NodeWritableRes {
  statusCode: number;
  setHeader(name: string, value: string): void;
  end(data?: string | Buffer | Uint8Array): void;
}

function getEnv(key: string): string | undefined {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env?.[key];
}

function readJsonBody(req: NodeReadableReq): Promise<{ parsed: any; aborted: boolean }> {
  return new Promise((resolve) => {
    let raw = '';
    let aborted = false;

    req.on('data', (chunk) => {
      raw += chunk.toString();
      if (raw.length > 512 * 1024) {
        aborted = true;
      }
    });

    req.on('end', () => {
      if (aborted) {
        resolve({ parsed: null, aborted: true });
        return;
      }
      try {
        const parsed = raw ? JSON.parse(raw) : {};
        resolve({ parsed, aborted: false });
      } catch {
        resolve({ parsed: null, aborted: false });
      }
    });
  });
}

function attachMooviqApiMiddleware(middlewares: {
  use: (path: string, fn: (req: NodeReadableReq, res: NodeWritableRes, next: () => void) => void) => void;
}) {
  // 1. Existing Lead Form Enquiry
  middlewares.use('/api/enquiry', (req, res, next) => {
    if (req.method !== 'POST') {
      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }
      res.statusCode = 405;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: false, message: 'Method not allowed' }));
      return;
    }

    void (async () => {
      const { parsed, aborted } = await readJsonBody(req);
      if (aborted) {
        res.statusCode = 413;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message: 'Payload too large' }));
        return;
      }
      if (!parsed) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, code: 'VALIDATION_ERROR', message: 'Invalid JSON request.' }));
        return;
      }

      const forwarded = req.headers['x-forwarded-for'];
      const clientKey =
        (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        'localhost';

      const result = await processEnquirySubmission(parsed, clientKey, {
        supabaseUrl: getEnv('SUPABASE_URL'),
        supabaseServiceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
        webhookUrl: getEnv('MOOVIQ_ENQUIRY_WEBHOOK_URL'),
      });

      res.statusCode = result.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result.body));
    })();
  });

  // 2. OTP Send API (/api/quote/otp/send)
  middlewares.use('/api/quote/otp/send', (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = req.method === 'OPTIONS' ? 204 : 405;
      res.end();
      return;
    }

    void (async () => {
      const { parsed, aborted } = await readJsonBody(req);
      if (aborted || !parsed) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message: 'Invalid request' }));
        return;
      }

      const forwarded = req.headers['x-forwarded-for'];
      const clientIp =
        (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        '127.0.0.1';

      const result = await handleSendOtp(parsed, clientIp);
      res.statusCode = result.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result.body));
    })();
  });

  // 3. OTP Verify API (/api/quote/otp/verify)
  middlewares.use('/api/quote/otp/verify', (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = req.method === 'OPTIONS' ? 204 : 405;
      res.end();
      return;
    }

    void (async () => {
      const { parsed, aborted } = await readJsonBody(req);
      if (aborted || !parsed) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message: 'Invalid request' }));
        return;
      }

      const result = await handleVerifyOtp(parsed);
      res.statusCode = result.status;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(result.body));
    })();
  });

  // 4. Secure Calculation API (/api/quote/calculate)
  middlewares.use('/api/quote/calculate', (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = req.method === 'OPTIONS' ? 204 : 405;
      res.end();
      return;
    }

    void (async () => {
      const { parsed, aborted } = await readJsonBody(req);
      if (aborted || !parsed) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message: 'Invalid request' }));
        return;
      }

      // Check verified session token
      const session = validateVerificationToken(parsed.verificationToken);
      if (!session) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            ok: false,
            message: 'Unauthorized. Mobile number and business email must be verified before quotation pricing is unlocked.',
          })
        );
        return;
      }

      // Calculate securely on the server
      const quotation = calculateSecureQuotation(
        {
          fullName: session.fullName,
          companyName: session.companyName,
          mobileNumber: session.mobileNumber,
          workEmail: session.workEmail,
        },
        parsed.dashboardUsers || 1,
        Array.isArray(parsed.items) ? parsed.items : []
      );

      // Automatically store/update verified quotation lead in existing lead system
      const forwarded = req.headers['x-forwarded-for'];
      const clientKey =
        (Array.isArray(forwarded) ? forwarded[0] : forwarded)?.split(',')[0]?.trim() ||
        req.socket?.remoteAddress ||
        'localhost';

      try {
        await processEnquirySubmission(
          {
            fullName: session.fullName,
            companyName: session.companyName,
            phoneNumber: session.mobileNumber,
            workEmail: session.workEmail,
            enquiryType: 'Request media-wise quote',
            expectedVolume: `${quotation.totals.totalBillableEvents} planned audit events`,
            cities: Array.from(new Set(quotation.items.map((i) => i.cityScope))).join(', '),
            quoteSummary: `Quotation Ref: ${quotation.quotationRef} | ${quotation.totals.totalMediaUnits} units, ${quotation.totals.totalBillableEvents} events across ${quotation.items.map((i) => i.mediaName).join(', ')}. Est: ₹${quotation.totals.totalEstimateWithGstInr.toLocaleString('en-IN')}`,
            consent: true,
          },
          clientKey,
          {
            supabaseUrl: getEnv('SUPABASE_URL'),
            supabaseServiceRoleKey: getEnv('SUPABASE_SERVICE_ROLE_KEY'),
            webhookUrl: getEnv('MOOVIQ_ENQUIRY_WEBHOOK_URL'),
          }
        );
      } catch (err) {
        console.warn('Lead capture recording warning:', err);
      }

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ ok: true, quotation }));
    })();
  });

  // 5. PDF Generation & Download API (/api/quote/pdf)
  middlewares.use('/api/quote/pdf', (req, res) => {
    if (req.method !== 'POST') {
      res.statusCode = req.method === 'OPTIONS' ? 204 : 405;
      res.end();
      return;
    }

    void (async () => {
      const { parsed, aborted } = await readJsonBody(req);
      if (aborted || !parsed || !parsed.quotation) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message: 'Invalid quotation data for PDF generation.' }));
        return;
      }

      // Check verified session token
      const session = validateVerificationToken(parsed.verificationToken);
      if (!session) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.end(
          JSON.stringify({
            ok: false,
            message: 'Unauthorized. Verification required before downloading quotation PDF.',
          })
        );
        return;
      }

      try {
        const pdfBytes = generateQuotationPdf(parsed.quotation);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="Mooviq_Quotation_${parsed.quotation.quotationRef || 'Plan'}.pdf"`
        );
        res.setHeader('Content-Length', pdfBytes.length.toString());
        res.end(Buffer.from(pdfBytes));
      } catch (err: any) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message: `PDF generation failed: ${err.message}` }));
      }
    })();
  });
}

function mooviqApiPlugin(): Plugin {
  return {
    name: 'mooviq-api-middleware',
    configureServer(server) {
      attachMooviqApiMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachMooviqApiMiddleware(server.middlewares);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mooviqApiPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
