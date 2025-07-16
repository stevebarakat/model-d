import styles from "./Controls.module.css";
import Mixer from "../Mixer";
import OscillatorBank from "../OscillatorBank";
import Modifiers from "../Modifiers";
import Output from "../Output";
import Section from "../Section";
import PowerButton from "../PowerButton";
import Controllers from "../Controllers";
import { useAudioContext } from "@/hooks/useAudioContext";
import { useAudioNodes } from "../Minimoog/hooks";

function Controls() {
  const { audioContext, isInitialized, initialize, dispose } =
    useAudioContext();

  const { mixerNode } = useAudioNodes(audioContext);

  return (
    <div className={styles.controlsPanel}>
      <Controllers />
      <OscillatorBank />
      <Mixer audioContext={audioContext!} mixerNode={mixerNode!} />
      <Modifiers />
      <Output />
      <Section
        style={{
          borderRadius: "0 0 10px 0",
          marginRight: "var(--spacing-md)",
        }}
      >
        <PowerButton
          isOn={isInitialized}
          onPowerOn={initialize}
          onPowerOff={dispose}
        />
      </Section>
    </div>
  );
}

export default Controls;
