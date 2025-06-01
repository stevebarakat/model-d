import { useEffect, useRef, useCallback } from "react";
import { useSynthStore } from "@/store/synthStore";
import { createOscillator1, Osc1Instance } from "../audio/oscillator1";
import { OscillatorType } from "@/types";

export type UseOscillator1Result = {
  triggerAttack: (note: string) => void;
  triggerRelease: (note?: string) => void;
};

export function useOscillator1(
  audioContext: AudioContext,
  mixerNode?: AudioNode
): UseOscillator1Result {
  const { oscillator1, mixer, glideOn, glideTime, masterTune } =
    useSynthStore();
  const oscRef = useRef<Osc1Instance | null>(null);
  const lastFrequencyRef = useRef<number | null>(null);

  useEffect(() => {
    oscRef.current = createOscillator1(
      {
        audioContext,
        waveform: oscillator1.waveform as OscillatorType,
        range: oscillator1.range,
      },
      mixerNode
    );
    return () => {
      oscRef.current?.stop();
      oscRef.current = null;
    };
  }, [audioContext, oscillator1.range, oscillator1.waveform, mixerNode]);

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

  const triggerAttack = useCallback(
    (note: string) => {
      const freq = noteToFrequency(note) * Math.pow(2, masterTune / 12);
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
    [glideOn, glideTime, audioContext, masterTune]
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
