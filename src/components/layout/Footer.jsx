import { useState, useEffect } from 'react';
import { ArrowUp, Copy, Check, ArrowUpRight } from 'lucide-react';
import { profile } from '../../data/profile';
import { getPKTTimeString } from '../../utils';

export function Footer() {
  const [copied, setCopied] = useState(false);
  const [localTime, setLocalTime] = useState(getPKTTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(getPKTTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-border bg-surface/40 pt-16 pb-12">
      <div className="max-w-editorial mx-auto px-5 md:px-8">
        {/* Top Editorial Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-border">
          {/* Col 1: Name & Status */}
          <div className="md:col-span-5 flex flex-col justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold text-foreground">
                {profile.name}
              </h3>
              <p className="mt-2 text-muted text-sm max-w-sm leading-relaxed">
                {profile.tagline}
              </p>
            </div>

            <div className="mt-8 flex items-center gap-2.5">
              <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
              <span className="font-mono text-xs uppercase tracking-wider text-foreground">
                {profile.status}
              </span>
            </div>
          </div>

          {/* Col 2: Time & Location */}
          <div className="md:col-span-3">
            <span className="font-mono text-eyebrow text-muted uppercase tracking-[0.2em] block mb-3">
              LOCAL TIME
            </span>
            <div className="font-mono text-xl text-foreground font-semibold">
              {localTime}
            </div>
            <div className="mt-1 font-mono text-xs text-muted">
              {profile.location} ({profile.timezone})
            </div>
          </div>

          {/* Col 3: Direct Inquiry & Socials */}
          <div className="md:col-span-4 flex flex-col justify-between">
            <div>
              <span className="font-mono text-eyebrow text-muted uppercase tracking-[0.2em] block mb-3">
                DIRECT INQUIRY
              </span>
              <button
                onClick={handleCopyEmail}
                className="group flex items-center gap-2 font-mono text-sm text-foreground hover:text-accent transition-colors text-left"
                title="Click to copy email"
              >
                <span>{profile.email}</span>
                {copied ? (
                  <Check size={14} className="text-accent shrink-0" />
                ) : (
                  <Copy size={14} className="text-muted group-hover:text-accent shrink-0" />
                )}
              </button>
            </div>

            <div className="mt-8 flex items-center gap-6">
              {profile.socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 font-mono text-xs text-muted hover:text-accent transition-colors"
                >
                  <span>{social.label}</span>
                  <ArrowUpRight size={12} />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Minimal Row */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-muted">
          <div>
            © {new Date().getFullYear()} {profile.name}. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span className="text-muted/60">Designed &amp; Engineered with React + Tailwind</span>
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 text-foreground hover:text-accent transition-colors"
            >
              <span>TOP</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

