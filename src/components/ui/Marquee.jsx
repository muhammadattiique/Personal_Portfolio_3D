import { cn } from '../../utils';

export function Marquee({
  items = [],
  speed = 'normal',
  reverse = false,
  pauseOnHover = true,
  className = '',
  separator = '•',
}) {
  const speedClass = {
    slow: 'duration-[60s]',
    normal: 'duration-[35s]',
    fast: 'duration-[20s]',
  }[speed] || 'duration-[35s]';

  // Duplicate items 4 times to ensure seamless infinite looping on ultra-wide screens
  const repeatedItems = [...items, ...items, ...items, ...items];

  return (
    <div
      className={cn(
        'group relative overflow-hidden py-4 border-y border-border select-none bg-surface/30',
        className
      )}
    >
      <div
        className={cn(
          'flex w-max animate-marquee whitespace-nowrap',
          speedClass,
          reverse && 'direction-reverse',
          pauseOnHover && 'group-hover:[animation-play-state:paused]'
        )}
      >
        {repeatedItems.map((item, index) => (
          <div
            key={index}
            className="flex items-center mx-5 font-mono text-xs md:text-sm uppercase tracking-[0.25em] text-muted transition-colors duration-200 group-hover:text-foreground"
          >
            <span>{item}</span>
            <span className="ml-5 text-accent/60 font-sans">{separator}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

