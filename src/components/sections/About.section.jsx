import { profile } from '../../data/profile';
import { SectionHeader } from '../ui/SectionHeader';
import { Reveal } from '../ui/Reveal';

export function About() {
  return (
    <section id="about" className="py-24 md:py-32 scroll-mt-20 border-t border-border">
      <div className="max-w-editorial mx-auto px-5 md:px-8">
        <SectionHeader
          number="02"
          label="ABOUT"
          title="Bridging Architectural Rigor & Visual Craft"
          subtitle="Software engineer dedicated to clean pipelines, zero-latency interactions, and expressive digital media."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Editorial Bio Paragraphs */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-base md:text-lg text-muted leading-relaxed">
            {profile.bio.map((paragraph, idx) => (
              <Reveal key={idx} delay={idx * 0.1}>
                <p className="text-balance">{paragraph}</p>
              </Reveal>
            ))}

            <Reveal delay={0.3}>
              <div className="p-6 rounded-2xl bg-surface border border-border mt-4">
                <span className="font-mono text-eyebrow text-accent uppercase tracking-wider block mb-2">
                  ENGINEERING PHILOSOPHY
                </span>
                <p className="font-display text-xl text-foreground font-medium">
                  "Every millisecond saved in network roundtrips and every frame retained at 60fps directly elevates the human experience."
                </p>
              </div>
            </Reveal>
          </div>

          {/* Right Column: Key Stats & Location Box */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {profile.stats.map((stat, idx) => (
              <Reveal key={stat.label} delay={idx * 0.15}>
                <div className="p-6 md:p-8 rounded-2xl bg-surface border border-border flex items-baseline justify-between transition-all duration-300 hover:border-border-strong">
                  <div>
                    <div className="font-display text-4xl md:text-5xl font-extrabold text-foreground tracking-tight">
                      {stat.value}
                    </div>
                    <div className="font-mono text-xs uppercase tracking-widest text-muted mt-2">
                      {stat.label}
                    </div>
                  </div>
                  <span className="font-mono text-xs text-muted/40">
                    0{idx + 1}
                  </span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

