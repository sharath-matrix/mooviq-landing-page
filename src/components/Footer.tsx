import React from 'react';
import { ShieldCheck, ArrowRight, ExternalLink, ArrowUp } from 'lucide-react';
import { trackMooviqEvent } from '../lib/analytics';

interface FooterProps {
  onExploreDemoClick: () => void;
  onBookDemoClick: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onExploreDemoClick,
  onBookDemoClick,
}) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 text-left relative overflow-hidden">
      {/* Pre-footer Call to Action Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-14">
        <div className="relative rounded-3xl bg-gradient-to-tr from-brand-700 via-brand-600 to-slate-900 p-8 sm:p-12 text-center overflow-hidden shadow-2xl">
          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Ready to see where every campaign stands?
            </h2>
            <p className="mt-3 text-base text-brand-100 leading-relaxed">
              Explore the interactive multi-media workspace, then share your formats to request a demo or tailored audit quote.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => {
                  trackMooviqEvent('cta_click', { location: 'footer', cta: 'Explore Interactive Demo' });
                  onExploreDemoClick();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white text-slate-900 font-bold text-sm hover:bg-slate-100 transition-colors shadow-lg cursor-pointer"
              >
                <span>Explore Interactive Demo</span>
                <ArrowRight className="w-4 h-4 text-brand-600" />
              </button>

              <button
                type="button"
                onClick={() => {
                  trackMooviqEvent('cta_click', { location: 'footer', cta: 'Book a Demo' });
                  onBookDemoClick();
                }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white font-bold text-sm border border-white/20 transition-colors cursor-pointer"
              >
                <span>Book a Demo</span>
                <ArrowRight className="w-4 h-4 text-slate-300" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-600 flex items-center justify-center text-white">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">Mooviq</span>
              <span className="text-xs text-slate-400">
                by <strong className="text-white">EraZero</strong>
              </span>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Multi-media advertising auditing and proof-of-performance workflows across transit, outdoor OOH, indoor place-based, and screen/broadcast formats.
            </p>

            <div className="pt-2">
              <a
                href="https://erazero.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
              >
                <span>Visit EraZero AI</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>

          <div className="md:col-span-3 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Page Sections
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#media-coverage" className="hover:text-white transition-colors">
                  Media Coverage
                </a>
              </li>
              <li>
                <a
                  href="#explore-demo"
                  onClick={(e) => {
                    e.preventDefault();
                    onExploreDemoClick();
                  }}
                  className="hover:text-white transition-colors font-medium text-brand-400"
                >
                  Interactive Demo
                </a>
              </li>
              <li>
                <a href="#how-it-works" className="hover:text-white transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#pricing" className="hover:text-white transition-colors">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#quote-builder" className="hover:text-white transition-colors">
                  Quote Builder
                </a>
              </li>
              <li>
                <a href="#faqs" className="hover:text-white transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div className="md:col-span-4 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Enquiries &amp; Policies
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <a href="#contact" className="hover:text-white transition-colors">
                  Plan Audits / Contact Form
                </a>
              </li>
              <li>
                <a
                  href="https://erazero.ai/contact/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors inline-flex items-center gap-1"
                >
                  <span>EraZero Contact Page</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <span className="text-slate-400 text-[11px]">
                  Privacy &amp; legal notices hosted on erazero.ai
                </span>
              </li>
            </ul>

            <div className="pt-4">
              <button
                type="button"
                onClick={scrollToTop}
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <ArrowUp className="w-3.5 h-3.5" />
                <span>Back to top</span>
              </button>
            </div>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} Mooviq by EraZero. All rights reserved.</p>
          <p className="text-center sm:text-right text-[11px] text-slate-400 max-w-xl">
            Interactive demo content uses fictional sample data. Proposed dashboard tiers, unpriced audit services, and planned integrations are subject to confirmation.
          </p>
        </div>
      </div>
    </footer>
  );
};
