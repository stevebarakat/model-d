import { useRef, useEffect, useState } from "react";
import { useAudioContext } from "@/hooks/useAudioContext";
import { useSynthStore } from "@/store/synthStore";

interface SynthAudioNodes {
  mixerNode: GainNode | null;
  filterNode: BiquadFilterNode | null;
  loudnessEnvelopeGain: GainNode | null;
  masterGain: GainNode | null;
  isMixerReady: boolean;
}

export function useSynthAudio(): SynthAudioNodes {
  const { audioContext } = useAudioContext();
  const { masterVolume, isMasterActive } = useSynthStore();

  const mixerNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const loudnessEnvelopeGainRef = useRef<GainNode | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const [isMixerReady, setIsMixerReady] = useState(false);

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

    const loudnessGain = audioContext.createGain();
    loudnessGain.gain.value = 1;
    loudnessEnvelopeGainRef.current = loudnessGain;

    const masterGain = audioContext.createGain();
    masterGain.gain.value = 1;
    masterGainRef.current = masterGain;

    // Connect: Mixer -> Filter -> Loudness Envelope -> Master -> Destination
    if (mixer && filter && loudnessGain && masterGain) {
      mixer.connect(filter);
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

  // Set master volume on mixerNode
  useEffect(() => {
    if (!audioContext || !mixerNodeRef.current) return;
    if (!isMasterActive) {
      mixerNodeRef.current.gain.setValueAtTime(0, audioContext.currentTime);
    } else {
      const gain = Math.pow(masterVolume / 10, 2);
      mixerNodeRef.current.gain.setValueAtTime(gain, audioContext.currentTime);
    }
  }, [masterVolume, isMasterActive, audioContext]);

  // Set master volume on masterGain
  useEffect(() => {
    if (masterGainRef.current && audioContext) {
      const gain = Math.pow(masterVolume / 10, 2);
      masterGainRef.current.gain.setValueAtTime(gain, audioContext.currentTime);
    }
  }, [masterVolume, audioContext]);

  return {
    mixerNode: mixerNodeRef.current,
    filterNode: filterNodeRef.current,
    loudnessEnvelopeGain: loudnessEnvelopeGainRef.current,
    masterGain: masterGainRef.current,
    isMixerReady,
  };
}
