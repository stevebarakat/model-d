import { useEffect, useRef, useCallback } from "react";
import { useSynthStore } from "@/store/synthStore";
import { createOscillator1, Osc1Instance } from "../audio/oscillator1";
import { noteToFrequency } from "@/utils/noteToFrequency";

export type UseOscillator1Result = {
  triggerAttack: (note: string) => void;
  triggerRelease: () => void;
};

export function useOscillator1(
  audioContext: AudioContext | null,
  mixerNode: GainNode | null
): UseOscillator1Result {
  const oscillatorRef = useRef<Osc1Instance | null>(null);
  const { oscillator1, masterTune, glideOn, glideTime, pitchWheel } =
    useSynthStore();
  const lastFrequencyRef = useRef<number | null>(null);
  const lastNoteRef = useRef<string | null>(null);
  const { enabled, volume } = useSynthStore((s) => s.mixer.osc1);

  const triggerAttack = useCallback(
    (note: string) => {
      if (audioContext && mixerNode) {
        if (!oscillatorRef.current) {
          oscillatorRef.current = createOscillator1(
            {
              audioContext,
              waveform: oscillator1.waveform as
                | "triangle"
                | "tri_saw"
                | "sawtooth"
                | "pulse1"
                | "pulse2"
                | "pulse3",
              range: oscillator1.range,
              gain: oscillator1.enabled ? 1 : 0,
            },
            mixerNode
          );
        }
        lastNoteRef.current = note;
        const baseFreq = noteToFrequency(note) * Math.pow(2, masterTune / 12);
        const bendSemis = ((pitchWheel - 50) / 50) * 2;
        const frequency = baseFreq * Math.pow(2, bendSemis / 12);
        console.log(
          `[Osc1] note: ${note}, baseFreq: ${baseFreq}, bendSemis: ${bendSemis}, finalFreq: ${frequency}`
        );
        if (glideOn && lastFrequencyRef.current !== null) {
          oscillatorRef.current.start(lastFrequencyRef.current);
          const oscNode = oscillatorRef.current.getNode();
          if (oscNode) {
            const mappedGlideTime = Math.pow(10, glideTime / 5) * 0.02;
            oscNode.frequency.linearRampToValueAtTime(
              frequency,
              audioContext.currentTime + mappedGlideTime
            );
          }
        } else {
          oscillatorRef.current.start(frequency);
        }
        lastFrequencyRef.current = frequency;
      }
    },
    [
      audioContext,
      mixerNode,
      oscillator1,
      masterTune,
      glideOn,
      glideTime,
      pitchWheel,
    ]
  );

  const triggerRelease = useCallback(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
    }
  }, [audioContext, mixerNode]);

  useEffect(() => {
    return () => {
      if (oscillatorRef.current) {
        oscillatorRef.current.stop();
        oscillatorRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.getGainNode().gain.value = enabled
        ? volume / 10
        : 0;
    }
  }, [enabled, volume]);

  useEffect(() => {
    if (oscillatorRef.current) {
      oscillatorRef.current.update({
        waveform: oscillator1.waveform,
        range: oscillator1.range,
      });
    }
  }, [oscillator1.waveform, oscillator1.range]);

  useEffect(() => {
    if (oscillatorRef.current && lastNoteRef.current) {
      const baseFreq =
        noteToFrequency(lastNoteRef.current) * Math.pow(2, masterTune / 12);
      const bendSemis = ((pitchWheel - 50) / 50) * 2;
      const frequency = baseFreq * Math.pow(2, bendSemis / 12);
      const oscNode = oscillatorRef.current.getNode();
      if (oscNode && audioContext) {
        oscNode.frequency.linearRampToValueAtTime(
          frequency,
          audioContext.currentTime + 0.02
        );
        console.log(
          `[Osc1-PB] Real-time update (ramp): note: ${lastNoteRef.current}, baseFreq: ${baseFreq}, bendSemis: ${bendSemis}, finalFreq: ${frequency}`
        );
      }
    }
  }, [pitchWheel]);

  return { triggerAttack, triggerRelease };
}
