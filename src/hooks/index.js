import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Tracks normalized or screen mouse coordinates
 */
export function useMousePosition() {
  const [position, setPosition] = useState({ x: 0, y: 0, normalizedX: 0, normalizedY: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const normalizedX = (e.clientX / window.innerWidth) * 2 - 1;
      const normalizedY = -(e.clientY / window.innerHeight) * 2 + 1;
      setPosition({ x: e.clientX, y: e.clientY, normalizedX, normalizedY });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return position;
}

/**
 * Mobile breakpoint detector
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < breakpoint;
    }
    return false;
  });

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < breakpoint);
    checkMobile();
    window.addEventListener('resize', checkMobile, { passive: true });
    return () => window.removeEventListener('resize', checkMobile);
  }, [breakpoint]);

  return isMobile;
}

/**
 * Reduced motion preference
 */
export function useReducedMotion() {
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

/**
 * Speaking-avatar helper built on the browser Web Speech API.
 * Returns { speak, stop, speaking, supported }. Degrades gracefully when
 * window.speechSynthesis is unavailable and never loops audio.
 */
export function useSpeech() {
  const supported =
    typeof window !== 'undefined' && 'speechSynthesis' in window;

  const [speaking, setSpeaking] = useState(false);
  const voiceRef = useRef(null);
  // Whether the resolved voice is clearly male; drives a harder pitch drop when
  // the device only offers a neutral/female default voice.
  const pickedIsMaleRef = useRef(false);

  // Resolve an English voice; voices can load asynchronously.
  useEffect(() => {
    if (!supported) return;

    const pickVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;

      const isEn = (v) => v.lang && v.lang.toLowerCase().startsWith('en');
      const nameIncludes = (v, s) =>
        v.name && v.name.toLowerCase().includes(s.toLowerCase());
      const anyName = (v, list) => list.some((n) => nameIncludes(v, n));

      // YOUNG-sounding modern male neural voices first — these read like a young
      // man rather than the older, deeper classic voices (David/Mark/Fred).
      const youngMaleNames = [
        'guy', 'ryan', 'christopher', 'eric', 'brandon', 'liam', 'oliver',
        'aaron', 'jason', 'tony', 'sam', 'ethan', 'noah',
      ];
      // Other known MALE English voice names (fallback, may sound older/deeper).
      const maleNames = [
        ...youngMaleNames, 'david', 'mark', 'george', 'james', 'william',
        'brian', 'daniel', 'alex', 'fred', 'arthur', 'thomas', 'ravi',
        'prabhat', 'rishi',
        // Common iOS/Android male voices:
        'aaron', 'arthur', 'gordon', 'rishi', 'male', 'man',
      ];
      // Known FEMALE English voice names to explicitly avoid.
      const femaleNames = [
        'aria', 'jenny', 'zira', 'michelle', 'ana', 'female', 'woman',
        'samantha', 'victoria', 'susan', 'linda', 'heera', 'catherine', 'karen',
        'moira', 'tessa', 'serena', 'fiona', 'kate', 'hazel', 'sonia', 'emily',
        'eva', 'martha', 'nora', 'amelie', 'joana', 'luciana', 'paulina',
      ];

      // Android often names voices like "en-us-x-sfg#male_1-local" or exposes a
      // male hint in the URI; match those too.
      const uriMale = (v) =>
        v.voiceURI && /male|#male|-m-|_m_|man/i.test(v.voiceURI) && !/female/i.test(v.voiceURI);

      // Voices that are KNOWN female even though their name has no "female"
      // keyword — these are the usual culprits for a female default:
      //   - "Google US English" (female on Chrome)
      //   - "Microsoft Zira" (female on Windows)
      const knownFemaleExact = [
        'google us english', 'google uk english female', 'microsoft zira',
      ];
      const isKnownFemaleExact = (v) =>
        v.name && knownFemaleExact.some((n) => v.name.toLowerCase() === n);

      const youngMaleEn = (v) => isEn(v) && anyName(v, youngMaleNames);
      const maleEn = (v) => isEn(v) && (anyName(v, maleNames) || uriMale(v));
      const isFemale = (v) =>
        anyName(v, femaleNames) ||
        isKnownFemaleExact(v) ||
        /female|#female/i.test(v.voiceURI || '');
      // A voice we're confident is MALE (explicit male name/URI).
      const confirmedMale = (v) => maleEn(v) && !isFemale(v);

      // ONLY select a voice we're confident is male. We do NOT fall back to a
      // "not female" voice here, because voices like "Google US English" read as
      // female but aren't named so — picking them is exactly the bug. If no
      // confirmed-male voice exists, leave voiceRef null and let speak() force a
      // low pitch on the device default so it still sounds masculine.
      const picked =
        voices.find((v) => youngMaleEn(v) && !isFemale(v) && (nameIncludes(v, 'natural') || nameIncludes(v, 'online'))) ||
        voices.find((v) => youngMaleEn(v) && !isFemale(v)) ||
        voices.find((v) => confirmedMale(v) && (nameIncludes(v, 'natural') || nameIncludes(v, 'google'))) ||
        voices.find((v) => confirmedMale(v)) ||
        null;

      voiceRef.current = picked;
      // True only when we locked onto a confirmed-male voice. When false, speak()
      // applies a strong low pitch to the device default to force a male sound.
      pickedIsMaleRef.current = Boolean(picked);
    };

    pickVoice();
    window.speechSynthesis.addEventListener('voiceschanged', pickVoice);

    return () => {
      window.speechSynthesis.removeEventListener('voiceschanged', pickVoice);
      // Stop any ongoing speech when the consumer unmounts.
      window.speechSynthesis.cancel();
    };
  }, [supported]);

  const speak = useCallback(
    (text) => {
      if (!supported || !text) return;
      // Cancel anything ongoing so audio never overlaps or loops.
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      if (voiceRef.current) utterance.voice = voiceRef.current;
      // Voice tuning for a young (~22-year-old) MALE sound:
      //  - Confirmed-male voice: light, youthful pitch (~1.1).
      //  - No male voice on the device (default is female/neutral): drop pitch
      //    hard (~0.5) so the female default is pulled down into a male register.
      // Confirmed-male voice (e.g. a laptop with "David"): natural male pitch.
      // No male voice on the device (common on phones — only a female/neutral
      // default): lower the pitch to sound masculine, but NOT to the floor.
      // Very low pitch (~0.1) distorts and "vibrates" on mobile TTS engines, so
      // use a moderate 0.7 that still reads male without breaking up.
      utterance.rate = 1.0;
      utterance.pitch = pickedIsMaleRef.current ? 0.9 : 0.7;

      utterance.onstart = () => setSpeaking(true);
      utterance.onend = () => setSpeaking(false);
      utterance.onerror = () => setSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [supported]
  );

  const stop = useCallback(() => {
    if (!supported) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, [supported]);

  return { speak, stop, speaking, supported };
}