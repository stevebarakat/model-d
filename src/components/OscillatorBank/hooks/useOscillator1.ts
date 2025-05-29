import { useEffect, useRef, useCallback } from "react";
import { useSynthStore } from "@/store/synthStore";
import { createOscillator1, Osc1Instance } from "../utils/oscillator1";
import { OscillatorType } from "@/types";

export type UseOscillator1Result = {
  triggerAttack: (note: string) => void;
  triggerRelease: (note?: string) => void;
};

export function useOscillator1(
  audioContext: AudioContext
): UseOscillator1Result {
  const { oscillator1, mixer } = useSynthStore();
  const oscRef = useRef<Osc1Instance | null>(null);

  useEffect(() => {
    oscRef.current = createOscillator1({
      audioContext,
      waveform: oscillator1.waveform as OscillatorType,
      range: oscillator1.range,
    });
    return () => {
      oscRef.current?.stop();
      oscRef.current = null;
    };
  }, [audioContext, oscillator1.range, oscillator1.waveform]);

  useEffect(() => {
    if (oscRef.current) {
      oscRef.current.getGainNode().gain.value = mixer.osc1.enabled
        ? mixer.osc1.volume / 10
        : 0;
    }
  }, [mixer.osc1.enabled, mixer.osc1.volume]);

  useEffect(() => {
    oscRef.current?.update({
      waveform: oscillator1.waveform as OscillatorType,
      range: oscillator1.range,
    });
  }, [oscillator1.waveform, oscillator1.range]);

  const triggerAttack = useCallback((note: string) => {
    const freq = noteToFrequency(note);
    oscRef.current?.start(freq);
  }, []);

  const triggerRelease = useCallback(() => {
    oscRef.current?.stop();
  }, []);

  return {
    triggerAttack,
    triggerRelease,
  };
}

function noteToFrequency(note: string): number {
  const match = note.match(/^([A-G]#?)(\d)$/);
  if (!match) return 440;
  const noteNames = [
    "C",
    "C#",
    "D",
    "D#",
    "E",
    "F",
    "F#",
    "G",
    "G#",
    "A",
    "A#",
    "B",
  ];
  const [, name, octaveStr] = match;
  const octave = parseInt(octaveStr, 10);
  const n = noteNames.indexOf(name);
  if (n < 0 || isNaN(octave)) return 440;
  const midi = 12 * (octave + 1) + n;
  const freq = 440 * Math.pow(2, (midi - 69) / 12);
  return isFinite(freq) ? freq : 440;
}
