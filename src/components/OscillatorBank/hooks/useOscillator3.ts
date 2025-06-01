import { useEffect, useRef, useCallback } from "react";
import { useSynthStore } from "@/store/synthStore";
import { createOscillator3, Osc3Instance } from "../audio/oscillator3";

export type Oscillator3Waveform =
  | "triangle"
  | "rev_saw"
  | "sawtooth"
  | "pulse1"
  | "pulse2"
  | "pulse3";

export type UseOscillator3Result = {
  triggerAttack: (note: string) => void;
  triggerRelease: (note?: string) => void;
};

export function useOscillator3(
  audioContext: AudioContext,
  mixerNode?: AudioNode
): UseOscillator3Result {
  const { oscillator3, mixer, glideOn, glideTime } = useSynthStore();
  const oscRef = useRef<Osc3Instance | null>(null);
  const lastFrequencyRef = useRef<number | null>(null);

  useEffect(() => {
    oscRef.current = createOscillator3(
      {
        audioContext,
        waveform: oscillator3.waveform as Oscillator3Waveform,
        frequency: oscillator3.frequency,
        range: oscillator3.range,
      },
      mixerNode
    );
    return () => {
      oscRef.current?.stop();
      oscRef.current = null;
    };
  }, [
    audioContext,
    oscillator3.frequency,
    oscillator3.range,
    oscillator3.waveform,
    mixerNode,
  ]);

  useEffect(() => {
    if (oscRef.current) {
      oscRef.current.getGainNode().gain.value = mixer.osc3.enabled
        ? mixer.osc3.volume / 10
        : 0;
    }
  }, [mixer.osc3.enabled, mixer.osc3.volume]);

  useEffect(() => {
    oscRef.current?.update({
      waveform: oscillator3.waveform as Oscillator3Waveform,
      range: oscillator3.range,
    });
  }, [oscillator3.waveform, oscillator3.range]);

  const triggerAttack = useCallback(
    (note: string) => {
      const baseFreq = noteToFrequency(note);
      const detuneSemis = oscillator3.frequency || 0;
      const freq = baseFreq * Math.pow(2, detuneSemis / 12);
      if (!oscRef.current) return;
      const oscNode = oscRef.current.getNode();
      if (!oscNode) {
        if (glideOn && lastFrequencyRef.current !== null) {
          oscRef.current.start(lastFrequencyRef.current);
          const newOscNode = oscRef.current.getNode();
          if (newOscNode) {
            const mappedGlideTime = Math.pow(10, glideTime / 5) * 0.02;
            newOscNode.frequency.linearRampToValueAtTime(
              freq,
              audioContext.currentTime + mappedGlideTime
            );
          }
        } else {
          oscRef.current.start(freq);
        }
      } else {
        if (glideOn) {
          const mappedGlideTime = Math.pow(10, glideTime / 5) * 0.02;
          oscNode.frequency.linearRampToValueAtTime(
            freq,
            audioContext.currentTime + mappedGlideTime
          );
        } else {
          oscNode.frequency.setValueAtTime(freq, audioContext.currentTime);
        }
      }
      lastFrequencyRef.current = freq;
    },
    [oscillator3.frequency, glideOn, glideTime, audioContext]
  );

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
