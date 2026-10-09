import { profile } from '../../data/profile';
import { SectionHeader } from '../ui/SectionHeader';
import { Tag } from '../ui/Tag';
import { Reveal } from '../ui/Reveal';

export function Services() {
  return (
    <section className="py-24 md:py-32 scroll-mt-20 border-t border-border">
      <div className="max-w-editorial mx-auto px-5 md:px-8">
        <SectionHeader
          number="05"
          label="SERVICES &amp; EXPERTISE"
          title="Engineering Disciplines &amp; Problem Domains"
          subtitle="How I help founders, engineering leads, and product teams build robust digital realities."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {profile.services.map((service, idx) => (
            <Reveal key={service.title} delay={idx * 0.1}>
              <div className="p-8 md:p-10 rounded-2xl bg-surface border border-border h-full flex flex-col justify-between transition-all duration-300 hover:border-border-strong group">
                <div>
                  <div className="flex items-center justify-between pb-6 border-b border-border mb-6">
                    <span className="font-mono text-eyebrow text-accent font-semibold">
                      {service.number}
                    </span>
                    <span className="font-mono text-xs text-muted/60 uppercase">
                      DISCIPLINE
                    </span>
                  </div>

                  <h3 className="font-display text-2xl md:text-3xl font-bold text-foreground transition-colors group-hover:text-accent">
                    {service.title}
                  </h3>

                  <p className="mt-4 text-muted text-sm md:text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-border flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
                    <Tag key={tag} size="sm">
                      {tag}
                    </Tag>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

