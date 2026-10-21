import { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send, Volume2, VolumeX, Square, MessageCircle, FolderGit2 } from 'lucide-react';
import {
  avatarGreeting,
  avatarSuggestions,
  getAvatarResponse,
  isProjectsQuery,
  projectList,
  getProjectDetail,
} from '../../data/avatarChat';

/**
 * Conversation interface for the portfolio avatar. Visitors can type or (where
 * supported) speak a question; the avatar answers from real portfolio data and
 * speaks the reply via the shared speech instance, which also drives the 3D
 * avatar's lip-sync.
 *
 * Props:
 *   - speak(text): start speaking the given text (from useSpeech)
 *   - stop(): stop speaking
 *   - speaking: boolean, whether TTS is currently talking
 *   - supported: boolean, whether speech synthesis is available
 *   - muted / onToggleMute: caller-controlled mute state for the voice
 */
export function AvatarChat({ speak, stop, speaking, supported, muted, onToggleMute }) {
  const [messages, setMessages] = useState([
    { from: 'avatar', text: avatarGreeting },
  ]);
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const [sttSupported, setSttSupported] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const logRef = useRef(null);

  // Set up browser SpeechRecognition (voice input) when available.
  useEffect(() => {
    const SR =
      typeof window !== 'undefined' &&
      (window.SpeechRecognition || window.webkitSpeechRecognition);
    if (!SR) return undefined;
    setSttSupported(true);
    const recognition = new SR();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript ?? '';
      setListening(false);
      if (transcript) handleSend(transcript);
    };
    recognition.onerror = (event) => {
      setListening(false);
      setError(
        event?.error === 'not-allowed'
          ? 'Microphone permission denied.'
          : 'Could not capture audio. Try typing instead.'
      );
    };
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    return () => {
      try {
        recognition.abort();
      } catch {
        // ignore
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-scroll the transcript to the newest message.
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  // Spoken version: drop raw URLs (reading "h-t-t-p-s..." aloud sounds bad) and
  // replace with a short phrase, so the voice stays natural while the on-screen
  // text keeps the full link.
  const toSpeech = (text) =>
    (text || '')
      .replace(/at https?:\/\/\S+/gi, 'on GitHub')
      .replace(/https?:\/\/\S+/gi, 'GitHub')
      .trim();

  const answerAndSpeak = (question) => {
    const reply = getAvatarResponse(question);
    // A general projects question shows a clickable picker of all projects.
    const picker = isProjectsQuery(question);
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: question },
      { from: 'avatar', text: reply, picker },
    ]);
    // Speak SYNCHRONOUSLY here — this runs inside the send/tap gesture, which is
    // what iOS/Safari require to allow audio. A deferred (setTimeout) call would
    // be outside the gesture and could be blocked on mobile.
    if (supported && !muted) speak(toSpeech(reply));
  };

  const handleSend = (raw) => {
    const text = (raw ?? input).trim();
    if (!text) return;
    setError('');
    setInput('');
    answerAndSpeak(text);
  };

  // Clicking a project in the picker: echo the choice, then answer + speak the
  // detailed single-project response.
  const handleProjectPick = (project) => {
    setError('');
    const detail = getProjectDetail(project.slug) || '';
    setMessages((prev) => [
      ...prev,
      { from: 'user', text: project.title },
      { from: 'avatar', text: detail },
    ]);
    if (supported && !muted) speak(toSpeech(detail));
  };

  const toggleListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) return;
    setError('');
    if (listening) {
      recognition.stop();
      setListening(false);
      return;
    }
    try {
      stop?.(); // don't talk over the listener
      recognition.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  const restart = () => {
    stop?.();
    setMessages([{ from: 'avatar', text: avatarGreeting }]);
    setError('');
  };

  return (
    <div className="w-full h-[520px] max-h-[75vh] rounded-2xl bg-surface/80 border border-border backdrop-blur-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-border">
        <div className="flex items-center gap-2">
          <MessageCircle size={16} className="text-accent" />
          <span className="font-mono text-xs uppercase tracking-wider text-foreground">
            Ask my avatar
          </span>
          {speaking && (
            <span className="inline-flex items-center gap-1.5 ml-1 text-[10px] font-mono uppercase text-accent">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-accent opacity-75 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-accent" />
              </span>
              Speaking
            </span>
          )}
          {listening && (
            <span className="inline-flex items-center gap-1.5 ml-1 text-[10px] font-mono uppercase text-accent-2">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex w-full h-full rounded-full bg-accent opacity-75 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-accent" />
              </span>
              Listening
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {supported && (
            <button
              type="button"
              onClick={onToggleMute}
              aria-label={muted ? 'Unmute avatar voice' : 'Mute avatar voice'}
              title={muted ? 'Unmute voice' : 'Mute voice'}
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-accent transition-colors"
            >
              {muted ? <VolumeX size={15} /> : <Volume2 size={15} />}
            </button>
          )}
          {supported && speaking && (
            <button
              type="button"
              onClick={() => stop?.()}
              aria-label="Stop speaking"
              title="Stop speaking"
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-muted hover:text-accent transition-colors"
            >
              <Square size={14} />
            </button>
          )}
          <button
            type="button"
            onClick={restart}
            className="text-[10px] font-mono uppercase tracking-wider text-muted hover:text-accent transition-colors px-2"
          >
            Restart
          </button>
        </div>
      </div>

      {/* Transcript — flexes inside the fixed-height panel so scrolling stays
          INSIDE the chat (the page itself does not grow). */}
      <div
        ref={logRef}
        className="flex-1 min-h-0 overflow-y-auto avatar-chat-scroll px-4 py-3 space-y-3"
        aria-live="polite"
      >
        {messages.map((m, i) => (
          <div key={i}>
            <div className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
              <p
                className={`max-w-[85%] text-sm leading-relaxed rounded-2xl px-3.5 py-2 ${
                  m.from === 'user'
                    ? 'bg-accent text-[#0B1020] font-medium'
                    : 'bg-surface-elevated text-foreground border border-border'
                }`}
              >
                {m.text}
              </p>
            </div>

            {/* Project picker: clickable buttons for every project. */}
            {m.picker && (
              <div className="mt-3 flex flex-wrap gap-2">
                {projectList.map((p) => (
                  <button
                    key={p.slug}
                    type="button"
                    onClick={() => handleProjectPick(p)}
                    className="inline-flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1.5 rounded-lg bg-surface-elevated border border-border text-foreground hover:text-accent hover:border-accent transition-colors"
                  >
                    <FolderGit2 size={12} className="text-accent shrink-0" />
                    {p.title}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {error && (
          <p className="text-xs text-red-400 font-mono" role="alert">
            {error}
          </p>
        )}
      </div>

      {/* Suggestion chips */}
      <div className="px-4 pb-2 flex flex-wrap gap-1.5">
        {avatarSuggestions.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => handleSend(s)}
            className="text-[11px] font-mono px-2.5 py-1 rounded-full bg-surface-elevated border border-border text-muted hover:text-accent hover:border-accent transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input row */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 px-3 py-3 border-t border-border"
      >
        {sttSupported && (
          <button
            type="button"
            onClick={toggleListening}
            aria-label={listening ? 'Stop listening' : 'Speak your question'}
            title={listening ? 'Stop listening' : 'Voice input'}
            className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-colors shrink-0 ${
              listening
                ? 'bg-accent text-[#0B1020] border-accent'
                : 'bg-surface-elevated border-border text-muted hover:text-accent hover:border-accent'
            }`}
          >
            {listening ? <MicOff size={16} /> : <Mic size={16} />}
          </button>
        )}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about my skills, projects, experience..."
          aria-label="Ask the avatar a question"
          className="flex-1 min-w-0 bg-surface-elevated border border-border rounded-xl px-3.5 py-2.5 text-sm text-foreground placeholder:text-faint focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          aria-label="Send question"
          disabled={!input.trim()}
          className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-accent text-[#0B1020] shrink-0 disabled:opacity-40 disabled:cursor-not-allowed hover:brightness-110 transition-all"
        >
          <Send size={16} />
        </button>
      </form>
    </div>
  );
}
