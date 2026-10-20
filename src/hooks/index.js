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

      // Preference order (first match wins), tuned for natural-sounding
      // en-US/en-GB voices across platforms rather than the robotic default.
      const namedVoices = ['aria', 'jenny', 'guy', 'zira', 'david'];
      voiceRef.current =
        voices.find((v) => nameIncludes(v, 'natural') && isEn(v)) ||
        voices.find((v) => nameIncludes(v, 'google') && isEn(v)) ||
        voices.find(
          (v) => isEn(v) && namedVoices.some((n) => nameIncludes(v, n))
        ) ||
        voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en-us')) ||
        voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('en-gb')) ||
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
      utterance.rate = 0.95;
      utterance.pitch = 1.0;
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