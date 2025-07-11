import { useRef, useEffect, useState } from "react";
import { useSynthStore } from "@/store/synthStore";
import { AudioNodes } from "../types/synthTypes";

function useAudioNodes(audioContext: AudioContext | null): AudioNodes {
  const mixerNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<AudioWorkletNode | null>(null);
  const loudnessEnvelopeGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [isMixerReady, setIsMixerReady] = useState(false);

  const { filterCutoff, filterEmphasis, mainVolume, isMainActive } =
    useSynthStore();

  // Initialize audio nodes
  useEffect(() => {
    if (!audioContext) return;

    let isMounted = true;
    (async () => {
      // Create nodes
      // --- Mixer ---
      const mixer = audioContext.createGain();
      mixer.gain.value = 1;
      mixerNodeRef.current = mixer;
      setIsMixerReady(true);

      // --- Saturation (unchanged) ---
      const saturationNode = audioContext.createWaveShaper();
      const saturationCurve = new Float32Array(4096);
      for (let i = 0; i < 4096; i++) {
        const x = (i * 2) / 4096 - 1;
        saturationCurve[i] = Math.tanh(x * 1.5) / 1.5; // Subtle saturation
      }
      saturationNode.curve = saturationCurve;
      saturationNode.oversample = "4x";

      // --- Moog Filter AudioWorkletNode ---
      const moogFilter = new AudioWorkletNode(
        audioContext,
        "worklet-processor"
      );
      filterNodeRef.current = moogFilter;

      // Fetch and send WASM binary
      const response = await fetch("/moog-filter/filterKernel.wasm");
      const wasmBinary = await response.arrayBuffer();
      moogFilter.port.postMessage(wasmBinary);

      // --- Loudness Envelope Gain ---
      const loudnessGain = audioContext.createGain();
      loudnessGain.gain.value = 1;
      loudnessEnvelopeGainRef.current = loudnessGain;

      // --- Master Gain ---
      const masterGain = audioContext.createGain();
      masterGain.gain.value = 1;
      masterGainRef.current = masterGain;

      // --- Connect: Mixer -> Saturation -> Moog Filter -> Loudness Envelope -> Master -> Destination ---
      if (
        isMounted &&
        mixer &&
        saturationNode &&
        moogFilter &&
        loudnessGain &&
        masterGain
      ) {
        mixer.connect(saturationNode);
        // Temporarily bypass filter for testing
        saturationNode.connect(loudnessGain);
        // moogFilter.connect(loudnessGain);
        loudnessGain.connect(masterGain);
        masterGain.connect(audioContext.destination);
      }
    })();

    return () => {
      isMounted = false;
      if (mixerNodeRef.current) {
        mixerNodeRef.current.disconnect();
        mixerNodeRef.current = null;
        setIsMixerReady(false);
      }
      if (filterNodeRef.current) {
        filterNodeRef.current.disconnect();
        filterNodeRef.current = null;
      }
      if (loudnessEnvelopeGainRef.current) {
        loudnessEnvelopeGainRef.current.disconnect();
        loudnessEnvelopeGainRef.current = null;
      }
      if (masterGainRef.current) {
        masterGainRef.current.disconnect();
        masterGainRef.current = null;
      }
    };
  }, [audioContext]);

  // Set filter cutoff and emphasis (send to worklet)
  useEffect(() => {
    if (!filterNodeRef.current || !audioContext) return;
    // Map 0-10 to 0.0-1.0 for cutoff and resonance
    const cutoffNorm = Math.max(0, Math.min(1, filterCutoff / 10));
    const resonanceNorm = Math.max(0, Math.min(1, filterEmphasis / 10));
    filterNodeRef.current.port.postMessage({ cutOff: cutoffNorm });
    filterNodeRef.current.port.postMessage({ resonance: resonanceNorm });
  }, [filterCutoff, filterEmphasis, audioContext]);

  // Set master volume
  useEffect(() => {
    if (!masterGainRef.current || !audioContext) return;
    const gain = Math.pow(mainVolume / 10, 2);
    masterGainRef.current.gain.setValueAtTime(gain, audioContext.currentTime);
  }, [mainVolume, audioContext]);

  // Set mixer volume based on master active state
  useEffect(() => {
    if (!audioContext || !mixerNodeRef.current) return;
    if (!isMainActive) {
      mixerNodeRef.current.gain.setValueAtTime(0, audioContext.currentTime);
    } else {
      const gain = Math.pow(mainVolume / 10, 2);
      mixerNodeRef.current.gain.setValueAtTime(gain, audioContext.currentTime);
    }
  }, [mainVolume, isMainActive, audioContext]);

  return {
    mixerNode: mixerNodeRef.current,
    filterNode: filterNodeRef.current,
    loudnessEnvelopeGain: loudnessEnvelopeGainRef.current,
    masterGain: masterGainRef.current,
    isMixerReady,
  };
}

export default useAudioNodes;
