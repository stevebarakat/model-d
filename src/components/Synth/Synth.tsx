import { useRef, useMemo, useEffect } from "react";
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

function Synth() {
  const { activeKeys, setActiveKeys, masterVolume, isMasterActive } =
    useSynthStore();

  const { audioContext, isInitialized, initialize, dispose } =
    useAudioContext();

  // Create a single mixer node for all sources
  const mixerNodeRef = useRef<GainNode | null>(null);
  useEffect(() => {
    if (!mixerNodeRef.current && audioContext) {
      mixerNodeRef.current = audioContext.createGain();
      mixerNodeRef.current.gain.value = 1;
      mixerNodeRef.current.connect(audioContext.destination);
    }
  }, [audioContext]);

  // Always call hooks, pass null if not initialized
  useNoise(audioContext ?? null, mixerNodeRef.current ?? null);
  const osc1 = useOscillator1(
    audioContext ?? null,
    mixerNodeRef.current ?? null
  );
  const osc2 = useOscillator2(
    audioContext ?? null,
    mixerNodeRef.current ?? null
  );
  const osc3 = useOscillator3(
    audioContext ?? null,
    mixerNodeRef.current ?? null
  );

  const synthObj = useMemo(() => {
    return {
      triggerAttack: (note: string) => {
        osc1.triggerAttack(note);
        osc2.triggerAttack(note);
        osc3.triggerAttack(note);
      },
      triggerRelease: () => {
        osc1.triggerRelease();
        osc2.triggerRelease();
        osc3.triggerRelease();
      },
    };
  }, [osc1, osc2, osc3]);

  // Set master volume on mixerNode
  useEffect(() => {
    if (mixerNodeRef.current && audioContext) {
      if (!isMasterActive) {
        mixerNodeRef.current.gain.setValueAtTime(0, audioContext.currentTime);
      } else {
        const gain = Math.pow(masterVolume / 10, 2);
        mixerNodeRef.current.gain.setValueAtTime(
          gain,
          audioContext.currentTime
        );
      }
    }
  }, [masterVolume, isMasterActive, audioContext]);

  return (
    <div className={styles.synthContainer}>
      <div style={{ position: "absolute", top: 24, right: 24, zIndex: 10 }}>
        <PowerButton
          isOn={isInitialized}
          onPowerOn={initialize}
          onPowerOff={dispose}
        />
      </div>
      <Side />
      <div className={styles.synth}>
        <div className={styles.controlsPanel}>
          <Controllers disabled={!isInitialized} />
          <OscillatorBank disabled={!isInitialized} />
          <Mixer
            audioContext={audioContext}
            mixerNode={mixerNodeRef.current}
            disabled={!isInitialized}
          />
          <Modifiers disabled={!isInitialized} />
          <Output disabled={!isInitialized} />
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
