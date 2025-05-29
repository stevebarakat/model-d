import { useEffect, useRef } from "react";
import { useSynthStore } from "@/store/synthStore";

export function useNoise(audioContext: AudioContext) {
  const { mixer, activeKeys } = useSynthStore();
  const gainRef = useRef<GainNode | null>(null);
  const noiseRef = useRef<AudioWorkletNode | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function setup() {
      if (!audioContext || !mixer.noise.enabled || !activeKeys) return;
      const moduleUrl =
        mixer.noise.noiseType === "pink"
          ? "/pink-noise-processor.js"
          : "/white-noise-processor.js";
      await audioContext.audioWorklet.addModule(moduleUrl);
      if (cancelled) return;
      gainRef.current = audioContext.createGain();
      gainRef.current.gain.value = mixer.noise.volume / 10;
      noiseRef.current = new AudioWorkletNode(
        audioContext,
        mixer.noise.noiseType === "pink"
          ? "pink-noise-processor"
          : "white-noise-processor"
      );
      noiseRef.current.connect(gainRef.current);
      gainRef.current.connect(audioContext.destination);
    }
    setup();

    return () => {
      cancelled = true;
      gainRef.current?.disconnect();
      noiseRef.current?.disconnect();
      gainRef.current = null;
      noiseRef.current = null;
    };
  }, [audioContext, mixer.noise.noiseType, mixer.noise.enabled, activeKeys]);

  useEffect(() => {
    if (gainRef.current) {
      gainRef.current.gain.value = mixer.noise.volume / 10;
    }
  }, [mixer.noise.volume]);
}
