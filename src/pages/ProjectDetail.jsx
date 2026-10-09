import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, ArrowRight, ArrowUpRight, Github, ExternalLink } from 'lucide-react';
import { getProjectBySlug, getAdjacentProjects } from '../data/projects';
import { profile } from '../data/profile';
import { Button } from '../components/ui/Button';
import { Tag } from '../components/ui/Tag';
import { Reveal } from '../components/ui/Reveal';

export default function ProjectDetail() {
  const { slug } = useParams();
  const project = getProjectBySlug(slug);

  // Scroll to top upon navigating to a new case study
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  if (!project) {
    return (
      <main className="min-h-[80vh] flex flex-col items-center justify-center text-center px-5 pt-32">
        <h1 className="font-display text-4xl font-bold text-foreground">
          Project Not Located
        </h1>
        <p className="mt-4 text-muted font-mono text-sm">
          The requested case study could not be found in our archives.
        </p>
        <Button to="/projects" variant="primary" className="mt-8" icon={<ArrowLeft size={16} />}>
          View All Projects
        </Button>
      </main>
    );
  }

  const { prev, next } = getAdjacentProjects(slug);

  return (
    <>
      <Helmet>
        <title>{project.title} — {profile.name}</title>
        <meta name="description" content={project.summary} />
        <meta property="og:title" content={`${project.title} — Case Study`} />
        <meta property="og:description" content={project.summary} />
        <meta property="og:image" content={project.coverImage} />
      </Helmet>

      <main className="pt-28 md:pt-36 pb-24 md:pb-32 min-h-screen">
        <article className="max-w-editorial mx-auto px-5 md:px-8">
          {/* Top Breadcrumb */}
          <div className="flex items-center justify-between pb-8 border-b border-border mb-12">
            <Link
              to="/projects"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted hover:text-accent transition-colors"
            >
              <ArrowLeft size={14} />
              <span>RETURN TO WORK DIRECTORY</span>
            </Link>

            <span className="font-mono text-xs text-muted/60">
              {project.number} / 04
            </span>
          </div>

          {/* Header Row: Title & Subtitle */}
          <div className="max-w-4xl mb-12">
            <div className="flex items-center gap-3 mb-4">
              <span className="font-mono text-eyebrow text-accent font-semibold">
                CASE STUDY
              </span>
              <span className="text-muted/40 font-mono text-xs">/</span>
              <span className="font-mono text-eyebrow text-muted uppercase tracking-[0.2em]">
                {project.category}
              </span>
            </div>

            <h1 className="font-display text-display-lg font-extrabold text-foreground tracking-tight leading-[0.95] text-balance">
              {project.title}
            </h1>

            <p className="mt-6 text-lg md:text-xl text-muted leading-relaxed max-w-3xl text-balance">
              {project.subtitle}
            </p>
          </div>

          {/* Project Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 p-6 md:p-8 rounded-2xl bg-surface border border-border mb-12">
            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted/60 block mb-1">
                ROLE
              </span>
              <span className="font-display font-medium text-sm md:text-base text-foreground">
                {project.role}
              </span>
            </div>

            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted/60 block mb-1">
                CLIENT / CONTEXT
              </span>
              <span className="font-display font-medium text-sm md:text-base text-foreground">
                {project.client}
              </span>
            </div>

            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted/60 block mb-1">
                YEAR
              </span>
              <span className="font-mono text-sm md:text-base text-foreground">
                {project.year}
              </span>
            </div>

            <div>
              <span className="font-mono text-[11px] uppercase tracking-wider text-muted/60 block mb-1">
                REPOSITORIES &amp; LINKS
              </span>
              <div className="flex items-center gap-3 mt-1">
                {project.github && (
                  <a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-foreground hover:text-accent transition-colors"
                  >
                    <Github size={14} />
                    <span>CODE</span>
                  </a>
                )}
                {project.live && (
                  <a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:text-white transition-colors"
                  >
                    <ExternalLink size={14} />
                    <span>DEMO</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div className="flex flex-wrap items-center gap-2 mb-12">
            <span className="font-mono text-xs text-muted/60 mr-2">TECH STACK:</span>
            {project.tags.map((tag) => (
              <Tag key={tag} size="md" variant="default">
                {tag}
              </Tag>
            ))}
          </div>

          {/* Featured Large Mockup (16:10) */}
          <Reveal>
            <div className="rounded-2xl overflow-hidden border border-border bg-surface-elevated shadow-2xl mb-20 aspect-[16/10]">
              <img
                src={project.coverImage}
                alt={`System architecture & UI preview of ${project.title}`}
                className="w-full h-full object-cover"
                width={1600}
                height={1000}
              />
            </div>
          </Reveal>

          {/* Deep-Dive Case Study Content */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 pb-20 border-b border-border">
            {/* Left Col: Executive Summary & Overview */}
            <div className="lg:col-span-4">
              <div className="sticky top-28">
                <span className="font-mono text-eyebrow text-accent uppercase tracking-widest block mb-2">
                  01 / OVERVIEW
                </span>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4">
                  Executive Brief
                </h2>
                <p className="text-sm md:text-base text-muted leading-relaxed">
                  {project.summary}
                </p>

                <div className="mt-8 flex flex-col gap-3">
                  {project.live && (
                    <Button
                      href={project.live}
                      variant="primary"
                      size="md"
                      icon={<ArrowUpRight size={16} />}
                    >
                      Launch Live Interface
                    </Button>
                  )}
                  {project.github && (
                    <Button
                      href={project.github}
                      variant="outline"
                      size="md"
                      icon={<Github size={16} />}
                    >
                      Inspect Source Code
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Right Col: Challenge, Solution, Results */}
            <div className="lg:col-span-8 flex flex-col gap-14">
              {/* Detailed Overview */}
              <div>
                <span className="font-mono text-eyebrow text-muted uppercase tracking-widest block mb-2">
                  CONTEXT &amp; OBJECTIVE
                </span>
                <p className="text-base md:text-lg text-foreground/90 leading-relaxed">
                  {project.overview}
                </p>
              </div>

              {/* The Challenge */}
              <div className="p-8 rounded-2xl bg-surface border border-border">
                <span className="font-mono text-eyebrow text-accent uppercase tracking-widest block mb-2">
                  02 / THE CHALLENGE
                </span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
                  Engineering Bottlenecks &amp; Constraints
                </h3>
                <p className="text-sm md:text-base text-muted leading-relaxed">
                  {project.challenge}
                </p>
              </div>

              {/* Architectural Solution */}
              <div className="p-8 rounded-2xl bg-surface border border-border">
                <span className="font-mono text-eyebrow text-accent uppercase tracking-widest block mb-2">
                  03 / ARCHITECTURAL SOLUTION
                </span>
                <h3 className="font-display text-xl md:text-2xl font-bold text-foreground mb-3">
                  Implementation Strategy
                </h3>
                <p className="text-sm md:text-base text-muted leading-relaxed">
                  {project.solution}
                </p>
              </div>

              {/* Measured Results */}
              <div>
                <span className="font-mono text-eyebrow text-accent uppercase tracking-widest block mb-4">
                  04 / MEASURED IMPACT &amp; OUTCOMES
                </span>
                <ul className="space-y-4">
                  {project.results.map((result, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-3 p-4 rounded-xl bg-surface border border-border text-sm md:text-base text-foreground/90"
                    >
                      <span className="w-5 h-5 rounded-full bg-accent-soft text-accent flex items-center justify-center shrink-0 text-xs font-mono font-bold mt-0.5">
                        ✓
                      </span>
                      <span>{result}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* Adjacent Project Navigation Footer */}
          <div className="pt-16 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {prev && (
              <Link
                to={`/projects/${prev.slug}`}
                className="group p-8 rounded-2xl bg-surface border border-border hover:border-accent transition-all flex flex-col justify-between"
              >
                <div className="flex items-center gap-2 font-mono text-xs text-muted mb-4">
                  <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
                  <span>PREVIOUS PROJECT</span>
                </div>
                <div>
                  <div className="font-mono text-xs text-accent mb-1">{prev.number}</div>
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                    {prev.title}
                  </h3>
                </div>
              </Link>
            )}

            {next && (
              <Link
                to={`/projects/${next.slug}`}
                className="group p-8 rounded-2xl bg-surface border border-border hover:border-accent transition-all flex flex-col justify-between sm:text-right"
              >
                <div className="flex items-center justify-end gap-2 font-mono text-xs text-muted mb-4">
                  <span>NEXT PROJECT</span>
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
                </div>
                <div>
                  <div className="font-mono text-xs text-accent mb-1">{next.number}</div>
                  <h3 className="font-display text-xl font-bold text-foreground group-hover:text-accent transition-colors">
                    {next.title}
                  </h3>
                </div>
              </Link>
            )}
          </div>
        </article>
      </main>
    </>
  );
}
