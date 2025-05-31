import { useRef, useMemo } from "react";
import { useNoise } from "@/components/Mixer/hooks";
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

  return (
    <div className={styles.synthContainer}>
      <Side />
      <div className={styles.synth}>
        <div className={styles.controlsPanel}>
          <Controllers />
          <OscillatorBank />
          <Mixer />
          <Modifiers />
          <Output />
        </div>
        <div className={styles.keyboardPanel}>
          <SidePanel />
          <Keyboard
            activeKeys={activeKeys}
            octaveRange={{ min: 3, max: 5 }}
            onKeyDown={setActiveKeys}
            onKeyUp={() => setActiveKeys(null)}
            synth={synthObj}
          />
        </div>
      </div>
      <Side />
    </div>
  );
}

export default Synth;
