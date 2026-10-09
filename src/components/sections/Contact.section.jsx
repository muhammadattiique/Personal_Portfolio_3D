import { useState } from 'react';
import { Send, Check, Copy, ArrowUpRight } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { profile } from '../../data/profile';
import { SectionHeader } from '../ui/SectionHeader';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function Contact() {
  const [copied, setCopied] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus({ type: '', message: '' });

    const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
    const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

    // Check if real EmailJS credentials are configured
    const isConfigured =
      serviceId &&
      serviceId !== 'your_service_id' &&
      templateId &&
      templateId !== 'your_template_id';

    if (isConfigured) {
      try {
        await emailjs.send(
          serviceId,
          templateId,
          {
            from_name: formData.name,
            from_email: formData.email,
            subject: formData.subject,
            message: formData.message,
            to_name: profile.name,
          },
          publicKey
        );

        setStatus({
          type: 'success',
          message: 'Message dispatched successfully. I will get back to you promptly!',
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } catch {
        setStatus({
          type: 'error',
          message: 'Unable to send message directly. Please email me at ' + profile.email,
        });
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Graceful local submission fallback simulation
      setTimeout(() => {
        setStatus({
          type: 'success',
          message:
            'Message recorded! (EmailJS placeholder detected — note in README to connect credentials).',
        });
        setIsSubmitting(false);
        setFormData({ name: '', email: '', subject: '', message: '' });
      }, 900);
    }
  };

  return (
    <section id="contact" className="py-24 md:py-32 scroll-mt-20 border-t border-border">
      <div className="max-w-editorial mx-auto px-5 md:px-8">
        <SectionHeader
          number="06"
          label="CONTACT &amp; COLLABORATION"
          title="Let's Build Something Exceptional"
          subtitle="Open for innovative engineering roles, full-stack architectural contracts, and creative spatial web experiments."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Left Column: Direct Inquiries & Social Coordinates */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div>
              <span className="font-mono text-eyebrow text-muted uppercase tracking-[0.2em] block mb-3">
                DIRECT CHANNELS
              </span>

              {/* Large Clickable Email Block */}
              <div className="p-8 rounded-2xl bg-surface border border-border mt-4">
                <span className="font-mono text-xs text-muted block mb-2">EMAIL ADDRESS</span>
                <div className="font-display text-xl md:text-2xl font-bold text-foreground break-all">
                  {profile.email}
                </div>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={handleCopyEmail}
                    variant="outline"
                    size="sm"
                    icon={copied ? <Check size={14} className="text-accent" /> : <Copy size={14} />}
                  >
                    {copied ? 'Copied' : 'Copy Email'}
                  </Button>

                  <Button
                    href={`mailto:${profile.email}`}
                    variant="primary"
                    size="sm"
                    icon={<ArrowUpRight size={14} />}
                  >
                    Send Mail
                  </Button>
                </div>
              </div>
            </div>

            {/* Social Network Coordinates */}
            <div className="mt-10">
              <span className="font-mono text-eyebrow text-muted uppercase tracking-[0.2em] block mb-4">
                NETWORK &amp; PROFILES
              </span>

              <div className="flex flex-col gap-3">
                {profile.socials.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-xl bg-surface border border-border text-foreground hover:border-accent hover:text-accent transition-colors group"
                  >
                    <div>
                      <div className="font-display font-medium text-base">{social.label}</div>
                      <div className="font-mono text-xs text-muted group-hover:text-accent/80">
                        {social.username}
                      </div>
                    </div>
                    <ArrowUpRight size={18} className="text-muted group-hover:text-accent transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Minimal Dark Form */}
          <div className="lg:col-span-7">
            <div className="p-8 md:p-10 rounded-2xl bg-surface border border-border">
              <h3 className="font-display text-2xl font-bold text-foreground mb-2">
                Send an Inquiry
              </h3>
              <p className="text-sm text-muted mb-8">
                Fill in the details below to initiate a conversation.
              </p>

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-mono text-xs uppercase tracking-wider text-muted mb-2"
                    >
                      Your Name *
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="e.g. John Doe"
                      className="w-full px-4 py-3.5 rounded-xl bg-surface-elevated border border-border text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent font-sans text-sm transition-colors"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block font-mono text-xs uppercase tracking-wider text-muted mb-2"
                    >
                      Email Address *
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. john@company.com"
                      className="w-full px-4 py-3.5 rounded-xl bg-surface-elevated border border-border text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent font-sans text-sm transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block font-mono text-xs uppercase tracking-wider text-muted mb-2"
                  >
                    Subject
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="Project Inquiry / Full-time Role"
                    className="w-full px-4 py-3.5 rounded-xl bg-surface-elevated border border-border text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent font-sans text-sm transition-colors"
                  />
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-mono text-xs uppercase tracking-wider text-muted mb-2"
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, timeline, or requirements..."
                    className="w-full px-4 py-3.5 rounded-xl bg-surface-elevated border border-border text-foreground placeholder:text-muted/40 focus:outline-none focus:border-accent font-sans text-sm transition-colors resize-none"
                  />
                </div>

                {status.message && (
                  <div
                    className={`p-4 rounded-xl font-mono text-xs ${
                      status.type === 'success'
                        ? 'bg-accent-soft text-accent border border-accent/20'
                        : 'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}
                  >
                    {status.message}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  size="lg"
                  className="w-full mt-2"
                  icon={<Send size={16} />}
                >
                  {isSubmitting ? 'Transmitting Message...' : 'Transmit Message'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
