import { useEffect, useRef } from "react";
import { useSynthStore } from "@/store/synthStore";

export function useNoise(
  audioContext: AudioContext | null,
  mixerNode?: AudioNode | null
) {
  const { mixer, activeKeys } = useSynthStore();
  const gainRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioWorkletNode | null>(null);

  useEffect(() => {
    if (!audioContext) {
      gainRef.current = null;
      noiseRef.current = null;
      return;
    }
    let cancelled = false;

    async function setup() {
      if (!audioContext || !activeKeys) return;
      // Add subtle noise even when not explicitly enabled for fatter sound
      const shouldEnableNoise = mixer.noise.enabled || mixer.noise.volume > 0;
      if (!shouldEnableNoise) return;
      const moduleUrl =
        mixer.noise.noiseType === "pink"
          ? "/pink-noise-processor.js"
          : "/white-noise-processor.js";
      await audioContext.audioWorklet.addModule(moduleUrl);
      if (cancelled) return;
      gainRef.current = audioContext.createGain();
      const initialGain = mixer.noise.volume / 10;
      gainRef.current.gain.value = isFinite(initialGain) ? initialGain : 0;

      noiseRef.current = new AudioWorkletNode(
        audioContext,
        mixer.noise.noiseType === "pink"
          ? "pink-noise-processor"
          : "white-noise-processor"
      );
      noiseRef.current.connect(gainRef.current);
      if (mixerNode) {
        gainRef.current.connect(mixerNode);
      } else {
        gainRef.current.connect(audioContext.destination);
      }
    }
    setup();

    return () => {
      cancelled = true;
      gainRef.current?.disconnect();
      noiseRef.current?.disconnect();
      gainRef.current = null;
      noiseRef.current = null;
    };
  }, [
    audioContext,
    mixer.noise.noiseType,
    mixer.noise.enabled,
    mixer.noise.volume,
    mixerNode,
    activeKeys,
  ]);

  useEffect(() => {
    if (gainRef.current) {
      const newGain = mixer.noise.volume / 10;
      // Guard against NaN and non-finite values
      gainRef.current.gain.value = isFinite(newGain) ? newGain : 0;
    }
  }, [mixer.noise.volume]);
}
