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
        'prabhat', 'rishi', 'male',
      ];
      // Known FEMALE English voice names to explicitly avoid when possible.
      const femaleNames = [
        'aria', 'jenny', 'zira', 'michelle', 'ana', 'female', 'samantha',
        'victoria', 'susan', 'linda', 'heera', 'catherine', 'karen', 'moira',
        'tessa', 'serena', 'fiona', 'kate', 'hazel', 'sonia', 'emily', 'eva',
      ];

      const youngMaleEn = (v) => isEn(v) && anyName(v, youngMaleNames);
      const maleEn = (v) => isEn(v) && anyName(v, maleNames);
      const notFemaleEn = (v) => isEn(v) && !anyName(v, femaleNames);

      // Preference order (first match wins): a young-sounding natural/online male
      // voice first, then any young male, then any male, then a non-female English
      // voice, then any English voice.
      voiceRef.current =
        voices.find((v) => youngMaleEn(v) && (nameIncludes(v, 'natural') || nameIncludes(v, 'online'))) ||
        voices.find((v) => youngMaleEn(v)) ||
        voices.find((v) => maleEn(v) && nameIncludes(v, 'natural')) ||
        voices.find((v) => maleEn(v) && nameIncludes(v, 'google')) ||
        voices.find((v) => maleEn(v)) ||
        voices.find((v) => notFemaleEn(v) && nameIncludes(v, 'natural')) ||
        voices.find((v) => notFemaleEn(v) && nameIncludes(v, 'google')) ||
        voices.find((v) => notFemaleEn(v) && v.lang.toLowerCase().startsWith('en-us')) ||
        voices.find((v) => notFemaleEn(v)) ||
        voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en-us')) ||
        voices.find((v) => isEn(v)) ||
        null;
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
      // Higher pitch + lively rate gives a lighter, thinner ("bareek") young-boy
      // tone rather than a deep/older voice, on whatever male voice the device has.
      utterance.rate = 1.03;
      utterance.pitch = 1.4;
      if (voiceRef.current) utterance.voice = voiceRef.current;

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