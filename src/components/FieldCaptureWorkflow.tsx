import React, { useState } from 'react';
import {
  Smartphone,
  Camera,
  CheckCircle2,
  ClipboardCheck,
  Send,
  Bell,
  ShieldAlert,
  ArrowRight,
  Building2,
  Car,
  Tv,
} from 'lucide-react';

interface FieldCaptureWorkflowProps {
  onBookDemoClick: () => void;
}

export const FieldCaptureWorkflow: React.FC<FieldCaptureWorkflowProps> = ({
  onBookDemoClick,
}) => {
  const [phoneExample, setPhoneExample] = useState<'billboard' | 'vehicle' | 'screen'>('billboard');

  const phoneExamples = {
    billboard: {
      taskTitle: 'Task #DL-OOH-09 · Billboard Audit',
      location: 'Ring Road, Moti Bagh Flyover',
      checklist: [
        'Verify hoarding asset ID matches plan',
        'Check unobstructed sightline (no foliage)',
        'Capture daytime & illumination condition',
      ],
      captureLabel: 'Approach & close-up photos',
      reviewState: 'Submitted → Supervisor verification queue',
    },
    vehicle: {
      taskTitle: 'Task #BLR-089 · Transit Vehicle Audit',
      location: 'Indiranagar 100ft Checkpoint',
      checklist: [
        'Capture readable vehicle registration plate',
        'Inspect rear/side wrap alignment & edges',
        'Confirm clean surface and no damage',
      ],
      captureLabel: 'Panel + plate photos',
      reviewState: 'Submitted → Supervisor verification queue',
    },
    screen: {
      taskTitle: 'Task #MUM-701 · Mall Digital Screen',
      location: 'Lower Parel High Street Atrium',
      checklist: [
        'Confirm display powered on at scheduled slot',
        'Check screen brightness & creative clarity',
        'Cross-reference CMS playback log ID',
      ],
      captureLabel: 'Screen capture + log ID ref',
      reviewState: 'Submitted → Supervisor verification queue',
    },
  };

  const activeExample = phoneExamples[phoneExample];

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600 bg-white px-3 py-1 rounded-full border border-slate-200">
            Concept Workflow · Planned Field Capture &amp; Alerts
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Field-first capture. Flexible updates.
          </h2>
          <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed">
            Structured proof collection happens inside a dedicated mobile-web or field app capture flow tailored to each format, while optional WhatsApp alerts keep teams informed.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Primary Visual: Smartphone Capture Mockup */}
          <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-brand-600" />
                  <h3 className="text-base font-bold text-slate-900">
                    Mobile Field Capture Flow
                  </h3>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Task &rarr; Media-specific checklist &rarr; Evidence capture &rarr; Submit &rarr; Supervisor review
                </p>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-1 rounded-md self-start sm:self-auto">
                Concept workflow
              </span>
            </div>

            {/* Format Example Switcher */}
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 mr-1">Preview format:</span>
              {(
                [
                  { id: 'billboard', label: 'Billboard', icon: Building2 },
                  { id: 'vehicle', label: 'Vehicle', icon: Car },
                  { id: 'screen', label: 'Digital Screen', icon: Tv },
                ] as const
              ).map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPhoneExample(tab.id)}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors cursor-pointer ${
                      phoneExample === tab.id
                        ? 'bg-slate-900 text-white border-slate-900'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Smartphone Frame */}
            <div className="mt-6 max-w-sm mx-auto rounded-[28px] border-4 border-slate-900 bg-slate-50 p-4 shadow-xl space-y-3.5">
              {/* Top Phone Notch */}
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 px-1">
                <span>Mooviq Field Capture</span>
                <span className="px-1.5 py-0.2 rounded bg-slate-200 text-slate-700 font-semibold">
                  Concept
                </span>
              </div>

              {/* Step 1: Task */}
              <div className="p-3 rounded-xl bg-white border border-slate-200">
                <span className="text-[10px] font-bold uppercase text-brand-600 block">
                  1. Assigned Task
                </span>
                <p className="text-xs font-bold text-slate-900 mt-0.5">{activeExample.taskTitle}</p>
                <p className="text-[11px] text-slate-500">{activeExample.location}</p>
              </div>

              {/* Step 2: Media-specific Checklist */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2">
                <span className="text-[10px] font-bold uppercase text-slate-500 flex items-center gap-1">
                  <ClipboardCheck className="w-3 h-3 text-brand-600" />
                  2. Media-Specific Checklist
                </span>
                {activeExample.checklist.map((item, i) => (
                  <div key={i} className="flex items-start gap-2 text-[11px] text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Step 3: Evidence Capture */}
              <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">3. Capture Evidence</span>
                    <span className="text-xs font-semibold">{activeExample.captureLabel}</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono text-slate-300 border border-slate-700 px-2 py-0.5 rounded">
                  Time &amp; loc check
                </span>
              </div>

              {/* Step 4 & 5: Submit -> Review */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-[11px] text-emerald-900">
                <span className="flex items-center gap-1.5 font-semibold">
                  <Send className="w-3.5 h-3.5 text-emerald-700" />
                  4 &rarr; 5. {activeExample.reviewState}
                </span>
              </div>
            </div>
          </div>

          {/* Secondary Card: Optional WhatsApp Notifications */}
          <div className="lg:col-span-5 space-y-5 text-left">
            <div className="p-6 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900">
                      Optional WhatsApp notifications
                    </h3>
                    <p className="text-xs text-slate-500">Planned messaging hooks · Integration required</p>
                  </div>
                </div>
                <span className="text-[10px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                  Planned
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                WhatsApp can optionally notify teams about schedule milestones, while structured proof is captured inside a secure app or mobile-web flow with appropriate location and time checks.
              </p>

              {/* 3 Concept Notification Cards */}
              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-900 block">1. Task Assignment Alert (Concept)</span>
                  <span className="text-slate-600">
                    “New checkpoint scheduled: DL-OOH-09 Ring Road Hoarding. Open secure audit form &rarr;”
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-900 block">2. Daily Progress Digest (Concept)</span>
                  <span className="text-slate-600">
                    “UrbanNest Mall Network: 205/220 screens checked today. 3 exceptions awaiting review.”
                  </span>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-900 block">3. Exception Escalation (Concept)</span>
                  <span className="text-slate-600">
                    “Re-audit requested on KA-01-AUTO-7732 due to corner wrap peeling.”
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/90 text-xs text-amber-900 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  WhatsApp messaging is not bundled as a guaranteed free service; integration and messaging provider fees are scoped separately during deployment.
                </div>
              </div>

              <button
                type="button"
                onClick={onBookDemoClick}
                className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold transition-colors cursor-pointer"
              >
                <span>Discuss capture &amp; notification workflow</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

