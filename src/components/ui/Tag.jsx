import { cn } from '../../utils';

export function Tag({ children, size = 'md', variant = 'default', className = '' }) {
  const sizeStyles = {
    sm: 'text-[11px] px-2.5 py-1',
    md: 'text-xs px-3 py-1.5',
  };

  const variantStyles = {
    default: 'bg-surface text-muted border border-border hover:border-border-strong hover:text-foreground',
    accent: 'bg-accent-soft text-accent border border-accent/20',
    outline: 'bg-transparent text-muted border border-border hover:text-foreground',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-mono rounded-full font-medium transition-colors duration-200 select-none tracking-wide',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

