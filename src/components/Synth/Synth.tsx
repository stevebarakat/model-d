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
  const [isMixerReady, setIsMixerReady] = useState(false);

  useEffect(() => {
    // Clean up previous mixer node if context changes or is disposed
    if (mixerNodeRef.current) {
      mixerNodeRef.current.disconnect();
      mixerNodeRef.current = null;
      setIsMixerReady(false);
    }
    if (audioContext) {
      mixerNodeRef.current = audioContext.createGain();
      mixerNodeRef.current.gain.value = 1;
      mixerNodeRef.current.connect(audioContext.destination);
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
    };
  }, [audioContext]);

  // Only pass mixer node to hooks when it's ready
  const mixerNode = isMixerReady ? mixerNodeRef.current : null;

  // Always call hooks, pass null if not initialized
  useNoise(audioContext ?? null, mixerNode);
  const osc1 = useOscillator1(audioContext ?? null, mixerNode);
  const osc2 = useOscillator2(audioContext ?? null, mixerNode);
  const osc3 = useOscillator3(audioContext ?? null, mixerNode);

  const synthObj = useMemo(() => {
    return {
      triggerAttack: (note: string) => {
        osc1.triggerAttack(note);
        osc2.triggerAttack(note);
        osc3.triggerAttack(note);
      },
      triggerRelease: (note: string) => {
        osc1.triggerRelease();
        osc2.triggerRelease(note);
        osc3.triggerRelease();
      },
    };
  }, [osc1, osc2, osc3]);

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
