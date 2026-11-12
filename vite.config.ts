import { defineConfig, Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import { processEnquirySubmission } from './server/enquiryService';

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
  end(data?: string): void;
}

function getEnv(key: string): string | undefined {
  const proc = (globalThis as { process?: { env?: Record<string, string | undefined> } }).process;
  return proc?.env?.[key];
}

function attachEnquiryMiddleware(middlewares: {
  use: (path: string, fn: (req: NodeReadableReq, res: NodeWritableRes, next: () => void) => void) => void;
}) {
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

    let rawBody = '';
    let aborted = false;

    req.on('data', (chunk) => {
      rawBody += chunk.toString();
      if (rawBody.length > 64 * 1024) {
        aborted = true;
        res.statusCode = 413;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ ok: false, message: 'Payload too large' }));
      }
    });

    req.on('end', () => {
      if (aborted) return;
      void (async () => {
        try {
          const parsed = rawBody ? JSON.parse(rawBody) : {};
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
        } catch {
          res.statusCode = 400;
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              ok: false,
              code: 'VALIDATION_ERROR',
              message: 'Invalid JSON request body.',
            })
          );
        }
      })();
    });

    req.on('error', () => {
      next();
    });
  });
}

function mooviqEnquiryApiPlugin(): Plugin {
  return {
    name: 'mooviq-enquiry-api',
    configureServer(server) {
      attachEnquiryMiddleware(server.middlewares);
    },
    configurePreviewServer(server) {
      attachEnquiryMiddleware(server.middlewares);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), mooviqEnquiryApiPlugin()],
  server: {
    port: 5173,
    host: true,
  },
});
