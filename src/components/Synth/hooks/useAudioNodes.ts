import { useRef, useEffect, useState } from "react";
import { useSynthStore } from "@/store/synthStore";
import { mapCutoff } from "../utils/synthUtils";
import { AudioNodes } from "../types/synthTypes";

function useAudioNodes(audioContext: AudioContext | null): AudioNodes {
  const mixerNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const loudnessEnvelopeGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [isMixerReady, setIsMixerReady] = useState(false);

  const { filterCutoff, filterEmphasis, mainVolume, isMainActive } =
    useSynthStore();

  // Initialize audio nodes
  useEffect(() => {
    if (!audioContext) return;

    // Create nodes
    const filter = audioContext.createBiquadFilter();
    filter.type = "lowpass";
    filter.Q.value = 0;
    filterNodeRef.current = filter;

    const mixer = audioContext.createGain();
    mixer.gain.value = 1;
    mixerNodeRef.current = mixer;
    setIsMixerReady(true);

    // Add subtle saturation for fatter sound
    const saturationNode = audioContext.createWaveShaper();
    const saturationCurve = new Float32Array(4096);
    for (let i = 0; i < 4096; i++) {
      const x = (i * 2) / 4096 - 1;
      saturationCurve[i] = Math.tanh(x * 1.5) / 1.5; // Subtle saturation
    }
    saturationNode.curve = saturationCurve;
    saturationNode.oversample = "4x";

    const loudnessGain = audioContext.createGain();
    loudnessGain.gain.value = 1;
    loudnessEnvelopeGainRef.current = loudnessGain;

    const masterGain = audioContext.createGain();
    masterGain.gain.value = 1;
    masterGainRef.current = masterGain;

    // Connect: Mixer -> Saturation -> Filter -> Loudness Envelope -> Master -> Destination
    if (mixer && saturationNode && filter && loudnessGain && masterGain) {
      mixer.connect(saturationNode);
      saturationNode.connect(filter);
      filter.connect(loudnessGain);
      loudnessGain.connect(masterGain);
      masterGain.connect(audioContext.destination);
    }

    return () => {
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

  // Set filter cutoff and emphasis
  useEffect(() => {
    if (!filterNodeRef.current || !audioContext) return;

    filterNodeRef.current.frequency.setValueAtTime(
      mapCutoff(filterCutoff),
      audioContext.currentTime
    );

    // Map 0-10 to Q: 0.7 (no resonance) to 15 (classic Minimoog max resonance)
    // Add slight boost to default resonance for fatter sound
    const minQ = 0.7;
    const maxQ = 15;
    const boostedEmphasis = Math.min(10, filterEmphasis + 1); // Boost resonance by 1
    const q = minQ + (maxQ - minQ) * (boostedEmphasis / 10);
    filterNodeRef.current.Q.setValueAtTime(q, audioContext.currentTime);
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
