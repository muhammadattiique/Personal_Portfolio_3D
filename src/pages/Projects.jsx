import { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { projects } from '../data/projects';
import { SectionHeader } from '../components/ui/SectionHeader';
import { ProjectCard } from '../components/ui/ProjectCard';
import { Reveal } from '../components/ui/Reveal';
import { profile } from '../data/profile';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Extract unique categories
  const categories = useMemo(() => {
    const set = new Set(projects.map((p) => p.category));
    return ['All', ...Array.from(set)];
  }, []);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects;
    return projects.filter((p) => p.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <>
      <Helmet>
        <title>All Projects — {profile.name}</title>
        <meta
          name="description"
          content={`Complete catalog of software, 3D web specimens, and systems engineered by ${profile.name}.`}
        />
      </Helmet>

      <main className="pt-32 pb-24 md:pb-32 min-h-screen">
        <div className="max-w-editorial mx-auto px-5 md:px-8">
          {/* Breadcrumb / Return to home link */}
          <div className="mb-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-accent transition-colors"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO INDEX</span>
            </Link>
          </div>

          {/* Section Header */}
          <SectionHeader
            number="01"
            label="PROJECT DIRECTORY"
            title="Complete Engineering Catalog"
            subtitle="Browse all featured systems, interactive 3D experiments, and full-stack applications."
          />

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full border transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-accent text-background border-accent font-semibold shadow-[0_0_15px_rgba(198,255,61,0.25)]'
                    : 'bg-surface text-muted border-border hover:border-border-strong hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
            {filteredProjects.map((project, idx) => (
              <Reveal key={project.id} delay={idx * 0.1}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
        </div>
      </main>
    </>
  );
}

