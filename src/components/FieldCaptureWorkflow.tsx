import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Camera,
  CheckCircle2,
  CheckCheck,
  Building2,
  Car,
  Tv,
  ArrowRight,
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Send,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import { trackMooviqEvent } from '../lib/analytics';

interface FieldCaptureWorkflowProps {
  onBookDemoClick: () => void;
}

type MediaTab = 'billboard' | 'vehicle' | 'screen';

interface WorkflowScenario {
  taskId: string;
  mediaType: string;
  campaign: string;
  location: string;
  assetId: string;
  instructions: string;
  imageUrl: string;
  checklist: Array<{ question: string; answer: string }>;
  proofLabel: string;
}

const SCENARIOS: Record<MediaTab, WorkflowScenario> = {
  billboard: {
    taskId: 'MVQ-TASK-089',
    mediaType: 'Billboard / Hoarding',
    campaign: 'NoBroker Prime Blitz',
    location: '100ft Road, Indiranagar, Bengaluru',
    assetId: 'BB-BLR-IND-04',
    instructions: 'Inspect daytime visibility, vinyl tension, illumination, and line-of-sight obstructions.',
    imageUrl:
      'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=400&q=80',
    checklist: [
      { question: 'Is the creative installed?', answer: 'Yes' },
      { question: 'Is the creative visible from 100m?', answer: 'Yes' },
      { question: 'Is there physical tears or peeling?', answer: 'No' },
      { question: 'Is the surrounding sightline clear?', answer: 'Yes' },
    ],
    proofLabel: '2 high-res photos: Wide approach + Close inspection',
  },
  vehicle: {
    taskId: 'MVQ-TASK-204',
    mediaType: 'Auto Branding',
    campaign: 'Rapido City Rides',
    location: 'Hitec City Junction Checkpoint, Hyderabad',
    assetId: 'AP-09-TA-8821',
    instructions: 'Confirm legible registration plate, rear wrap cleanliness, and edge adhesion.',
    imageUrl:
      'https://images.unsplash.com/photo-1558981403-c5f9899a28bc?auto=format&fit=crop&w=400&q=80',
    checklist: [
      { question: 'Is the branding wrap present?', answer: 'Yes' },
      { question: 'Is the registration plate clearly readable?', answer: 'Yes' },
      { question: 'Is the vinyl clean and undamaged?', answer: 'Yes' },
      { question: 'Are required 3 angles captured?', answer: 'Yes' },
    ],
    proofLabel: '3 angle photos: Rear panel + Plate close-up + Side',
  },
  screen: {
    taskId: 'MVQ-TASK-701',
    mediaType: 'Digital Screen / DOOH',
    campaign: 'Zepto 10-Min Grocery',
    location: 'Phoenix Mall Atrium Screen #2, Mumbai',
    assetId: 'DOOH-MUM-PHX-02',
    instructions: 'Verify screen power status, creative clarity, audio output (if applicable), and CMS playback.',
    imageUrl:
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80',
    checklist: [
      { question: 'Is the display screen active?', answer: 'Yes' },
      { question: 'Is scheduled creative playing?', answer: 'Yes' },
      { question: 'Is screen resolution sharp (no dead pixels)?', answer: 'Yes' },
      { question: 'Is placement position unobstructed?', answer: 'Yes' },
    ],
    proofLabel: 'Short video snippet + time-synced screen photo',
  },
};

const STEP_EXPLANATIONS = [
  {
    step: 1,
    title: 'Audit Task Assigned',
    summary: 'Field auditors receive instant assignment alerts with campaign instructions, priority level, and exact GPS coordinates directly in WhatsApp.',
  },
  {
    step: 2,
    title: 'Review Media Details',
    summary: 'Auditors inspect the campaign asset reference, reference mockups, brand creative guidelines, and specific inspection requirements.',
  },
  {
    step: 3,
    title: 'Capture Evidence',
    summary: 'Photos or video snippets are captured directly. For forensic proof, secure Mooviq capture checks device GPS, orientation, and local timestamp.',
  },
  {
    step: 4,
    title: 'Inspection Checklist',
    summary: 'Structured format-specific questions (damage, visibility, obstruction, power status) ensure uniform field quality standards.',
  },
  {
    step: 5,
    title: 'Evidence Submitted',
    summary: 'All captured photographs, checklist answers, and metadata are bundled and transmitted securely with immediate confirmation.',
  },
  {
    step: 6,
    title: 'Supervisor Verification',
    summary: 'Submissions enter Mooviq’s supervisor QA queue. Flagged exceptions trigger re-audits; verified proofs publish to the client workspace.',
  },
];

export const FieldCaptureWorkflow: React.FC<FieldCaptureWorkflowProps> = ({
  onBookDemoClick,
}) => {
  const [activeTab, setActiveTab] = useState<MediaTab>('billboard');
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  const scenario = SCENARIOS[activeTab];
  const totalSteps = 6;
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-play interval
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentStep((prev) => (prev >= totalSteps ? 1 : prev + 1));
    }, 3200);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying]);

  const handleTabChange = (tab: MediaTab) => {
    setActiveTab(tab);
    setCurrentStep(1);
    trackMooviqEvent('cta_click', { location: 'whatsapp_demo', format: tab });
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => (prev > 1 ? prev - 1 : totalSteps));
  };

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStep((prev) => (prev < totalSteps ? prev + 1 : 1));
  };

  const handleRestart = () => {
    setCurrentStep(1);
    setIsPlaying(true);
  };

  return (
    <section className="py-16 md:py-24 bg-slate-50 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Interactive Field Simulation &middot; Sample Workflow
          </span>
          <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Field-First Capture via WhatsApp
          </h2>
          <p className="mt-3 text-base text-slate-600 leading-relaxed">
            See how field auditors receive assignments, inspect media assets, capture time-stamped proof,
            and submit structured checklists directly through WhatsApp.
          </p>

          {/* Media Tab Selector */}
          <div className="mt-6 inline-flex p-1 rounded-2xl bg-white border border-slate-200 shadow-xs">
            {(
              [
                { id: 'billboard', label: 'Billboard / OOH', icon: Building2 },
                { id: 'vehicle', label: 'Transit Vehicle', icon: Car },
                { id: 'screen', label: 'Digital Screen / DOOH', icon: Tv },
              ] as const
            ).map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => handleTabChange(t.id)}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    activeTab === t.id
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Grid: Realistic Smartphone Demo + Narrative Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* ======================================================== */}
          {/* LEFT: REALISTIC SMARTPHONE MOCKUP                        */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 flex flex-col items-center">
            {/* Outer Phone Shell */}
            <div className="relative w-[340px] sm:w-[360px] rounded-[48px] p-3.5 bg-slate-950 shadow-2xl ring-1 ring-slate-800 border-4 border-slate-800">
              {/* Top Speaker Slit & Front Camera Notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-slate-950 rounded-full flex items-center justify-center gap-2 z-30">
                <div className="w-10 h-1 rounded-full bg-slate-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800" />
              </div>

              {/* Phone Screen Area */}
              <div className="relative rounded-[36px] overflow-hidden bg-[#efeae2] h-[580px] flex flex-col text-left select-none shadow-inner border border-slate-900">
                {/* 1. Phone Top Status Bar */}
                <div className="pt-2 px-6 pb-1 bg-[#075E54] text-white flex items-center justify-between text-[11px] font-semibold tracking-tight z-20">
                  <span>9:41</span>
                  <div className="flex items-center gap-1.5 text-white/90">
                    <span className="text-[10px]">5G</span>
                    <div className="w-4 h-2 border border-white rounded-xs p-0.5 flex items-center">
                      <div className="w-2.5 h-full bg-white rounded-2xs" />
                    </div>
                  </div>
                </div>

                {/* 2. WhatsApp Header Bar */}
                <div className="bg-[#075E54] px-4 py-2.5 text-white flex items-center justify-between shadow-md z-20">
                  <div className="flex items-center gap-2.5">
                    <div className="relative">
                      <div className="w-9 h-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-white text-xs border border-white/20">
                        MQ
                      </div>
                      <div className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border border-[#075E54]" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold leading-tight">Mooviq Audit Assistant</h4>
                      <p className="text-[10px] text-emerald-200">Demonstration &middot; Sample workflow</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-white/90">
                    <Video className="w-4 h-4 cursor-pointer" />
                    <Phone className="w-3.5 h-3.5 cursor-pointer" />
                    <MoreVertical className="w-3.5 h-3.5 cursor-pointer" />
                  </div>
                </div>

                {/* 3. WhatsApp Chat Body */}
                <div className="flex-1 p-3 overflow-y-auto space-y-3 font-sans text-xs bg-[#efeae2]">
                  {/* Date Badge */}
                  <div className="text-center my-1">
                    <span className="px-2.5 py-0.5 rounded-md bg-white/80 text-[10px] text-slate-600 font-medium shadow-xs">
                      TODAY
                    </span>
                  </div>

                  {/* Message 1: Audit Task Assigned (Step >= 1) */}
                  {currentStep >= 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[88%] bg-white rounded-2xl rounded-tl-none p-3 shadow-xs border border-black/5 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-brand-600 font-bold text-[11px]">
                        <span>🔔 New Audit Assigned</span>
                      </div>
                      <div className="text-[11px] text-slate-800 space-y-0.5">
                        <p>
                          <strong>Task ID:</strong> <span className="font-mono">{scenario.taskId}</span>
                        </p>
                        <p>
                          <strong>Media:</strong> {scenario.mediaType}
                        </p>
                        <p>
                          <strong>Campaign:</strong> {scenario.campaign}
                        </p>
                        <p className="flex items-start gap-1 text-slate-600 pt-0.5">
                          <MapPin className="w-3 h-3 text-brand-500 shrink-0 mt-0.5" />
                          <span>{scenario.location}</span>
                        </p>
                      </div>
                      <div className="pt-1.5 border-t border-slate-100 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Priority Checkpoint
                        </span>
                        <span className="text-[9px] text-slate-400">09:41 AM</span>
                      </div>
                    </div>
                  )}

                  {/* Message 2: Review Media Details (Step >= 2) */}
                  {currentStep >= 2 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[88%] bg-white rounded-2xl rounded-tl-none p-3 shadow-xs border border-black/5 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[11px] text-slate-900">Media Checklist &amp; Spec</span>
                        <span className="text-[9px] font-mono text-slate-400">{scenario.assetId}</span>
                      </div>
                      <p className="text-[10px] text-slate-600 leading-snug">{scenario.instructions}</p>
                      {/* Media image preview */}
                      <div className="relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-100">
                        <img
                          src={scenario.imageUrl}
                          alt="Audit site reference"
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded">
                          Ref Mockup
                        </span>
                      </div>
                      <span className="text-[9px] text-slate-400 block text-right">09:42 AM</span>
                    </div>
                  )}

                  {/* Message 3: Capture Evidence (Step >= 3) */}
                  {currentStep >= 3 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ml-auto max-w-[88%] bg-[#dcf8c6] rounded-2xl rounded-tr-none p-3 shadow-xs border border-emerald-900/10 space-y-1.5">
                      <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-[11px]">
                        <Camera className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Evidence Captured on Site</span>
                      </div>
                      <p className="text-[10px] text-emerald-950">{scenario.proofLabel}</p>
                      <div className="p-1.5 rounded-lg bg-emerald-100/70 border border-emerald-200 text-[9px] text-emerald-800 flex items-center justify-between font-mono">
                        <span>GPS: 12.9716° N, 77.5946° E</span>
                        <span>±4m accuracy</span>
                      </div>
                      <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-800">
                        <span>09:44 AM</span>
                        <CheckCheck className="w-3 h-3 text-emerald-600" />
                      </div>
                    </div>
                  )}

                  {/* Message 4: Inspection Checklist (Step >= 4) */}
                  {currentStep >= 4 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 ml-auto max-w-[88%] bg-[#dcf8c6] rounded-2xl rounded-tr-none p-3 shadow-xs border border-emerald-900/10 space-y-1.5">
                      <span className="font-bold text-[11px] text-emerald-950 block">Field Checklist Completed</span>
                      <div className="space-y-1 text-[10px] text-emerald-900">
                        {scenario.checklist.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-2 border-b border-emerald-200/50 pb-0.5 last:border-0">
                            <span>{item.question}</span>
                            <span className="font-bold font-mono text-emerald-800">{item.answer}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-end gap-1 text-[9px] text-emerald-800 pt-1">
                        <span>09:45 AM</span>
                        <CheckCheck className="w-3 h-3 text-emerald-600" />
                      </div>
                    </div>
                  )}

                  {/* Message 5: Evidence Received Confirmation (Step >= 5) */}
                  {currentStep >= 5 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[88%] bg-white rounded-2xl rounded-tl-none p-3 shadow-xs border border-black/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Audit Evidence Received</span>
                      </div>
                      <p className="text-[10px] text-slate-700 leading-snug">
                        Task <span className="font-mono font-bold">{scenario.taskId}</span> successfully submitted with location &amp; timestamp verification.
                      </p>
                      <span className="text-[9px] text-slate-400 block text-right">09:46 AM</span>
                    </div>
                  )}

                  {/* Message 6: Supervisor Verification Queue (Step >= 6) */}
                  {currentStep >= 6 && (
                    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 max-w-[88%] bg-emerald-50 rounded-2xl rounded-tl-none p-3 shadow-xs border border-emerald-200 space-y-1">
                      <div className="flex items-center gap-1.5 text-emerald-800 font-bold text-[11px]">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Supervisor Review Queue</span>
                      </div>
                      <p className="text-[10px] text-emerald-900 leading-snug">
                        Evidence is currently under review by QA supervisors. Status updates automatically when review is finalized.
                      </p>
                      <span className="text-[9px] text-emerald-700 block text-right font-medium">09:47 AM</span>
                    </div>
                  )}
                </div>

                {/* 4. WhatsApp Bottom Input Bar */}
                <div className="bg-white px-3 py-2 border-t border-slate-200 flex items-center gap-2 z-20">
                  <div className="p-1 text-slate-400">
                    <Paperclip className="w-4 h-4" />
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-full px-3 py-1.5 text-[11px] text-slate-400">
                    Type a message...
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#128C7E] flex items-center justify-center text-white">
                    <Camera className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>

            {/* Interactive Player Controls */}
            <div className="mt-5 flex items-center gap-3 bg-white px-4 py-2 rounded-2xl border border-slate-200 shadow-xs">
              <button
                type="button"
                onClick={handlePrev}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Previous step"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setIsPlaying(!isPlaying)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{isPlaying ? 'Pause' : 'Play'}</span>
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Next step"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handleRestart}
                className="p-1.5 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Restart animation"
              >
                <RotateCcw className="w-4 h-4" />
              </button>

              {/* Step indicator dots */}
              <div className="flex items-center gap-1 ml-2">
                {Array.from({ length: totalSteps }).map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStep(i + 1);
                    }}
                    className={`h-2 rounded-full transition-all cursor-pointer ${
                      currentStep === i + 1 ? 'w-5 bg-brand-600' : 'w-2 bg-slate-300'
                    }`}
                    aria-label={`Go to step ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* ======================================================== */}
          {/* RIGHT: STEP-BY-STEP NARRATIVE EXPLANATION                */}
          {/* ======================================================== */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-100">
                Step {currentStep} of {totalSteps}
              </span>
              <h3 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {STEP_EXPLANATIONS[currentStep - 1].title}
              </h3>
              <p className="mt-3 text-base text-slate-600 leading-relaxed">
                {STEP_EXPLANATIONS[currentStep - 1].summary}
              </p>
            </div>

            {/* Stepper Progression Cards */}
            <div className="space-y-3 pt-2">
              {STEP_EXPLANATIONS.map((exp) => {
                const isActive = exp.step === currentStep;
                const isPassed = exp.step < currentStep;

                return (
                  <div
                    key={exp.step}
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentStep(exp.step);
                    }}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      isActive
                        ? 'bg-white border-brand-500 shadow-md ring-1 ring-brand-500/20'
                        : isPassed
                        ? 'bg-slate-50/80 border-slate-200/90 hover:bg-white'
                        : 'bg-white/50 border-slate-200/60 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isActive
                            ? 'bg-brand-600 text-white'
                            : isPassed
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        {isPassed ? <CheckCircle2 className="w-4 h-4 text-emerald-600" /> : exp.step}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{exp.title}</h4>
                        <p className="text-[11px] text-slate-500 line-clamp-1">{exp.summary}</p>
                      </div>
                    </div>

                    {isActive && (
                      <span className="text-[10px] font-bold text-brand-600 uppercase tracking-wider shrink-0 bg-brand-50 px-2 py-0.5 rounded">
                        Active
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Demo CTA */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={onBookDemoClick}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold uppercase tracking-wider transition-all cursor-pointer"
              >
                <span>Discuss Capture Workflow</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <p className="text-[11px] text-slate-500">
                Demonstration uses fictional sample campaign data.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
