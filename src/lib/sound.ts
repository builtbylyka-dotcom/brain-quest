/**
 * Tiny synthesized sound effects (Web Audio). No assets, no autoplay:
 * the AudioContext is created lazily on the first effect, which always
 * follows a user gesture. Any failure silently disables sound.
 */
export type SoundName = "select" | "correct" | "wrong" | "achievement" | "hint";

let ctx: AudioContext | null = null;
let broken = false;

function context(): AudioContext | null {
  if (broken) return null;
  try {
    if (!ctx) {
      const Ctor =
        window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) {
        broken = true;
        return null;
      }
      ctx = new Ctor();
    }
    if (ctx.state === "suspended") void ctx.resume().catch(() => undefined);
    return ctx;
  } catch {
    broken = true;
    return null;
  }
}

type Note = { freq: number; at: number; dur: number; type?: OscillatorType; gain?: number };

function play(notes: Note[]) {
  const ac = context();
  if (!ac) return;
  try {
    const master = ac.createGain();
    master.gain.value = 0.18;
    master.connect(ac.destination);
    const now = ac.currentTime + 0.01;
    for (const n of notes) {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.type = n.type ?? "sine";
      osc.frequency.setValueAtTime(n.freq, now + n.at);
      g.gain.setValueAtTime(0.0001, now + n.at);
      g.gain.exponentialRampToValueAtTime(n.gain ?? 0.6, now + n.at + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, now + n.at + n.dur);
      osc.connect(g).connect(master);
      osc.start(now + n.at);
      osc.stop(now + n.at + n.dur + 0.05);
    }
  } catch {
    broken = true;
  }
}

const SOUNDS: Record<SoundName, Note[]> = {
  select: [{ freq: 660, at: 0, dur: 0.07, type: "triangle", gain: 0.35 }],
  hint: [
    { freq: 880, at: 0, dur: 0.12, type: "sine", gain: 0.3 },
    { freq: 1320, at: 0.06, dur: 0.14, type: "sine", gain: 0.2 },
  ],
  correct: [
    { freq: 587.33, at: 0, dur: 0.16, type: "triangle" },
    { freq: 880, at: 0.09, dur: 0.24, type: "triangle" },
  ],
  wrong: [
    { freq: 311.13, at: 0, dur: 0.18, type: "sine", gain: 0.45 },
    { freq: 261.63, at: 0.1, dur: 0.26, type: "sine", gain: 0.4 },
  ],
  achievement: [
    { freq: 523.25, at: 0, dur: 0.18, type: "triangle" },
    { freq: 659.25, at: 0.09, dur: 0.18, type: "triangle" },
    { freq: 783.99, at: 0.18, dur: 0.2, type: "triangle" },
    { freq: 1046.5, at: 0.28, dur: 0.36, type: "sine", gain: 0.4 },
  ],
};

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  play(SOUNDS[name]);
}
