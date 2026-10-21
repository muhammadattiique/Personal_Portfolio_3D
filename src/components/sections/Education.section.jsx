import { GraduationCap, MapPin } from 'lucide-react';
import { education } from '../../data/experience';
import { SectionHeader } from '../ui/SectionHeader';
import { Reveal } from '../ui/Reveal';

// Dedicated Education section: a vertical timeline of academic history, from the
// current BSCS degree back through intermediate and matriculation.
export function Education() {
  if (!education || education.length === 0) return null;

  return (
    <section id="education" className="py-24 md:py-32 scroll-mt-20 border-t border-border">
      <div className="max-w-editorial mx-auto px-5 md:px-8">
        <SectionHeader
          number="05"
          label="EDUCATION"
          title="Academic Background"
          subtitle="My academic journey and the foundations behind my engineering work."
        />

        <div className="relative max-w-3xl">
          {/* Vertical timeline line */}
          <div
            aria-hidden="true"
            className="absolute left-5 top-2 bottom-2 w-px bg-border"
          />

          <div className="space-y-8">
            {education.map((edu, idx) => (
              <Reveal key={edu.id} delay={idx * 0.1}>
                <div className="relative pl-14">
                  {/* Timeline node */}
                  <span className="absolute left-0 top-1 inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface-elevated border border-accent/40 text-accent">
                    <GraduationCap size={18} />
                  </span>

                  <div className="p-6 md:p-7 rounded-2xl bg-surface border border-border transition-all duration-300 hover:border-border-strong">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <span className="font-mono text-xs text-accent uppercase tracking-wider">
                        {edu.duration}
                      </span>
                      {edu.score && (
                        <span className="inline-flex w-fit items-center px-2.5 py-1 rounded-full bg-accent-soft text-accent font-mono text-[11px] font-semibold">
                          {edu.score}
                        </span>
                      )}
                    </div>

                    <h3 className="mt-3 font-display text-xl md:text-2xl font-bold text-foreground">
                      {edu.degree}
                    </h3>
                    <p className="mt-1 text-sm text-muted">{edu.institution}</p>

                    {edu.location && (
                      <p className="mt-1 flex items-center gap-1.5 font-mono text-[11px] text-muted/70">
                        <MapPin size={12} className="text-accent/60" />
                        {edu.location}
                      </p>
                    )}

                    {edu.details && (
                      <p className="mt-4 pt-4 border-t border-border text-sm text-muted/90 leading-relaxed">
                        {edu.details}
                      </p>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
