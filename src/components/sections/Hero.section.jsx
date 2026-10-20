import { Suspense, lazy, useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Download, Volume2, VolumeX } from 'lucide-react';
import { profile } from '../../data/profile';
import { Button } from '../ui/Button';
import { MagneticButton } from '../ui/MagneticButton';
import { Reveal } from '../ui/Reveal';
import { AvatarImage } from '../avatar/AvatarImage';
import { useSpeech, useReducedMotion } from '../../hooks';

// Lazy-load the 3D avatar so the hero text renders instantly and the Three.js
// engine only loads when needed. The AvatarImage portrait shows as the Suspense
// fallback (and inside Avatar3D as the model's own fallback).
const Avatar3DLazy = lazy(() =>
  import('../avatar/Avatar3D').then((m) => ({ default: m.Avatar3D }))
);

export function Hero() {
  // Single source of truth: this one useSpeech instance drives BOTH the spoken
  // intro and the avatar's lip-sync (speaking flag passed into Avatar3D).
  const { speak, stop, speaking, supported } = useSpeech();
  const reducedMotion = useReducedMotion();
  const introStartedRef = useRef(false);

  const scrollToWork = () => {
    const el = document.getElementById('work');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const startIntro = () => {
    introStartedRef.current = true;
    speak(profile.voiceIntro);
  };

  const replayIntro = () => (speaking ? stop() : startIntro());

  // Auto-start the intro on page load / reload. Browsers block audio autoplay
  // without a prior user gesture, so guaranteed-on-every-load autoplay is not
  // reliable. Best-effort pattern:
  //   1. Attempt to start immediately on mount.
  //   2. Also arm a one-time first-gesture listener that starts the intro if it
  //      hasn't begun yet, then removes itself.
  // A module/session flag keeps it to once per page load (re-renders won't
  // re-trigger), while a fresh reload starts a new session and plays again.
  useEffect(() => {
    if (!supported) return;
    if (typeof window !== 'undefined' &&
        window.sessionStorage?.getItem('introPlayed') === '1') {
      return;
    }

    const markPlayed = () => {
      try {
        window.sessionStorage?.setItem('introPlayed', '1');
      } catch {
        // sessionStorage may be unavailable (privacy mode); ignore.
      }
    };

    const beginIntro = () => {
      if (introStartedRef.current) return;
      startIntro();
      markPlayed();
    };

    // 1. Best-effort immediate start.
    beginIntro();

    // 2. First-gesture fallback for browsers that blocked the autoplay attempt.
    const handleFirstGesture = () => {
      beginIntro();
      removeGestureListeners();
    };
    const gestureEvents = ['pointerdown', 'keydown', 'scroll', 'touchstart'];
    const removeGestureListeners = () => {
      gestureEvents.forEach((evt) =>
        document.removeEventListener(evt, handleFirstGesture)
      );
    };
    gestureEvents.forEach((evt) =>
      document.addEventListener(evt, handleFirstGesture, { passive: true, once: false })
    );

    return removeGestureListeners;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported]);

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-28 md:pt-36 pb-16 overflow-hidden">
      {/* Background radial gradient accent */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-editorial mx-auto px-5 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 flex flex-col items-start z-10">
            {/* Status Chip */}
            <Reveal delay={0.1}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface border border-border text-foreground font-mono text-xs uppercase tracking-wider mb-6">
                <span className="w-2 h-2 rounded-full bg-accent animate-ping" />
                <span className="text-muted">{profile.status}</span>
                <span className="text-muted/40">•</span>
                <span className="text-foreground">{profile.city}</span>
              </div>
            </Reveal>

            {/* Giant Display Headline */}
            <Reveal delay={0.2}>
              <h1 className="font-display text-display-xl font-extrabold text-foreground tracking-tight leading-[0.92] text-balance">
                MUHAMMAD <br />
                <span className="text-muted/40 hover:text-foreground transition-colors duration-500">
                  ATTIQUE
                </span>
              </h1>
            </Reveal>

            {/* Role & Editorial Tagline */}
            <Reveal delay={0.3}>
              <div className="mt-6 md:mt-8 flex items-center gap-3">
                <span className="font-mono text-eyebrow text-accent font-semibold uppercase">
                  00 / ROLE
                </span>
                <span className="text-muted/40 font-mono text-xs">—</span>
                <p className="font-mono text-xs md:text-sm text-foreground tracking-widest uppercase">
                  {profile.role}
                </p>
              </div>
            </Reveal>

            {/* Short Bio / Intro */}
            <Reveal delay={0.4}>
              <p className="mt-4 text-base md:text-lg text-muted max-w-xl leading-relaxed text-balance">
                {profile.tagline} {profile.shortIntro}
              </p>
            </Reveal>

            {/* CTAs */}
            <Reveal delay={0.5}>
              <div className="mt-8 md:mt-10 flex flex-wrap items-center gap-4">
                <MagneticButton strength={0.3}>
                  <Button
                    onClick={scrollToWork}
                    variant="primary"
                    size="lg"
                    icon={<ArrowDown size={18} />}
                  >
                    View Selected Work
                  </Button>
                </MagneticButton>

                <MagneticButton strength={0.3}>
                  <Button
                    href={profile.resumeUrl}
                    download
                    variant="outline"
                    size="lg"
                    icon={<Download size={18} />}
                  >
                    Download Resume
                  </Button>
                </MagneticButton>

                <MagneticButton strength={0.3}>
                  <Button
                    href={`mailto:${profile.email}`}
                    variant="ghost"
                    size="lg"
                    icon={<ArrowUpRight size={18} />}
                  >
                    Let's Connect
                  </Button>
                </MagneticButton>
              </div>
            </Reveal>
          </div>

          {/* Right Column: 3D Avatar Specimen */}
          <div className="lg:col-span-5 relative flex items-center justify-center">
            <Reveal delay={0.3} className="w-full">
              <div className="relative w-full aspect-square max-w-[480px] mx-auto rounded-3xl bg-surface/50 border border-border backdrop-blur-sm overflow-hidden flex items-center justify-center">
                {/* Subtle internal ring decoration */}
                <div className="absolute inset-4 rounded-2xl border border-white/5 pointer-events-none" />

                <Suspense
                  fallback={
                    <AvatarImage className="h-full w-full" height="100%" speaking={speaking} />
                  }
                >
                  <Avatar3DLazy className="h-full w-full" height="100%" speaking={speaking} />
                </Suspense>

                {/* Subtle replay / stop affordance — the intro auto-starts, so this
                    is a small secondary control, not the primary play button. */}
                {supported && (
                  <button
                    type="button"
                    onClick={replayIntro}
                    aria-label={
                      speaking
                        ? 'Stop introduction audio'
                        : 'Replay audio introduction'
                    }
                    className="absolute bottom-4 right-4 z-10 inline-flex items-center justify-center w-9 h-9 rounded-full bg-surface/80 border border-border text-muted backdrop-blur-sm hover:text-accent hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                  >
                    {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                )}

                {/* Speaking indicator */}
                {supported && speaking && (
                  <span className="absolute bottom-4 left-4 z-10 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/80 border border-border text-muted font-mono text-[10px] uppercase tracking-wider backdrop-blur-sm">
                    <span className="relative flex w-2 h-2">
                      {!reducedMotion && (
                        <span className="absolute inline-flex w-full h-full rounded-full bg-accent opacity-75 animate-ping" />
                      )}
                      <span className="relative inline-flex w-2 h-2 rounded-full bg-accent" />
                    </span>
                    Speaking…
                  </span>
                )}
              </div>
            </Reveal>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="mt-16 pt-8 border-t border-border flex items-center justify-between text-muted font-mono text-xs">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-accent" />
            <span>SCROLL TO EXPLORE ARCHITECTURE &amp; WORK</span>
          </div>

          <button
            onClick={scrollToWork}
            className="hidden sm:flex items-center gap-1.5 text-foreground hover:text-accent transition-colors"
          >
            <span>DISCOVER</span>
            <ArrowDown size={14} className="animate-bounce" />
          </button>
        </div>
      </div>
    </section>
  );
}

