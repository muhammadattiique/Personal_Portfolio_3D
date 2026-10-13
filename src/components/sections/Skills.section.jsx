import { skillCategories, marqueeSkills } from '../../data/skills';
import { SectionHeader } from '../ui/SectionHeader';
import { Tag } from '../ui/Tag';
import { Marquee } from '../ui/Marquee';
import { Reveal } from '../ui/Reveal';
import { motion } from 'framer-motion';

export function Skills() {
  return (
    <section id="skills" className="py-24 md:py-32 scroll-mt-20 border-t border-border">
      <div className="max-w-editorial mx-auto px-5 md:px-8 mb-16">
        <SectionHeader
          number="03"
          label="SKILLS & TECHNOLOGIES"
          title="Engineered Tooling & Technical Capabilities"
          subtitle="Curated languages, modern frameworks, and runtime environments deployed across production environments."
        />

        {/* 4-Column / 2-Row Category Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skillCategories.map((cat, idx) => (
            <Reveal key={cat.title} delay={idx * 0.1} cascade>
              <motion.div
                layout
                className="p-8 rounded-2xl bg-surface border border-border h-full flex flex-col justify-between transition-all duration-300 hover:border-border-strong hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
                    <span className="font-mono text-eyebrow text-accent font-semibold">
                      {cat.number}
                    </span>
                    <span className="font-mono text-xs text-muted/60 uppercase">
                      {cat.skills.length} TOOLS
                    </span>
                  </div>

                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {cat.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed">
                    {cat.description}
                  </p>
                </div>

                <div className="mt-8 flex flex-wrap gap-2">
                  {cat.skills.map((skill) => (
                    <motion.div key={skill.name} layout>
                      <Tag size="md" className="group-hover:scale-105 transition-transform duration-200">
                        {skill.name}
                      </Tag>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Infinite Marquee Strip */}
      <Marquee items={marqueeSkills} speed="normal" />
    </section>
  );
}

