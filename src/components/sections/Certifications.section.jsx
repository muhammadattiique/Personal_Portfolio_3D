import { Award, BadgeCheck, Trophy } from 'lucide-react';
import { profile } from '../../data/profile';
import { SectionHeader } from '../ui/SectionHeader';
import { Tag } from '../ui/Tag';
import { Reveal } from '../ui/Reveal';

// Merge certifications and achievements into one ordered list. Achievements are
// visually distinguished with a trophy icon and an accent ring.
const items = [
  ...(profile.certifications ?? []).map((c) => ({ ...c, isAchievement: false })),
  ...(profile.achievements ?? []).map((a) => ({ ...a, isAchievement: true })),
];

export function Certifications() {
  if (items.length === 0) return null;

  return (
    <section id="certifications" className="py-24 md:py-32 scroll-mt-20 border-t border-border">
      <div className="max-w-editorial mx-auto px-5 md:px-8">
        <SectionHeader
          number="07"
          label="CERTIFICATIONS &amp; ACHIEVEMENTS"
          title="Credentials &amp; Recognition"
          subtitle="Professional certifications and competitive achievements that back up the engineering work."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {items.map((item, idx) => (
            <Reveal key={`${item.title}-${idx}`} delay={idx * 0.08}>
              <div
                className={`relative p-7 md:p-8 rounded-2xl bg-surface border h-full flex flex-col transition-all duration-300 group ${
                  item.isAchievement
                    ? 'border-accent/40 hover:border-accent'
                    : 'border-border hover:border-border-strong'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <span
                    className={`inline-flex items-center justify-center w-12 h-12 rounded-xl border ${
                      item.isAchievement
                        ? 'bg-accent/10 border-accent/40 text-accent'
                        : 'bg-surface-elevated border-border text-accent'
                    }`}
                  >
                    {item.isAchievement ? (
                      <Trophy size={22} />
                    ) : (
                      <BadgeCheck size={22} />
                    )}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted/70">
                    {item.type}
                  </span>
                </div>

                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground leading-tight transition-colors group-hover:text-accent">
                  {item.title}
                </h3>

                <div className="mt-2 flex items-center gap-2 text-sm text-muted">
                  <Award size={14} className="text-accent/70 shrink-0" />
                  <span>{item.issuer}</span>
                </div>

                {item.description && (
                  <p className="mt-4 text-muted text-sm leading-relaxed">
                    {item.description}
                  </p>
                )}

                <div className="mt-auto pt-6">
                  <Tag size="sm">{item.isAchievement ? 'Achievement' : 'Certified'}</Tag>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
