import { forwardRef } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils';

export const Button = forwardRef(function Button(
  {
    children,
    to,
    href,
    variant = 'primary',
    size = 'md',
    className = '',
    icon,
    iconPosition = 'right',
    disabled = false,
    ...props
  },
  ref
) {
  const baseStyles =
    'inline-flex items-center justify-center font-sans font-medium transition-all duration-300 disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 rounded-full gap-1.5 tracking-wider uppercase',
    md: 'text-sm px-5 py-2.5 rounded-full gap-2 tracking-wide',
    lg: 'text-base px-7 py-3.5 rounded-full gap-2.5 tracking-wide',
  };

  const variantStyles = {
    primary:
      'bg-accent text-background hover:bg-white hover:text-background shadow-[0_0_20px_rgba(198,255,61,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] font-semibold',
    secondary:
      'bg-surface-elevated text-foreground border border-border hover:border-accent hover:text-accent',
    outline:
      'bg-transparent text-foreground border border-border-strong hover:border-accent hover:text-accent hover:bg-accent/5',
    ghost:
      'bg-transparent text-muted hover:text-foreground hover:bg-surface/50',
    link:
      'p-0 rounded-none bg-transparent text-foreground hover:text-accent underline underline-offset-4',
  };

  const combinedClasses = cn(
    baseStyles,
    sizeStyles[size],
    variantStyles[variant],
    className
  );

  const content = (
    <>
      {icon && iconPosition === 'left' && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="shrink-0 transition-transform duration-300 group-hover:translate-x-1">{icon}</span>}
    </>
  );

  if (to) {
    return (
      <Link ref={ref} to={to} className={combinedClasses} {...props}>
        {content}
      </Link>
    );
  }

  if (href) {
    const isExternal = href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:');
    return (
      <a
        ref={ref}
        href={href}
        className={combinedClasses}
        target={isExternal && !href.startsWith('mailto:') ? '_blank' : undefined}
        rel={isExternal && !href.startsWith('mailto:') ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {content}
      </a>
    );
  }

  return (
    <button ref={ref} disabled={disabled} className={combinedClasses} {...props}>
      {content}
    </button>
  );
});

