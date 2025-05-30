import { useEffect, useRef, useCallback } from "react";
import { useSynthStore } from "@/store/synthStore";
import { createOscillator2, Osc2Instance } from "../audio/oscillator2";
import { OscillatorType } from "@/types";

export type UseOscillator2Result = {
  triggerAttack: (note: string) => void;
  triggerRelease: (note?: string) => void;
};

export function useOscillator2(
  audioContext: AudioContext
): UseOscillator2Result {
  const { oscillator2, mixer, glideOn, glideTime } = useSynthStore();
  const oscRef = useRef<Osc2Instance | null>(null);

  useEffect(() => {
    oscRef.current = createOscillator2({
      audioContext,
      waveform: oscillator2.waveform as OscillatorType,
      frequency: oscillator2.frequency,
      range: oscillator2.range,
    });
    return () => {
      oscRef.current?.stop();
      oscRef.current = null;
    };
  }, [
    audioContext,
    oscillator2.frequency,
    oscillator2.range,
    oscillator2.waveform,
  ]);

  useEffect(() => {
    if (oscRef.current) {
      oscRef.current.getGainNode().gain.value = mixer.osc2.enabled
        ? mixer.osc2.volume / 10
        : 0;
    }
  }, [mixer.osc2.enabled, mixer.osc2.volume]);

  useEffect(() => {
    oscRef.current?.update({
      waveform: oscillator2.waveform as OscillatorType,
      range: oscillator2.range,
    });
  }, [oscillator2.waveform, oscillator2.range]);

  const triggerAttack = useCallback(
    (note: string) => {
      const baseFreq = noteToFrequency(note);
      const detuneSemis = oscillator2.frequency || 0;
      const freq = baseFreq * Math.pow(2, detuneSemis / 12);
      if (!oscRef.current) return;
      const oscNode = oscRef.current.getNode();
      if (!oscNode) {
        oscRef.current.start(freq);
        return;
      }
      if (glideOn) {
        oscNode.frequency.setTargetAtTime(
          freq,
          audioContext.currentTime,
          glideTime
        );
      } else {
        oscNode.frequency.setValueAtTime(freq, audioContext.currentTime);
      }
    },
    [oscillator2.frequency, glideOn, glideTime, audioContext]
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
