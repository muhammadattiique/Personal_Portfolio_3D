import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Plays a pre-recorded intro audio file (e.g. a natural young-male AI voice) so
 * the introduction sounds IDENTICAL on every device — phones, tablets, laptops —
 * instead of relying on each device's built-in (and inconsistent) text-to-speech.
 *
 * Drop your recording at: public/intro.mp3  (or .wav / .m4a — update AUDIO_SRC).
 *
 * If the file is missing or fails to load, `available` becomes false and the
 * caller should fall back to the browser TTS. Exposes a `speaking` flag so the
 * avatar's talking animation can sync to the audio.
 *
 * Returns: { play, stop, speaking, available }
 */
const AUDIO_SRC = '/intro.mp3';

export function useIntroAudio() {
  const audioRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
  // null = unknown (still probing), true = file exists, false = missing/failed.
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const audio = new Audio();
    audio.preload = 'auto';
    audio.src = AUDIO_SRC;
    audioRef.current = audio;

    const onPlay = () => setSpeaking(true);
    const onPlaying = () => setSpeaking(true);
    const onEnded = () => setSpeaking(false);
    const onPause = () => setSpeaking(false);
    const onError = () => setAvailable(false);
    const onCanPlay = () => setAvailable(true);

    audio.addEventListener('play', onPlay);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('ended', onEnded);
    audio.addEventListener('pause', onPause);
    audio.addEventListener('error', onError);
    audio.addEventListener('canplaythrough', onCanPlay);
    audio.addEventListener('loadeddata', onCanPlay);

    // Kick off loading so we learn quickly whether the file exists.
    try {
      audio.load();
    } catch {
      setAvailable(false);
    }

    return () => {
      audio.pause();
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('pause', onPause);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('canplaythrough', onCanPlay);
      audio.removeEventListener('loadeddata', onCanPlay);
      audioRef.current = null;
    };
  }, []);

  const play = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return Promise.reject(new Error('no audio'));
    try {
      audio.currentTime = 0;
    } catch {
      // some browsers throw if not yet seekable; ignore.
    }
    // Returns a promise that rejects if the browser blocks autoplay — the caller
    // uses that to fall back to a user-gesture retry.
    return audio.play();
  }, []);

  const stop = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.pause();
    try {
      audio.currentTime = 0;
    } catch {
      // ignore
    }
    setSpeaking(false);
  }, []);

  return { play, stop, speaking, available };
}
