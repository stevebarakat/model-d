import { useRef, useEffect } from "react";
import { useSynthStore } from "@/store/synthStore";
import { mapOscillatorType } from "../utils/synthUtils";
import type { ModulationProps } from "../types/synthTypes";

function useModulation({
  audioContext,
  osc1,
  osc2,
  osc3,
  filterNode,
}: ModulationProps) {
  const lfoNodeRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);
  const modOsc3Ref = useRef<OscillatorNode | null>(null);
  const modNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const modNoiseBufferRef = useRef<AudioBuffer | null>(null);
  const modEnvelopeGainRef = useRef<GainNode | null>(null);
  const modLeftGainRef = useRef<GainNode | null>(null);
  const modRightGainRef = useRef<GainNode | null>(null);
  const modSumGainRef = useRef<GainNode | null>(null);
  const modWheelGainRef = useRef<GainNode | null>(null);
  const modOsc1GainRef = useRef<GainNode | null>(null);
  const modOsc2GainRef = useRef<GainNode | null>(null);
  const modOsc3GainRef = useRef<GainNode | null>(null);

  const {
    lfoRate,
    lfoWaveform,
    oscillator3: osc3State,
    osc3Control,
    osc3FilterEgSwitch,
    noiseLfoSwitch,
    modMix,
    modWheel,
    oscillatorModulationOn,
    filterModulationOn,
  } = useSynthStore();

  // LFO setup
  useEffect(() => {
    if (!audioContext) return;

    // Clean up previous LFO
    lfoNodeRef.current?.disconnect();
    lfoGainRef.current?.disconnect();
    lfoNodeRef.current = null;
    lfoGainRef.current = null;

    // Create new LFO
    const lfo = audioContext.createOscillator();
    lfo.type = lfoWaveform;
    const minHz = 0.1;
    const maxHz = 20;
    lfo.frequency.value = minHz * Math.pow(maxHz / minHz, lfoRate / 10);
    const lfoGain = audioContext.createGain();
    lfoGain.gain.value = 1;
    lfo.connect(lfoGain);
    lfo.start();
    lfoNodeRef.current = lfo;
    lfoGainRef.current = lfoGain;

    return () => {
      lfo.stop();
      lfo.disconnect();
      lfoGain.disconnect();
    };
  }, [audioContext, lfoRate, lfoWaveform]);

  // Modulation sources setup
  useEffect(() => {
    if (!audioContext) return;

    // Clean up previous modulation gains
    modOsc1GainRef.current?.disconnect();
    modOsc2GainRef.current?.disconnect();
    modOsc3GainRef.current?.disconnect();
    modOsc1GainRef.current = null;
    modOsc2GainRef.current = null;
    modOsc3GainRef.current = null;

    // Create modulation-only OSC3
    if (!modOsc3Ref.current) {
      const osc = audioContext.createOscillator();
      osc.type = mapOscillatorType(osc3State.waveform);
      osc.frequency.value = osc3Control ? 440 : 6;
      osc.start();
      modOsc3Ref.current = osc;
    } else {
      modOsc3Ref.current.type = mapOscillatorType(osc3State.waveform);
      modOsc3Ref.current.frequency.value = osc3Control ? 440 : 6;
    }

    // Create modulation-only Noise
    if (!modNoiseBufferRef.current) {
      const bufferSize = audioContext.sampleRate * 2;
      const buffer = audioContext.createBuffer(
        1,
        bufferSize,
        audioContext.sampleRate
      );
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      modNoiseBufferRef.current = buffer;
    }
    if (!modNoiseRef.current) {
      const noise = audioContext.createBufferSource();
      noise.buffer = modNoiseBufferRef.current;
      noise.loop = true;
      noise.start();
      modNoiseRef.current = noise;
    }

    // Create modulation gains
    if (!modEnvelopeGainRef.current) {
      modEnvelopeGainRef.current = audioContext.createGain();
      modEnvelopeGainRef.current.gain.value = 0;
    }
    if (!modLeftGainRef.current)
      modLeftGainRef.current = audioContext.createGain();
    if (!modRightGainRef.current)
      modRightGainRef.current = audioContext.createGain();
    if (!modSumGainRef.current)
      modSumGainRef.current = audioContext.createGain();
    if (!modWheelGainRef.current)
      modWheelGainRef.current = audioContext.createGain();

    // Disconnect and reconnect sources
    if (modOsc3Ref.current) modOsc3Ref.current.disconnect();
    if (modNoiseRef.current) modNoiseRef.current.disconnect();
    if (modEnvelopeGainRef.current) modEnvelopeGainRef.current.disconnect();
    if (lfoGainRef.current) lfoGainRef.current.disconnect();

    // Connect selected sources
    if (osc3FilterEgSwitch) {
      if (modOsc3Ref.current)
        modOsc3Ref.current.connect(modLeftGainRef.current);
    } else {
      if (modEnvelopeGainRef.current)
        modEnvelopeGainRef.current.connect(modLeftGainRef.current);
    }
    if (noiseLfoSwitch) {
      if (modNoiseRef.current)
        modNoiseRef.current.connect(modRightGainRef.current);
    } else {
      if (lfoGainRef.current)
        lfoGainRef.current.connect(modRightGainRef.current);
    }

    // Set crossfade mix
    const mix = modMix / 10;
    const depth = 5;
    modLeftGainRef.current.gain.value = (1 - mix) * depth;
    modRightGainRef.current.gain.value = mix * depth;

    // Connect modulation chain
    modLeftGainRef.current.connect(modSumGainRef.current);
    modRightGainRef.current.connect(modSumGainRef.current);
    modSumGainRef.current.connect(modWheelGainRef.current);
    modWheelGainRef.current.gain.value = modWheel / 100;

    // Route to destinations
    if (oscillatorModulationOn && audioContext && modWheelGainRef.current) {
      [osc1, osc2, osc3].forEach((osc, index) => {
        const node = osc?.getNode?.();
        if (node) {
          const modGain = audioContext.createGain();
          if (index === 0) modOsc1GainRef.current = modGain;
          else if (index === 1) modOsc2GainRef.current = modGain;
          else if (index === 2) modOsc3GainRef.current = modGain;

          const baseFreq = node.frequency.value || 440;
          modGain.gain.value = baseFreq * 0.0595 * (modWheel / 100);

          modWheelGainRef.current?.connect(modGain);
          modGain.connect(node.frequency);
        }
      });
    }

    if (filterModulationOn && filterNode) {
      modWheelGainRef.current.connect(filterNode.frequency);
    }

    return () => {
      modOsc3Ref.current?.disconnect();
      modNoiseRef.current?.disconnect();
      modEnvelopeGainRef.current?.disconnect();
      modLeftGainRef.current?.disconnect();
      modRightGainRef.current?.disconnect();
      modSumGainRef.current?.disconnect();
      modWheelGainRef.current?.disconnect();
      if (lfoGainRef.current) lfoGainRef.current.disconnect();
      modOsc1GainRef.current?.disconnect();
      modOsc2GainRef.current?.disconnect();
      modOsc3GainRef.current?.disconnect();
    };
  }, [
    audioContext,
    osc3State.waveform,
    osc3Control,
    osc3FilterEgSwitch,
    noiseLfoSwitch,
    modMix,
    modWheel,
    oscillatorModulationOn,
    filterModulationOn,
    osc1,
    osc2,
    osc3,
    filterNode,
    lfoGainRef,
  ]);

  return {
    modEnvelopeGain: modEnvelopeGainRef.current,
  };
}
export default useModulation;
