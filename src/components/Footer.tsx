import React from 'react';
import { ShieldCheck, ArrowRight, ExternalLink, ArrowUp } from 'lucide-react';

interface FooterProps {
  onExploreDemoClick?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onExploreDemoClick }) => {
  const handleScrollToDemo = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onExploreDemoClick) onExploreDemoClick();
    const demoElement = document.getElementById('explore-demo');
    if (demoElement) {
      const headerOffset = 80;
      const elementPosition = demoElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 text-left relative overflow-hidden">
      
      {/* Pre-footer Call to Action Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative rounded-3xl bg-gradient-to-tr from-brand-700 via-brand-600 to-slate-900 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          
          {/* Subtle geometric circles */}
          <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-black/20 blur-2xl pointer-events-none" />

          <div className="relative max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-200 bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Audit Transparency Awaits
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to see where every campaign stands?
            </h2>
            <p className="mt-3 text-base text-brand-100 leading-relaxed">
              Explore the Mooviq preview, then talk with our team about your auditing workflow.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={handleScrollToDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg cursor-pointer"
              >
                <span>Explore Interactive Demo</span>
                <ArrowRight className="w-4 h-4 text-brand-600" />
              </button>

              <a
                href="https://erazero.ai/contact/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-sm border border-white/20 transition-colors"
              >
                <span>Talk to the Team</span>
                <ExternalLink className="w-4 h-4 text-slate-300" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Branding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Mooviq
              </span>
              <span className="text-xs text-slate-400">
                by <strong className="text-white">EraZero AI</strong>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Mooviq provides structured media audit tracking and proof verification for advertisers, marketing agencies, and field execution teams.
            </p>

            <div className="pt-2">
              <a
                href="https://erazero.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <span>Visit EraZero AI Homepage</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Nav Quick Links */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Page Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#features" className="hover:text-white transition-colors">Features</a>
              </li>
              <li>
                <a href="#explore-demo" onClick={handleScrollToDemo} className="hover:text-white transition-colors font-medium text-brand-400">Interactive Demo</a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">How It Works</a>
              </li>
              <li>
                <a href="#use-cases" className="hover:text-white transition-colors">Use Cases & Media</a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">Pricing & Calculator</a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">FAQs</a>
              </li>
            </ul>
          </div>

          {/* Legal and Contact */}
          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Contact & Integrations
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="https://erazero.ai/contact/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-1">
                  <span>Contact Sales / Book a Demo</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a href="https://erazero.ai/contact/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  Agency Partner Inquiries
                </a>
              </li>
              <li>
                <span className="text-slate-400 text-[11px]">Privacy &amp; terms hosted on EraZero AI</span>
              </li>
            </ul>

            <div className="pt-4">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to top of page</span>
              </button>
            </div>
          </div>

        </div>

        {/* Legal Disclaimers Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>
            &copy; {new Date().getFullYear()} Mooviq by EraZero AI. All rights reserved.
          </p>
          <p className="text-center sm:text-right text-[11px] text-slate-400 max-w-lg">
            Demo content is illustrative. Commercial plans, verification capabilities, and roadmap features are subject to confirmation.
          </p>
        </div>

      </div>
    </footer>
  );
};

