import { Link } from 'react-router-dom';
import { ArrowUpRight, Github } from 'lucide-react';
import { Tag } from './Tag';

export function ProjectCard({ project, priority = false }) {
  const { slug, number, title, subtitle, year, tags, coverImage, github, category } = project;

  return (
    <article
      data-cursor="view"
      className="group relative flex flex-col rounded-2xl bg-surface border border-border overflow-hidden transition-all duration-500 hover:border-border-strong hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
    >
      {/* Clickable Image Container */}
      <Link
        to={`/projects/${slug}`}
        aria-label={`View case study for ${title}`}
        className="relative block aspect-[16/10] overflow-hidden bg-surface-elevated"
      >
        <img
          src={coverImage}
          alt={`Mockup and interface of ${title}`}
          loading={priority ? 'eager' : 'lazy'}
          width={1600}
          height={1000}
          className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Dark Gradient Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

        {/* Top Badges: Number & Category */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
          <span className="font-mono text-xs font-semibold px-2.5 py-1 rounded-md bg-background/80 backdrop-blur-md border border-white/10 text-accent">
            {number}
          </span>
          {category && (
            <span className="font-mono text-[11px] uppercase tracking-wider px-2.5 py-1 rounded-md bg-background/80 backdrop-blur-md border border-white/10 text-muted">
              {category}
            </span>
          )}
        </div>
      </Link>

      {/* Card Body */}
      <div className="p-6 md:p-8 flex flex-col flex-1 justify-between gap-6">
        <div>
          {/* Header Row: Title, Year & Primary Arrow */}
          <div className="flex items-start justify-between gap-4">
            <Link to={`/projects/${slug}`} className="group/title block">
              <h3 className="font-display text-xl md:text-2xl font-bold text-foreground transition-colors duration-300 group-hover/title:text-accent">
                {title}
              </h3>
            </Link>

            <span className="shrink-0 font-mono text-xs text-muted/60 mt-1">
              {year}
            </span>
          </div>

          {/* Subtitle */}
          <p className="mt-2 text-sm md:text-base text-muted line-clamp-2 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Footer Row: Tags & Direct Action Links */}
        <div className="pt-4 border-t border-border flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1.5">
            {tags.slice(0, 3).map((tag) => (
              <Tag key={tag} size="sm">
                {tag}
              </Tag>
            ))}
            {tags.length > 3 && (
              <span className="font-mono text-[11px] text-muted/50 px-1">
                +{tags.length - 3}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {github && (
              <a
                href={github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`GitHub repository for ${title}`}
                className="text-muted hover:text-foreground transition-colors p-1.5 rounded-full hover:bg-white/5"
              >
                <Github size={16} />
              </a>
            )}
            <Link
              to={`/projects/${slug}`}
              className="inline-flex items-center gap-1 font-mono text-xs text-accent hover:text-white transition-colors"
            >
              <span>CASE STUDY</span>
              <ArrowUpRight size={14} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
