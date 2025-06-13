import { useRef, useMemo, useEffect, useState } from "react";
import { useNoise } from "@/components/Noise/hooks";
import {
  useOscillator1,
  useOscillator2,
  useOscillator3,
} from "@/components/OscillatorBank/hooks";
import Modifiers from "../Modifiers";
import Mixer from "../Mixer";
import OscillatorBank from "../OscillatorBank";
import Controllers from "../Controllers";
import Output from "../Output";
import Keyboard from "@/components/Keyboard";
import SidePanel from "@/components/SidePanel";
import Side from "@/components/Side";
import { useSynthStore } from "@/store/synthStore";
import { useAudioContext } from "@/hooks/useAudioContext";
import styles from "./Synth.module.css";
import PowerButton from "../PowerButton";
import Power from "../Power";

// Helper: Convert note name (e.g., 'C4') to MIDI number
function noteNameToMidi(note: string): number {
  const noteMap: Record<string, number> = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    "A#": 10,
    B: 11,
  };
  const match = note.match(/^([A-G]#?)(-?\d+)$/);
  if (!match) return 60; // default to C4
  const [, n, oct] = match;
  return 12 * (parseInt(oct, 10) + 1) + noteMap[n];
}

// Helper to map internal waveform names to Web Audio API types
function mapOscillatorType(waveform: string) {
  switch (waveform) {
    case "triangle":
      return "triangle";
    case "sawtooth":
      return "sawtooth";
    case "pulse1":
      return "square";
    // Add more mappings as needed
    default:
      return "sine"; // fallback for custom or unsupported types
  }
}

function Synth() {
  const { activeKeys, setActiveKeys, masterVolume, isMasterActive } =
    useSynthStore();

  const { audioContext, isInitialized, initialize, dispose } =
    useAudioContext();

  // Create a single mixer node for all sources
  const mixerNodeRef = useRef<GainNode | null>(null);
  // Create a filter node (lowpass) after the mixer
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const [isMixerReady, setIsMixerReady] = useState(false);

  // Connect filterCutoff and filterEmphasis to the filter node
  const filterCutoff = useSynthStore((state) => state.filterCutoff);
  const filterEmphasis = useSynthStore((state) => state.filterEmphasis);

  const filterContourAmount = useSynthStore(
    (state) => state.filterContourAmount
  );
  const filterAttack = useSynthStore((state) => state.filterAttack);
  const filterDecay = useSynthStore((state) => state.filterDecay);
  const filterSustain = useSynthStore((state) => state.filterSustain);

  const filterModulationOn = useSynthStore((state) => state.filterModulationOn);
  const keyboardControl1 = useSynthStore((state) => state.keyboardControl1);
  const keyboardControl2 = useSynthStore((state) => state.keyboardControl2);
  const modWheel = useSynthStore((state) => state.modWheel);
  const oscillatorModulationOn = useSynthStore(
    (state) => state.oscillatorModulationOn
  );
  const lfoRate = useSynthStore((state) => state.lfoRate);
  const lfoWaveform = useSynthStore((state) => state.lfoWaveform);
  const osc3Control = useSynthStore((state) => state.osc3Control);
  const modMix = useSynthStore((state) => state.modMix);
  const osc3FilterEgSwitch = useSynthStore((state) => state.osc3FilterEgSwitch);
  const noiseLfoSwitch = useSynthStore((state) => state.noiseLfoSwitch);

  const osc3State = useSynthStore((s) => s.oscillator3);

  useEffect(() => {
    // Clean up previous mixer and filter nodes if context changes or is disposed

    console.log(
      "modMix:",
      modMix,
      "osc3FilterEgSwitch:",
      osc3FilterEgSwitch,
      "noiseLfoSwitch:",
      noiseLfoSwitch,
      "modWheel:",
      modWheel,
      "oscillatorModulationOn:",
      oscillatorModulationOn,
      "filterModulationOn:",
      filterModulationOn
    );

    if (mixerNodeRef.current) {
      mixerNodeRef.current.disconnect();
      mixerNodeRef.current = null;
      setIsMixerReady(false);
    }
    if (filterNodeRef.current) {
      filterNodeRef.current.disconnect();
      filterNodeRef.current = null;
    }
    if (audioContext) {
      mixerNodeRef.current = audioContext.createGain();
      mixerNodeRef.current.gain.value = 1;
      filterNodeRef.current = audioContext.createBiquadFilter();
      filterNodeRef.current.type = "lowpass";
      filterNodeRef.current.frequency.value = 20000; // wide open by default
      // Connect: mixer -> filter -> destination
      mixerNodeRef.current.connect(filterNodeRef.current);
      filterNodeRef.current.connect(audioContext.destination);
      // Ensure the mixer node is ready
      if (audioContext.state === "running") {
        setIsMixerReady(true);
      } else {
        const handleStateChange = () => {
          if (audioContext.state === "running") {
            setIsMixerReady(true);
            audioContext.removeEventListener("statechange", handleStateChange);
          }
        };
        audioContext.addEventListener("statechange", handleStateChange);
        return () => {
          audioContext.removeEventListener("statechange", handleStateChange);
        };
      }
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
    };
  }, [audioContext]);

  // Only pass mixer node to hooks when it's ready
  const mixerNode = isMixerReady ? mixerNodeRef.current : null;
  // Always call hooks, pass null if not initialized
  const validCtx: AudioContext | null =
    audioContext && mixerNode ? audioContext : null;
  // For useNoise, mixerNode must be GainNode | null
  const validMixer: GainNode | null =
    audioContext && mixerNodeRef.current instanceof GainNode
      ? mixerNodeRef.current
      : null;
  useNoise(validCtx, validMixer);
  // Vibrato: 6 Hz sine, depth up to 1 semitone (modWheel=100)
  const vibratoAmount =
    oscillatorModulationOn && modWheel > 0 ? modWheel / 100 : 0;
  const osc1 = useOscillator1(validCtx, mixerNode, vibratoAmount);
  const osc2 = useOscillator2(validCtx, mixerNode, vibratoAmount);
  const osc3 = useOscillator3(validCtx, mixerNode, vibratoAmount);

  // Helper to map 0-10 to 20 Hz - 20,000 Hz logarithmically
  function mapCutoff(val: number) {
    const minFreq = 20;
    const maxFreq = 20000;
    return minFreq * Math.pow(maxFreq / minFreq, val / 10);
  }

  // Helper to map 0-10 to a modulation amount (octaves above base cutoff)
  function mapContourAmount(val: number) {
    // 0 = no envelope, 10 = up to 4 octaves above base cutoff
    return val * 0.4; // 0-4 octaves
  }

  const synthObj = useMemo(() => {
    return {
      triggerAttack: (note: string) => {
        osc1?.triggerAttack?.(note);
        osc2?.triggerAttack?.(note);
        osc3?.triggerAttack?.(note);
        if (filterNodeRef.current && audioContext) {
          // Key tracking calculation
          const keyTracking =
            (keyboardControl1 ? 1 / 3 : 0) + (keyboardControl2 ? 2 / 3 : 0);
          const noteNumber = noteNameToMidi(note);
          const baseNoteNumber = 60; // C4
          const baseCutoff = mapCutoff(filterCutoff);
          const trackedCutoff =
            baseCutoff *
            Math.pow(2, (keyTracking * (noteNumber - baseNoteNumber)) / 12);

          if (filterModulationOn) {
            // Envelope modulation as before, but start from trackedCutoff
            const contourOctaves =
              mapContourAmount(filterContourAmount) * (modWheel / 100);
            const attackTime = 0.005 + (filterAttack / 10) * 2.0;
            const decayTime = 0.005 + (filterDecay / 10) * 2.0;
            const sustainLevel = filterSustain / 10;
            const envMax = trackedCutoff * Math.pow(2, contourOctaves);
            const envSustain =
              trackedCutoff + (envMax - trackedCutoff) * sustainLevel;
            const now = audioContext.currentTime;
            filterNodeRef.current.frequency.cancelScheduledValues(now);
            filterNodeRef.current.frequency.setValueAtTime(trackedCutoff, now);
            filterNodeRef.current.frequency.linearRampToValueAtTime(
              envMax,
              now + attackTime
            );
            filterNodeRef.current.frequency.linearRampToValueAtTime(
              envSustain,
              now + attackTime + decayTime
            );
          } else {
            // No envelope, just set cutoff with key tracking
            const now = audioContext.currentTime;
            filterNodeRef.current.frequency.cancelScheduledValues(now);
            filterNodeRef.current.frequency.setValueAtTime(trackedCutoff, now);
          }
        }
      },
      triggerRelease: (note: string) => {
        osc1?.triggerRelease?.();
        osc2?.triggerRelease?.(note);
        osc3?.triggerRelease?.();
        // Optionally, implement envelope release here
      },
    };
  }, [
    osc1,
    osc2,
    osc3,
    filterNodeRef,
    audioContext,
    filterCutoff,
    filterContourAmount,
    filterAttack,
    filterDecay,
    filterSustain,
    filterModulationOn,
    keyboardControl1,
    keyboardControl2,
    modWheel,
  ]);

  // Set master volume on mixerNode
  useEffect(() => {
    if (mixerNode && audioContext) {
      if (!isMasterActive) {
        mixerNode.gain.setValueAtTime(0, audioContext.currentTime);
      } else {
        const gain = Math.pow(masterVolume / 10, 2);
        mixerNode.gain.setValueAtTime(gain, audioContext.currentTime);
      }
    }
  }, [masterVolume, isMasterActive, audioContext, mixerNode]);

  useEffect(() => {
    if (!filterNodeRef.current) return;
    // Key tracking for static cutoff
    let trackedCutoff = mapCutoff(filterCutoff);
    const keyTracking =
      (keyboardControl1 ? 1 / 3 : 0) + (keyboardControl2 ? 2 / 3 : 0);
    if (activeKeys) {
      const noteNumber = noteNameToMidi(activeKeys);
      const baseNoteNumber = 60;
      trackedCutoff =
        trackedCutoff *
        Math.pow(2, (keyTracking * (noteNumber - baseNoteNumber)) / 12);
    }
    filterNodeRef.current.frequency.setValueAtTime(
      trackedCutoff,
      filterNodeRef.current.context.currentTime
    );
    // Map 0-10 to Q: 0.7 (no resonance) to 15 (classic Minimoog max resonance)
    const minQ = 0.7;
    const maxQ = 15;
    const q = minQ + (maxQ - minQ) * (filterEmphasis / 10);
    filterNodeRef.current.Q.setValueAtTime(
      q,
      filterNodeRef.current.context.currentTime
    );
  }, [
    filterCutoff,
    filterEmphasis,
    activeKeys,
    keyboardControl1,
    keyboardControl2,
  ]);

  // --- LFO Node Setup ---
  const lfoNodeRef = useRef<OscillatorNode | null>(null);
  const lfoGainRef = useRef<GainNode | null>(null);
  // LFO modulates pitch (vibrato) and/or filter cutoff
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
    // Map lfoRate (0-10) to 0.1 Hz to 20 Hz
    const minHz = 0.1;
    const maxHz = 20;
    lfo.frequency.value = minHz * Math.pow(maxHz / minHz, lfoRate / 10);
    const lfoGain = audioContext.createGain();
    // LFO depth: scale by modWheel (0-100), max depth = 1 semitone for pitch, 2 octaves for filter
    lfoGain.gain.value = 1; // We'll scale in the modulation logic
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

  // --- LFO Modulation Logic ---
  useEffect(() => {
    if (!audioContext || !lfoGainRef.current) return;
    // Disconnect any previous connections
    lfoGainRef.current.disconnect();
    // Pitch modulation (vibrato)
    if (oscillatorModulationOn && modWheel > 0) {
      // For each oscillator, connect LFO to frequency param
      [osc1, osc2, osc3].forEach((osc) => {
        const node = osc?.getNode?.();
        if (node) {
          // Max vibrato depth: ±1 semitone (≈5.95%)
          const depth = (modWheel / 100) * 5.95; // in percent
          const vibratoGain = audioContext.createGain();
          vibratoGain.gain.value = (node.frequency.value * depth) / 100;
          lfoGainRef.current!.connect(vibratoGain);
          vibratoGain.connect(node.frequency);
        }
      });
    }
    // Filter modulation
    if (filterModulationOn && modWheel > 0 && filterNodeRef.current) {
      // Max filter LFO depth: 2 octaves (frequency * 4)
      const baseFreq = filterNodeRef.current.frequency.value;
      const depth = (modWheel / 100) * baseFreq * 3; // up to +3x base freq
      const filterLfoGain = audioContext.createGain();
      filterLfoGain.gain.value = depth;
      lfoGainRef.current!.connect(filterLfoGain);
      filterLfoGain.connect(filterNodeRef.current.frequency);
    }
    // Cleanup: disconnect on unmount
    return () => {
      if (lfoGainRef.current) lfoGainRef.current.disconnect();
    };
  }, [
    oscillatorModulationOn,
    filterModulationOn,
    modWheel,
    osc1,
    osc2,
    osc3,
    audioContext,
    filterNodeRef,
  ]);

  // --- Modulation-Only Nodes and Routing ---
  const modOsc3Ref = useRef<OscillatorNode | null>(null);
  const modNoiseRef = useRef<AudioBufferSourceNode | null>(null);
  const modNoiseBufferRef = useRef<AudioBuffer | null>(null);
  const modEnvelopeGainRef = useRef<GainNode | null>(null);
  const modLeftGainRef = useRef<GainNode | null>(null);
  const modRightGainRef = useRef<GainNode | null>(null);
  const modSumGainRef = useRef<GainNode | null>(null);
  const modWheelGainRef = useRef<GainNode | null>(null);
  // Add modulation gain refs for each oscillator
  const modOsc1GainRef = useRef<GainNode | null>(null);
  const modOsc2GainRef = useRef<GainNode | null>(null);
  const modOsc3GainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!audioContext) return;

    // Clean up previous modulation gains
    modOsc1GainRef.current?.disconnect();
    modOsc2GainRef.current?.disconnect();
    modOsc3GainRef.current?.disconnect();
    modOsc1GainRef.current = null;
    modOsc2GainRef.current = null;
    modOsc3GainRef.current = null;

    // --- Create modulation-only OSC3 ---
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

    // --- Create modulation-only Noise ---
    if (!modNoiseBufferRef.current) {
      // Create a buffer of white noise
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

    // --- Create Filter EG envelope as a GainNode (modulated by your envelope logic) ---
    if (!modEnvelopeGainRef.current) {
      modEnvelopeGainRef.current = audioContext.createGain();
      modEnvelopeGainRef.current.gain.value = 0;
      // You will need to trigger this gain node's gain automation in your envelope logic!
    }

    // --- Crossfade GainNodes ---
    if (!modLeftGainRef.current)
      modLeftGainRef.current = audioContext.createGain();
    if (!modRightGainRef.current)
      modRightGainRef.current = audioContext.createGain();
    if (!modSumGainRef.current)
      modSumGainRef.current = audioContext.createGain();
    if (!modWheelGainRef.current)
      modWheelGainRef.current = audioContext.createGain();

    // --- Disconnect all sources from gain nodes before reconnecting ---
    if (modOsc3Ref.current) modOsc3Ref.current.disconnect();
    if (modNoiseRef.current) modNoiseRef.current.disconnect();
    if (modEnvelopeGainRef.current) modEnvelopeGainRef.current.disconnect();
    if (lfoGainRef.current) lfoGainRef.current.disconnect();

    // --- Connect only the selected sources ---
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

    // --- Crossfade ---
    const mix = modMix / 10;
    const depth = 5; // Increase this value if you want more modulation depth
    modLeftGainRef.current.gain.value = (1 - mix) * depth;
    modRightGainRef.current.gain.value = mix * depth;

    // --- Sum and scale by mod wheel ---
    modLeftGainRef.current.connect(modSumGainRef.current);
    modRightGainRef.current.connect(modSumGainRef.current);
    modSumGainRef.current.connect(modWheelGainRef.current);
    modWheelGainRef.current.gain.value = modWheel / 100;

    // --- Route to destinations ---
    // Pitch modulation (if oscillatorModulationOn)
    if (oscillatorModulationOn && audioContext && modWheelGainRef.current) {
      // We've verified these are non-null in the if condition
      const ctx = audioContext as AudioContext;
      const wheelGain = modWheelGainRef.current as GainNode;
      [osc1, osc2, osc3].forEach((osc, index) => {
        const node = osc?.getNode?.();
        if (node) {
          // Create a gain node for this oscillator's modulation
          const modGain = ctx.createGain();
          // Store the gain node in the appropriate ref
          if (index === 0) modOsc1GainRef.current = modGain;
          else if (index === 1) modOsc2GainRef.current = modGain;
          else if (index === 2) modOsc3GainRef.current = modGain;

          // Calculate base frequency (assuming A4 = 440Hz if no note is playing)
          const baseFreq = node.frequency.value || 440;
          // Set gain to achieve ±1 semitone modulation at max mod wheel
          // 0.0595 is approximately 2^(1/12) - 1, which gives us ±1 semitone
          modGain.gain.value = baseFreq * 0.0595 * (modWheel / 100);

          // Connect the modulation chain
          wheelGain.connect(modGain);
          modGain.connect(node.frequency);
        }
      });
    }

    // Filter modulation (if filterModulationOn)
    if (filterModulationOn && filterNodeRef.current) {
      modWheelGainRef.current.connect(filterNodeRef.current.frequency);
    }

    console.log(
      "modMix:",
      modMix,
      "mix:",
      mix,
      "modLeftGain:",
      modLeftGainRef.current.gain.value,
      "modRightGain:",
      modRightGainRef.current.gain.value,
      "osc3FilterEgSwitch:",
      osc3FilterEgSwitch,
      "noiseLfoSwitch:",
      noiseLfoSwitch
    );

    // Optionally, log which sources are connected:
    console.log(
      "Left source:",
      osc3FilterEgSwitch ? "OSC3" : "Filter EG",
      "Right source:",
      noiseLfoSwitch ? "Noise" : "LFO"
    );

    // Cleanup on unmount
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
    filterNodeRef,
    lfoGainRef,
  ]);

  return (
    <div className={styles.synthContainer}>
      <Side />
      <div className={styles.synth}>
        <div className={styles.controlsPanel}>
          <Controllers disabled={!isInitialized} />
          <OscillatorBank disabled={!isInitialized} />
          <Mixer
            audioContext={audioContext}
            mixerNode={mixerNode}
            disabled={!isInitialized}
          />
          <Modifiers disabled={!isInitialized} />
          <Output disabled={!isInitialized} />
          <Power>
            <PowerButton
              isOn={isInitialized}
              onPowerOn={initialize}
              onPowerOff={dispose}
            />
          </Power>
        </div>
        <div className={styles.keyboardPanel}>
          <SidePanel disabled={!isInitialized} />
          <Keyboard
            activeKeys={activeKeys}
            octaveRange={{ min: 3, max: 5 }}
            onKeyDown={setActiveKeys}
            onKeyUp={() => setActiveKeys(null)}
            synth={synthObj}
            disabled={!isInitialized}
          />
        </div>
      </div>
      <Side />
    </div>
  );
}

export default Synth;
