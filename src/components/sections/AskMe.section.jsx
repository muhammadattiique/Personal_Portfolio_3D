import { useState } from 'react';
import { MessageCircle, Mic, Volume2 } from 'lucide-react';
import { SectionHeader } from '../ui/SectionHeader';
import { Reveal } from '../ui/Reveal';
import { AvatarChat } from '../avatar/AvatarChat';
import { useSpeech } from '../../hooks';

// Dedicated "Ask Me Anything" section placed near the end of the page. Visitors
// can type or speak a question about skills, projects, experience, education,
// certifications, or contact, and the avatar answers out loud.
export function AskMe() {
  const { speak, stop, speaking, supported } = useSpeech();
  const [muted, setMuted] = useState(false);

  const handleSpeak = (text) => {
    if (muted) return;
    speak(text);
  };

  const toggleMute = () => {
    setMuted((m) => {
      if (!m) stop();
      return !m;
    });
  };

  return (
    <section
      id="ask-me"
      className="py-24 md:py-32 scroll-mt-20 border-t border-border"
    >
      <div className="max-w-editorial mx-auto px-5 md:px-8">
        <SectionHeader
          number="08"
          label="ASK ME ANYTHING"
          title="Talk to My Portfolio"
          subtitle="Ask about my skills, projects, experience, education, or certifications — type or use your voice, and you'll get a spoken answer."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Left: explainer + feature points */}
          <div className="lg:col-span-5">
            <Reveal>
              <div className="space-y-6">
                <p className="text-muted text-base md:text-lg leading-relaxed text-balance">
                  Curious about my work? Put a question to my avatar. It answers
                  directly from my portfolio — skills, projects, experience,
                  education, and certifications — and speaks the reply out loud.
                </p>

                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-elevated border border-border text-accent shrink-0">
                      <MessageCircle size={18} />
                    </span>
                    <div>
                      <p className="text-foreground font-medium">Type a question</p>
                      <p className="text-muted text-sm">
                        e.g. &ldquo;What are your skills?&rdquo; or &ldquo;Any certifications?&rdquo;
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-elevated border border-border text-accent shrink-0">
                      <Mic size={18} />
                    </span>
                    <div>
                      <p className="text-foreground font-medium">Or use your voice</p>
                      <p className="text-muted text-sm">
                        Tap the mic and speak, where your browser supports it.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-surface-elevated border border-border text-accent shrink-0">
                      <Volume2 size={18} />
                    </span>
                    <div>
                      <p className="text-foreground font-medium">Hear a spoken answer</p>
                      <p className="text-muted text-sm">
                        Replies are read aloud; mute or stop anytime.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>

          {/* Right: the conversation panel */}
          <div className="lg:col-span-7">
            <Reveal delay={0.15}>
              <AvatarChat
                speak={handleSpeak}
                stop={stop}
                speaking={speaking}
                supported={supported}
                muted={muted}
                onToggleMute={toggleMute}
              />
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
