import { useRef, useEffect, useMemo } from "react";
import { useNoise } from "@/components/Mixer/hooks";
import { useKeyboardHandling } from "@/hooks";
import {
  useOscillator1,
  useOscillator2,
  useOscillator3,
} from "@/components/OscillatorBank/hooks";
import SynthControls from "@/components/SynthControls";
import Keyboard from "@/components/Keyboard";
import SidePanel from "@/components/SidePanel";
import { useSynthStore } from "@/store/synthStore";
import styles from "./Synth.module.css";

function Synth() {
  const { activeKeys, setActiveKeys } = useSynthStore();

  const audioContextRef = useRef<AudioContext | null>(null);
  if (!audioContextRef.current) {
    audioContextRef.current = new window.AudioContext();
  }

  useNoise(audioContextRef.current!);

  const osc1 = useOscillator1(audioContextRef.current);
  const osc2 = useOscillator2(audioContextRef.current);
  const osc3 = useOscillator3(audioContextRef.current);

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

  const keyboardRef = useRef<{
    synth: typeof synthObj;
  }>({ synth: synthObj });

  useEffect(() => {
    keyboardRef.current.synth = synthObj;
  }, [synthObj]);

  const { handleKeyDown, handleKeyUp, handleMouseDown, handleMouseUp } =
    useKeyboardHandling({
      keyboardRef,
      activeKeys,
      setActiveKeys,
    });

  return (
    <div className={styles.synthSides}>
      <div className={styles.synth}>
        <div className={styles.controlsContainer}>
          <div className={styles.backPanel}></div>
          <div className={styles.innerControlsContainer}>
            <SynthControls />
          </div>
          <div className={styles.horizontalIndent}></div>
        </div>
        <div className={styles.keyRow}>
          <SidePanel />

          <Keyboard
            activeKeys={activeKeys}
            octaveRange={{ min: 3, max: 5 }}
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            synth={keyboardRef.current.synth}
          />
        </div>
      </div>
    </div>
  );
}

export default Synth;
