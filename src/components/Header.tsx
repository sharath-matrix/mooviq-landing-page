import React, { useState, useEffect } from 'react';
import { Menu, X, ShieldCheck, ChevronRight, ArrowRight } from 'lucide-react';
import { trackMooviqEvent } from '../lib/analytics';

interface HeaderProps {
  onExploreDemoClick: () => void;
  onBookDemoClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onExploreDemoClick,
  onBookDemoClick,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Media Coverage', href: '#media-coverage' },
    { label: 'Explore Demo', href: '#explore-demo', highlight: true, isDemo: true },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
    { label: 'Quote Builder', href: '#quote-builder' },
    { label: 'FAQs', href: '#faqs' },
    { label: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
    isDemo?: boolean
  ) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (isDemo) {
      trackMooviqEvent('cta_click', { location: 'header', cta: 'Explore Demo' });
      onExploreDemoClick();
      return;
    }

    const targetElement = document.querySelector(href);
    if (targetElement) {
      const headerOffset = 80;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };

  const handleBookDemo = () => {
    setMobileMenuOpen(false);
    trackMooviqEvent('cta_click', { location: 'header', cta: 'Book a Demo' });
    onBookDemoClick();
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-200 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white/90 backdrop-blur-sm border-b border-slate-100 py-4'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo / Brand */}
          <a
            href="#hero"
            onClick={(e) => handleNavClick(e, '#hero')}
            className="flex items-center gap-2.5 group cursor-pointer shrink-0"
            aria-label="Mooviq by EraZero Home"
          >
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center text-white shadow-sm shadow-brand-600/20 group-hover:bg-brand-700 transition-colors">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                Mooviq
              </span>
              <span className="text-[11px] font-medium text-slate-500 tracking-tight mt-0.5">
                by <span className="font-semibold text-slate-700">EraZero</span>
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.isDemo)}
                className={`text-xs xl:text-sm font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  link.highlight
                    ? 'text-brand-600 font-semibold bg-brand-50 hover:bg-brand-100/70 border border-brand-100'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={handleBookDemo}
              className="inline-flex items-center justify-center gap-1.5 text-xs xl:text-sm font-semibold bg-slate-900 text-white hover:bg-slate-800 px-4 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <span>Book a Demo</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
            </button>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[64px] bg-white border-b border-slate-200 shadow-xl px-4 pt-3 pb-6 space-y-2 animate-in slide-in-from-top-2">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href, link.isDemo)}
                className={`flex items-center justify-between text-sm font-medium px-3.5 py-2.5 rounded-xl ${
                  link.highlight
                    ? 'text-brand-600 bg-brand-50 font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                <span>{link.label}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </a>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={handleBookDemo}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm text-center shadow-sm cursor-pointer"
            >
              <span>Book a Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-center text-xs text-slate-400 mt-2">
              Multi-Media Advertising Audit &amp; Proof of Performance
            </p>
          </div>
        </div>
      )}
    </header>
  );
};
