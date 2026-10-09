import { cn } from '../../utils';

export function SectionHeader({
  number,
  label,
  title,
  subtitle,
  description,
  action,
  className = '',
  align = 'left',
}) {
  return (
    <div className={cn('mb-12 md:mb-16', className)}>
      {/* Editorial Number & Label */}
      <div className="flex items-center gap-3 mb-4">
        {number && (
          <span className="font-mono text-eyebrow text-accent font-semibold">
            {number}
          </span>
        )}
        {number && label && (
          <span className="text-muted/40 font-mono text-xs">/</span>
        )}
        {label && (
          <span className="font-mono text-eyebrow uppercase text-muted tracking-[0.2em]">
            {label}
          </span>
        )}
      </div>

      {/* Main Title Row with optional Action Button */}
      <div
        className={cn(
          'flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border',
          align === 'center' && 'md:text-center md:items-center'
        )}
      >
        <div className="max-w-3xl">
          <h2 className="font-display text-h1 font-bold text-foreground text-balance tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-3 text-muted text-base md:text-lg text-balance">
              {subtitle}
            </p>
          )}
        </div>

        {action && (
          <div className="shrink-0 pt-2 md:pt-0">
            {action}
          </div>
        )}
      </div>

      {description && (
        <p className="mt-6 text-muted text-sm md:text-base max-w-2xl leading-relaxed">
          {description}
        </p>
      )}
    </div>
  );
}

