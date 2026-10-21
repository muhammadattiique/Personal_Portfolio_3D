import { Suspense, lazy, useEffect, useRef } from 'react';
import { ArrowDown, ArrowUpRight, Download, Volume2, VolumeX } from 'lucide-react';
import { profile } from '../../data/profile';
import { Button } from '../ui/Button';
import { MagneticButton } from '../ui/MagneticButton';
import { Reveal } from '../ui/Reveal';
import { useSpeech, useReducedMotion } from '../../hooks';

// Lazy-load the 3D avatar so the hero text renders instantly and the Three.js
// engine only loads when needed. RealAvatar loads the photo-derived GLB from
// /public/models/my-avatar.glb and shows the photo portrait as a fallback until
// that model is present.
const Avatar3DLazy = lazy(() =>
  import('../avatar/RealAvatar').then((m) => ({ default: m.RealAvatar }))
);

// Auto-start the spoken introduction this many ms after the page loads.
const INTRO_DELAY_MS = 3000;

export function Hero() {
  // One speech instance drives the spoken intro and the 3D avatar's lip-sync.
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

  // Auto-start the intro ~3 seconds after each page load / reload.
  //
  // Browsers block audio autoplay until the user has interacted with the page
  // at least once, so a timed autoplay on a fresh load may be silently blocked.
  // Robust pattern:
  //   1. Arm the 3s timer; it attempts to speak.
  //   2. ALSO arm first-gesture listeners (pointer/key/scroll/touch). If the
  //      timed attempt was blocked, the very first interaction starts it.
  // We only consider the intro "done" once speech has ACTUALLY started (tracked
  // via introStartedRef), so a blocked attempt never permanently disables it.
  // It runs once per page load (not on re-renders); every reload plays again.
  useEffect(() => {
    if (!supported) return undefined;

    const beginIntro = () => {
      if (introStartedRef.current) return;
      startIntro();
    };

    // 1. Timed attempt after the configured delay.
    const timer = window.setTimeout(beginIntro, INTRO_DELAY_MS);

    // 2. First-gesture fallback for browsers that block timed autoplay.
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
      document.addEventListener(evt, handleFirstGesture, { passive: true })
    );

    return () => {
      window.clearTimeout(timer);
      removeGestureListeners();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supported]);

  const animateSpeaking = speaking && !reducedMotion;

  return (
    <section className="relative min-h-[92vh] flex flex-col justify-center pt-28 md:pt-36 pb-16 overflow-hidden">
      {/* Background radial gradient accent */}
      <div className="absolute top-1/4 right-10 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-editorial mx-auto px-5 md:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Editorial Headline & Copy */}
          <div className="lg:col-span-7 flex flex-col items-start z-10 order-2 lg:order-1">
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

          {/* Right Column: Speaking 3D Avatar */}
          <div className="lg:col-span-5 relative flex items-center justify-center order-1 lg:order-2">
            <Reveal delay={0.3} className="w-full flex justify-center">
              <div className="group relative flex items-center justify-center">
                {/* Soft blue glow behind the avatar; pulses while speaking. */}
                <div
                  aria-hidden="true"
                  className={`absolute inset-0 rounded-full bg-accent/20 blur-3xl scale-90 transition-all duration-500 group-hover:bg-accent/35 group-hover:scale-100 ${
                    animateSpeaking ? 'avatar-speaking-glow' : ''
                  }`}
                />

                {/* Avatar panel — circular, dark background so the circular
                    portrait aligns edge-to-edge with no white box or blue ring. */}
                <div className="relative z-10 w-[220px] h-[220px] sm:w-[260px] sm:h-[260px] md:w-[320px] md:h-[320px] lg:w-[360px] lg:h-[360px] rounded-full overflow-hidden border border-accent/30 shadow-[0_18px_60px_-15px_rgba(79,140,255,0.5)] bg-[#0B1020]">
                  <Suspense
                    fallback={
                      <div
                        aria-label="Loading avatar"
                        className="h-full w-full animate-pulse bg-[#0B1020]"
                      />
                    }
                  >
                    <Avatar3DLazy className="h-full w-full" height="100%" speaking={speaking} />
                  </Suspense>

                  {/* Replay / stop control — the intro auto-starts after 4s, so
                      this is a small secondary affordance, not a primary button. */}
                  {supported && (
                    <button
                      type="button"
                      onClick={replayIntro}
                      aria-label={
                        speaking ? 'Stop introduction audio' : 'Play audio introduction'
                      }
                      className="absolute z-20 bottom-3 right-3 inline-flex items-center justify-center w-10 h-10 rounded-full bg-surface/85 border border-border text-muted backdrop-blur-sm hover:text-accent hover:border-accent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                      {speaking ? <VolumeX size={16} /> : <Volume2 size={16} />}
                    </button>
                  )}

                  {/* Speaking indicator chip */}
                  {supported && speaking && (
                    <span className="absolute z-20 bottom-3 left-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-surface/90 border border-border text-foreground font-mono text-[10px] uppercase tracking-wider backdrop-blur-sm whitespace-nowrap">
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
