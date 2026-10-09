import { experiences, education } from '../../data/experience';
import { SectionHeader } from '../ui/SectionHeader';
import { Tag } from '../ui/Tag';
import { Reveal } from '../ui/Reveal';

export function Experience() {
  return (
    <section id="experience" className="py-24 md:py-32 scroll-mt-20 border-t border-border">
      <div className="max-w-editorial mx-auto px-5 md:px-8">
        <SectionHeader
          number="04"
          label="EXPERIENCE &amp; BACKGROUND"
          title="Career Journey &amp; Academic Foundation"
          subtitle="Real-world engineering roles, sprint responsibilities, and computer science foundations."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Work Experience Column */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            <span className="font-mono text-eyebrow text-muted uppercase tracking-[0.2em] block mb-2">
              WORK HISTORY
            </span>

            {experiences.map((exp, idx) => (
              <Reveal key={exp.id} delay={idx * 0.15}>
                <div className="p-8 rounded-2xl bg-surface border border-border transition-all duration-300 hover:border-border-strong">
                  {/* Top Header: Company, Role & Duration */}
                  <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 pb-6 border-b border-border">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="font-display text-2xl font-bold text-foreground">
                          {exp.company}
                        </h3>
                        {exp.isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-accent-soft text-accent font-mono text-[10px] uppercase font-semibold">
                            ACTIVE
                          </span>
                        )}
                      </div>
                      <p className="font-mono text-sm text-accent mt-1">
                        {exp.role}
                      </p>
                    </div>

                    <div className="text-right sm:self-start">
                      <span className="font-mono text-xs text-muted">
                        {exp.duration}
                      </span>
                      <p className="font-mono text-[11px] text-muted/60 mt-0.5">
                        {exp.location}
                      </p>
                    </div>
                  </div>

                  {/* Description & Responsibilities */}
                  <div className="mt-6">
                    <p className="text-sm md:text-base text-muted leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    <ul className="space-y-2 mb-6">
                      {exp.highlights.map((item, hIdx) => (
                        <li key={hIdx} className="flex items-start gap-2.5 text-sm text-muted">
                          <span className="text-accent mt-1 font-mono text-xs">▹</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tech Badges */}
                    <div className="flex flex-wrap gap-1.5 pt-4 border-t border-border/60">
                      {exp.tags.map((tag) => (
                        <Tag key={tag} size="sm">
                          {tag}
                        </Tag>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* Education & Credentials Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <span className="font-mono text-eyebrow text-muted uppercase tracking-[0.2em] block mb-2">
              ACADEMIC CREDENTIALS
            </span>

            {education.map((edu, idx) => (
              <Reveal key={edu.id} delay={0.2 + idx * 0.1}>
                <div className="p-8 rounded-2xl bg-surface border border-border">
                  <span className="font-mono text-xs text-accent uppercase tracking-wider block mb-2">
                    {edu.duration}
                  </span>
                  <h3 className="font-display text-xl font-bold text-foreground">
                    {edu.degree}
                  </h3>
                  <p className="font-mono text-xs text-muted mt-1">
                    {edu.institution}
                  </p>
                  <p className="mt-4 text-xs md:text-sm text-muted/80 leading-relaxed pt-4 border-t border-border">
                    {edu.details}
                  </p>
                </div>
              </Reveal>
            ))}

            <Reveal delay={0.35}>
              <div className="p-8 rounded-2xl bg-surface-elevated border border-border">
                <span className="font-mono text-eyebrow text-accent uppercase tracking-wider block mb-2">
                  RESUME / CV
                </span>
                <p className="text-xs text-muted mb-4 leading-relaxed">
                  Download my full professional curriculum vitae with complete project logs and technical proficiencies.
                </p>
                <a
                  href="/resume.pdf"
                  download
                  className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-foreground hover:text-accent border border-border hover:border-accent px-4 py-2 rounded-full transition-colors"
                >
                  Download Resume (PDF)
                </a>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

