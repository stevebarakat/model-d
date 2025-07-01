import { useEffect, useRef, useCallback } from "react";
import { useSynthStore } from "@/store/synthStore";
import { createOscillator2, Osc2Instance } from "../audio/oscillator2";
import { OscillatorType } from "@/types";
import { noteToFrequency } from "@/utils/noteToFrequency";

export type UseOscillator2Result = {
  triggerAttack: (note: string) => void;
  triggerRelease: (note?: string) => void;
  getNode: () => OscillatorNode | null;
};

export function useOscillator2(
  audioContext: AudioContext | null,
  mixerNode?: AudioNode | null,
  vibratoAmount: number = 0
): UseOscillator2Result {
  const { oscillator2, mixer, glideOn, glideTime, masterTune, pitchWheel } =
    useSynthStore();
  const oscRef = useRef<Osc2Instance | null>(null);
  const lastFrequencyRef = useRef<number | null>(null);
  const lastNoteRef = useRef<string | null>(null);
  const vibratoIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (oscRef.current) {
      // Boost oscillator volume slightly for fatter sound
      const boostedVolume = Math.min(1, (mixer.osc2.volume / 10) * 1.15);
      oscRef.current.getGainNode().gain.value = mixer.osc2.enabled
        ? boostedVolume
        : 0;
    }
  }, [mixer.osc2.enabled, mixer.osc2.volume]);

  useEffect(() => {
    oscRef.current?.update({
      waveform: oscillator2.waveform as OscillatorType,
      range: oscillator2.range,
    });
  }, [oscillator2.waveform, oscillator2.range]);

  // Apply range changes to current frequency
  useEffect(() => {
    if (oscRef.current && lastFrequencyRef.current !== null) {
      oscRef.current.setFrequency(lastFrequencyRef.current);
    }
  }, [oscillator2.range]);

  const triggerAttack = useCallback(
    (note: string) => {
      if (!audioContext) return;

      if (!oscRef.current) {
        oscRef.current = createOscillator2(
          {
            audioContext,
            waveform: oscillator2.waveform as OscillatorType,
            frequency: oscillator2.frequency,
            range: oscillator2.range,
          },
          mixerNode ?? undefined
        );
      }

      lastNoteRef.current = note;
      const baseFreq = noteToFrequency(note) * Math.pow(2, masterTune / 12);
      const detuneSemis = oscillator2.frequency || 0;
      const bendSemis = ((pitchWheel - 50) / 50) * 2;
      // Add subtle detuning for fatter sound (osc2 slightly flat)
      const detuneCents = -3; // 3 cents flat
      const freq =
        baseFreq *
        Math.pow(2, (detuneSemis + bendSemis + detuneCents / 100) / 12);

      if (glideOn && lastFrequencyRef.current !== null) {
        oscRef.current.start(lastFrequencyRef.current);
        const oscNode = oscRef.current.getNode();
        if (oscNode) {
          const mappedGlideTime = Math.pow(10, glideTime / 5) * 0.02;
          oscNode.frequency.linearRampToValueAtTime(
            freq,
            audioContext.currentTime + mappedGlideTime
          );
        }
      } else {
        oscRef.current.start(freq);
      }
      lastFrequencyRef.current = freq;
      // Vibrato
      if (vibratoAmount > 0 && oscRef.current) {
        const oscNode = oscRef.current.getNode();
        const t0 = audioContext.currentTime;
        vibratoIntervalRef.current = window.setInterval(() => {
          const t = performance.now() / 1000 - t0;
          // 6 Hz vibrato, ±1 semitone max
          const vibratoSemis = Math.sin(2 * Math.PI * 6 * t) * vibratoAmount;
          const vibFreq =
            baseFreq *
            Math.pow(2, (detuneSemis + bendSemis + vibratoSemis) / 12);
          if (oscNode) {
            oscNode.frequency.setValueAtTime(vibFreq, audioContext.currentTime);
          }
        }, 1000 / 60);
      }
    },
    [
      audioContext,
      mixerNode,
      oscillator2,
      masterTune,
      pitchWheel,
      vibratoAmount,
      glideOn,
      glideTime,
    ]
  );

  const triggerRelease = useCallback(() => {
    if (vibratoIntervalRef.current) {
      clearInterval(vibratoIntervalRef.current);
      vibratoIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (oscRef.current && lastNoteRef.current) {
      const baseFreq =
        noteToFrequency(lastNoteRef.current) * Math.pow(2, masterTune / 12);
      const detuneSemis = oscillator2.frequency || 0;
      const bendSemis = ((pitchWheel - 50) / 50) * 2;
      const freq = baseFreq * Math.pow(2, (detuneSemis + bendSemis) / 12);
      const oscNode = oscRef.current.getNode();
      if (oscNode && audioContext) {
        oscNode.frequency.linearRampToValueAtTime(
          freq,
          audioContext.currentTime + 0.02
        );
      }
    }
  }, [pitchWheel]);

  useEffect(() => {
    return () => {
      if (oscRef.current) {
        oscRef.current.stop();
        oscRef.current = null;
      }
      if (vibratoIntervalRef.current) {
        clearInterval(vibratoIntervalRef.current);
        vibratoIntervalRef.current = null;
      }
    };
  }, []);

  if (!audioContext) {
    return {
      triggerAttack: () => {},
      triggerRelease: () => {},
      getNode: () => null,
    };
  }

  return {
    triggerAttack,
    triggerRelease,
    getNode: () => oscRef.current?.getNode() ?? null,
  };
}
