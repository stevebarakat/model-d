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

  useEffect(() => {
    // Clean up previous mixer and filter nodes if context changes or is disposed
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
  const validCtx = audioContext && mixerNode ? audioContext : null;
  const validMixer = audioContext && mixerNode ? mixerNode : null;
  useNoise(validCtx, validMixer);
  const osc1 = useOscillator1(validCtx, validMixer);
  const osc2 = useOscillator2(validCtx, validMixer);
  const osc3 = useOscillator3(validCtx, validMixer);

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
        // Filter envelope modulation
        if (filterNodeRef.current && audioContext) {
          // Get base cutoff from knob
          const baseCutoff = mapCutoff(filterCutoff);
          // Envelope amount in octaves
          const contourOctaves = mapContourAmount(filterContourAmount);
          // Envelope times (map 0-10 to 0.005-5s for attack/decay)
          const attackTime = 0.005 + (filterAttack / 10) * 2.0; // 5ms-2s
          const decayTime = 0.005 + (filterDecay / 10) * 2.0; // 5ms-2s
          // Sustain level (0-1)
          const sustainLevel = filterSustain / 10;
          // Envelope target frequency
          const envMax = baseCutoff * Math.pow(2, contourOctaves);
          const envSustain = baseCutoff + (envMax - baseCutoff) * sustainLevel;
          const now = audioContext.currentTime;
          // Cancel previous automation
          filterNodeRef.current.frequency.cancelScheduledValues(now);
          // Start at base cutoff
          filterNodeRef.current.frequency.setValueAtTime(baseCutoff, now);
          // Attack to envMax
          filterNodeRef.current.frequency.linearRampToValueAtTime(
            envMax,
            now + attackTime
          );
          // Decay to sustain
          filterNodeRef.current.frequency.linearRampToValueAtTime(
            envSustain,
            now + attackTime + decayTime
          );
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
    // Map 0-10 to 20 Hz - 20,000 Hz logarithmically
    const minFreq = 20;
    const maxFreq = 20000;
    const cutoff = minFreq * Math.pow(maxFreq / minFreq, filterCutoff / 10);
    filterNodeRef.current.frequency.setValueAtTime(
      cutoff,
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
  }, [filterCutoff, filterEmphasis]);

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
