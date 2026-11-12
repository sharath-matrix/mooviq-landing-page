import React from 'react';
import { 
  MessageSquare, 
  ArrowRight, 
  ExternalLink, 
  ShieldAlert, 
  Check, 
  CheckCheck, 
  Link2, 
  Clock, 
  HelpCircle,
  Smartphone
} from 'lucide-react';

export const WhatsAppRoadmap: React.FC = () => {
  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-700 text-xs font-semibold mb-3">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span>Roadmap Concept &bull; Not currently live</span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            WhatsApp-enabled updates — on the roadmap.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            We are designing streamlined WhatsApp notifications to accelerate field dispatch and keep stakeholders updated without requiring heavy app downloads.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Workflow Process Explanation */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <h3 className="text-xl font-bold text-slate-900">
              Proposed 4-Stage Notification Flow
            </h3>

            <div className="space-y-4">
              
              {/* Step 1 */}
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  01
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Task Assigned Alert</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Field auditor receives an instant WhatsApp message with route schedule, media unit ID, and target location.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  02
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">One-Click Secure Audit Link</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Message provides a single-use secure web link that opens the Mooviq in-browser camera for tamper-resistant capture.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  03
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Submission Receipt & Check</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Auditor receives immediate acknowledgment that their evidence was uploaded into the central review queue.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex items-start gap-3.5 p-4 rounded-xl bg-white border border-slate-200 shadow-2xs">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-800 font-mono font-bold text-xs flex items-center justify-center shrink-0">
                  04
                </div>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Daily Digest to Stakeholders</h4>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Brand campaign managers and agency leads receive an automated morning summary of audits completed versus planned.
                  </p>
                </div>
              </div>

            </div>

            {/* Crucial Technical Integrity Notice */}
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5">Important Metadata Architecture Note:</span>
                Forwarded media files in regular WhatsApp chats strip EXIF timestamps and geolocation data. Mooviq will use WhatsApp strictly for dispatch notifications; photo captures must occur via the secure Mooviq web app to preserve cryptographic audit timestamps and coordinates.
              </div>
            </div>

            <div className="pt-2">
              <a
                href="https://erazero.ai/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition-colors"
              >
                <span>Ask about WhatsApp integration rollout</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Right: Simulated WhatsApp Notification Preview */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-white border border-slate-300 shadow-xl p-4 overflow-hidden text-left relative">
              
              {/* Concept Watermark */}
              <div className="absolute top-3 right-3 z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white px-2 py-0.5 rounded">
                  Concept preview
                </span>
              </div>

              {/* Mock Chat Header */}
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-10 h-10 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold text-sm">
                  MQ
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Mooviq Audit Dispatch
                  </h4>
                  <p className="text-[10px] text-slate-400">
                    Automated Workspace Bot (Concept)
                  </p>
                </div>
              </div>

              {/* Chat Message Bubble 1: Incoming Task */}
              <div className="mt-4 space-y-3">
                <div className="bg-slate-100 p-3 rounded-2xl rounded-tl-xs max-w-[90%] text-xs text-slate-800 space-y-1.5 shadow-2xs">
                  <p className="font-semibold text-slate-900 text-[11px]">
                    📍 New Audit Scheduled · Task #BLR-089
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Campaign: <strong>Northstar Transit Launch</strong><br />
                    Unit: Auto Rear Panel #KA-03-AA-1290<br />
                    Location: Indiranagar 100ft Rd, Junction #4
                  </p>
                  <div className="pt-1.5 border-t border-slate-200">
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-600">
                      <Link2 className="w-3 h-3" />
                      Tap to open camera checkpoint &rarr;
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-400 block text-right font-mono">
                    10:14 AM
                  </span>
                </div>

                {/* Chat Message Bubble 2: Submission Verified */}
                <div className="bg-emerald-50 border border-emerald-100 p-3 rounded-2xl rounded-tl-xs max-w-[90%] text-xs text-slate-800 space-y-1.5">
                  <p className="font-semibold text-emerald-900 text-[11px] flex items-center gap-1">
                    <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                    Audit Received & In Queue
                  </p>
                  <p className="text-[11px] text-slate-600">
                    Evidence for unit #KA-03-AA-1290 uploaded successfully with verified timestamp.
                  </p>
                  <span className="text-[9px] text-slate-400 block text-right font-mono">
                    10:28 AM
                  </span>
                </div>
              </div>

              {/* Simulated Chat Input Bar */}
              <div className="mt-6 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
                <span>Reply not enabled in preview</span>
                <span className="font-mono text-[10px]">E2E Encrypted</span>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};

