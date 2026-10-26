import { useEffect, useRef, useState } from "react";

const timeSignatures = [
  { label: "4/4", beats: 4, beatUnit: 4 },
  { label: "3/4", beats: 3, beatUnit: 4 },
  { label: "6/8", beats: 6, beatUnit: 8 },
] as const;

type MetronomeSound = "classic" | "high" | "soft";

function playClick(context: AudioContext, accented: boolean, sound: MetronomeSound) {
  const oscillator = context.createOscillator();
  const gain = context.createGain();
  const now = context.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.value = sound === "high" ? (accented ? 1760 : 1320)
    : sound === "soft" ? (accented ? 880 : 660)
      : accented ? 1320 : 880;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(sound === "soft" ? 0.14 : 0.3, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
  oscillator.connect(gain);
  gain.connect(context.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.1);
}

export default function PracticeToolsScreen() {
  const [tempo, setTempo] = useState(80);
  const [timeSignature, setTimeSignature] = useState<(typeof timeSignatures)[number]["label"]>("4/4");
  const [sound, setSound] = useState<MetronomeSound>("classic");
  const [isPlaying, setIsPlaying] = useState(false);
  const [beat, setBeat] = useState(0);
  const [message, setMessage] = useState("");
  const audioContext = useRef<AudioContext | null>(null);
  const selectedTimeSignature = timeSignatures.find((item) => item.label === timeSignature) ?? timeSignatures[0];
  const { beats: beatsPerMeasure, beatUnit } = selectedTimeSignature;

  useEffect(() => {
    if (!isPlaying) {
      setBeat(0);
      return;
    }

    let currentBeat = 1;
    setBeat(currentBeat);
    if (audioContext.current?.state === "running") {
      playClick(audioContext.current, currentBeat === 1, sound);
    }

    const intervalId = window.setInterval(() => {
      currentBeat = currentBeat % beatsPerMeasure + 1;
      setBeat(currentBeat);
      if (audioContext.current?.state === "running") {
        playClick(audioContext.current, currentBeat === 1, sound);
      }
    }, 60_000 / tempo * (4 / beatUnit));

    return () => window.clearInterval(intervalId);
  }, [beatsPerMeasure, isPlaying, sound, tempo]);

  useEffect(() => () => {
    if (audioContext.current) {
      void audioContext.current.close();
    }
  }, []);

  function togglePlayback() {
    if (isPlaying) {
      setIsPlaying(false);
      setMessage("");
      return;
    }

    if (typeof window.AudioContext === "undefined") {
      setMessage("Audio clicks are not supported in this browser. The visual beat will still run.");
      setIsPlaying(true);
      return;
    }

    if (!audioContext.current) {
      audioContext.current = new window.AudioContext();
    }

    const context = audioContext.current;
    if (context.state === "suspended") {
      void context.resume().then(
        () => setIsPlaying(true),
        () => setMessage("Audio could not start. Check your browser's sound permissions and try again."),
      );
    } else {
      setIsPlaying(true);
    }
    setMessage("");
  }

  function changeTempo(amount: number) {
    setTempo((current) => Math.min(240, Math.max(30, current + amount)));
  }

  return (
    <div className="legato-ui legato-practice">
      <header className="practice-header">
        <div className="practice-header-inner">
          <a className="legato-brand practice-brand" href="/" aria-label="Legato home">
            <img src="/legato-logo.png" alt="Legato" />
          </a>
          <nav className="practice-menu" aria-label="Main navigation">
            <a href="/instruments">Instruments</a>
            <a href="/roadmaps">Roadmaps</a>
            <a href="/resources">Resources</a>
            <a href="/practice-tools">Practice Tools</a>
            <a href="/library">My Library</a>
          </nav>
          <a className="practice-login" href="/login">Log in</a>
        </div>
      </header>

      <main className="practice-content">
        <aside className="practice-sidebar" aria-label="Practice tools">
          <h2>Practice Tools</h2>
          <button type="button" className="practice-tool-option is-active" aria-current="page">
            <span className="practice-metronome-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="m9 20 2-14h4l2 14H9Z" />
                <path d="m12 15 4-6M8 20h10" />
              </svg>
            </span>
            <span>Metronome</span>
          </button>
          {["[Tool name]", "[Tool name]", "[Tool name]"].map((tool) => (
            <button type="button" className="practice-tool-option" key={tool} disabled>
              <span>{tool}</span>
              <span className="practice-coming-soon">Soon</span>
            </button>
          ))}
        </aside>

        <section className="practice-tool-main" aria-labelledby="practice-tool-title">
          <div className="practice-title-block">
            <p className="practice-eyebrow">Practice tool</p>
            <h1 id="practice-tool-title">Metronome</h1>
            <p>Keep a steady beat while you practice.</p>
          </div>

          <div className="practice-metronome-card">
            <div className="practice-beat-display" aria-live="polite" aria-atomic="true">
              <div className={`practice-beat-orb${isPlaying && beat === 1 ? " is-active" : ""}`}>
                <span className="practice-tempo-value">{tempo}</span>
                <span className="practice-tempo-unit">BPM</span>
              </div>
            </div>

            <div className="practice-beat-indicators" role="img" aria-label={`Beat ${beat || 0} of ${beatsPerMeasure}`}>
              {Array.from({ length: beatsPerMeasure }, (_, index) => (
                <span
                  key={index}
                  className={`practice-beat-indicator${beat === index + 1 ? " is-current" : ""}${index === 0 ? " is-downbeat" : ""}`}
                  aria-hidden="true"
                />
              ))}
            </div>

            <div className="practice-tempo-controls">
              <button
                type="button"
                className="practice-tempo-step"
                aria-label="Decrease tempo by one beat per minute"
                disabled={tempo <= 30}
                onClick={() => changeTempo(-1)}
              >−</button>
              <button
                type="button"
                className={`practice-play-button${isPlaying ? " is-playing" : ""}`}
                onClick={togglePlayback}
                aria-pressed={isPlaying}
              >{isPlaying ? "Stop" : "Start"}</button>
              <button
                type="button"
                className="practice-tempo-step"
                aria-label="Increase tempo by one beat per minute"
                disabled={tempo >= 240}
                onClick={() => changeTempo(1)}
              >+</button>
            </div>

            <div className="practice-settings">
              <label>
                <span>Time signature</span>
                <select
                  value={timeSignature}
                  onChange={(event) => {
                    const selected = timeSignatures.find((item) => item.label === event.target.value);
                    if (selected) setTimeSignature(selected.label);
                  }}
                >
                  {timeSignatures.map((item) => (
                    <option key={item.label} value={item.label}>{item.label}</option>
                  ))}
                </select>
              </label>
              <label>
                <span>Sound</span>
                <select value={sound} onChange={(event) => {
                  const selected = event.target.value;
                  if (selected === "classic" || selected === "high" || selected === "soft") {
                    setSound(selected);
                  }
                }}>
                  <option value="classic">Classic click</option>
                  <option value="high">High click</option>
                  <option value="soft">Soft click</option>
                </select>
              </label>
            </div>
            <p className="practice-status" role="status" aria-live="polite">{message}</p>
          </div>
        </section>

        <aside className="practice-guide">
          <section className="practice-guide-card" aria-labelledby="practice-guide-title">
            <h2 id="practice-guide-title">How to use it</h2>
            <ol>
              <li>Set your tempo with the + and − buttons.</li>
              <li>Choose a time signature for your practice.</li>
              <li>Press Start and play along with the beat.</li>
            </ol>
          </section>
          <section className="practice-used-in" aria-labelledby="practice-used-title">
            <h2 id="practice-used-title">Used in these steps</h2>
            <a href="/roadmaps/guitar-beginner/steps/4">Guitar · Basic strumming patterns <span aria-hidden="true">→</span></a>
            <a href="/roadmaps/piano-beginner/steps/3">Piano · Keeping a steady rhythm <span aria-hidden="true">→</span></a>
          </section>
        </aside>
      </main>

      <footer className="practice-footer">
        <div>
          <a className="legato-brand" href="/" aria-label="Legato home">
            <img src="/legato-logo.png" alt="Legato" />
          </a>
          <span>© 2026 Legato</span>
        </div>
      </footer>
    </div>
  );
}
