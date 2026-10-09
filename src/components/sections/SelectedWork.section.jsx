import { ArrowRight } from 'lucide-react';
import { projects } from '../../data/projects';
import { SectionHeader } from '../ui/SectionHeader';
import { ProjectCard } from '../ui/ProjectCard';
import { Button } from '../ui/Button';
import { Reveal } from '../ui/Reveal';

export function SelectedWork() {
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

        {/* Project Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          {projects.map((project, idx) => (
            <Reveal key={project.id} delay={idx * 0.15}>
              <ProjectCard project={project} priority={idx === 0} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

