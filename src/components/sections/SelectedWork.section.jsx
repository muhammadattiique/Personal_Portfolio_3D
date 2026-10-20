import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { projects } from '../../data/projects';
import { SectionHeader } from '../ui/SectionHeader';
import { ProjectCard } from '../ui/ProjectCard';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';
import { useReducedMotion } from '../../hooks';

export function SelectedWork() {
  const [showAll, setShowAll] = useState(false);
  const reducedMotion = useReducedMotion();

  // Only the four strongest, recruiter-appealing projects headline the grid.
  const featuredProjects = projects.filter((p) => p.featured).slice(0, 4);
  const restProjects = projects.filter((p) => !featuredProjects.includes(p));

  return (
    <section id="work" className="py-24 md:py-32 scroll-mt-20">
      <div className="max-w-editorial mx-auto px-5 md:px-8">
        {/* Section Header */}
        <SectionHeader
          number="01"
          label="SELECTED WORK"
          title="Engineered Systems & Creative Interfaces"
          subtitle="A selection of production systems, 3D spatial web experiments, and robust client-side software."
          action={
            <Button
              to="/projects"
              variant="outline"
              size="sm"
              icon={<ArrowRight size={14} />}
            >
              All Projects ({projects.length})
            </Button>
          }
        />

        {/* Featured Project Grid (top 4) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {featuredProjects.map((project, idx) => (
            <Reveal key={project.id} delay={idx * 0.15}>
              <ProjectCard project={project} priority={idx === 0} />
            </Reveal>
          ))}
        </div>

        {/* Expandable "See all" reveal for the remaining projects */}
        {restProjects.length > 0 && (
          <>
            <AnimatePresence initial={false}>
              {showAll && (
                <motion.div
                  key="rest"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.215, 0.61, 0.355, 1] }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 mt-8 md:mt-10">
                    {restProjects.map((project, idx) => (
                      <motion.div
                        key={project.id}
                        initial={reducedMotion ? false : { opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.5,
                          delay: reducedMotion ? 0 : idx * 0.08,
                          ease: [0.215, 0.61, 0.355, 1],
                        }}
                      >
                        <ProjectCard project={project} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Toggle control */}
            <div className="mt-12 flex justify-center">
              <Button
                onClick={() => setShowAll((v) => !v)}
                variant="outline"
                size="md"
                aria-expanded={showAll}
                icon={showAll ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                iconPosition="right"
              >
                {showAll ? 'Show less' : `See all projects (${projects.length})`}
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
