import { useSynthStore } from "@/store/synthStore";
import MuteSwitches from "./MuteSwitches";
import Knob from "../Knob";
import Title from "../Title";
import styles from "./Mixer.module.css";
import Noise from "../Noise";
import ExternalInput from "../ExternalInput";
import Row from "../Row";
import Column from "../Column";
import Section from "../Section";

interface MixerProps {
  audioContext: AudioContext;
  mixerNode: AudioNode;
  disabled?: boolean;
}

function Mixer({ audioContext, mixerNode, disabled = false }: MixerProps) {
  const { mixer, setMixerSource } = useSynthStore();

  return (
    <Section>
      <Row>
        <Column>
          <Knob
            valueLabels={{
              0: "0",
              2: "2",
              4: "4",
              6: "6",
              8: "8",
              10: "10",
            }}
            value={mixer.osc1.volume}
            min={0}
            max={10}
            step={1}
            title="Volume"
            label="Oscillator 1 Volume"
            onChange={
              disabled ? () => {} : (v) => setMixerSource("osc1", { volume: v })
            }
            size="medium"
            disabled={disabled}
          />
          <Knob
            valueLabels={{
              0: "0",
              2: "2",
              4: "4",
              6: "6",
              8: "8",
              10: "10",
            }}
            value={mixer.osc2.volume}
            min={0}
            max={10}
            step={1}
            title=" "
            label="Oscillator 2 Volume"
            onChange={
              disabled ? () => {} : (v) => setMixerSource("osc2", { volume: v })
            }
            size="medium"
            disabled={disabled}
          />
          <Knob
            valueLabels={{
              0: "0",
              2: "2",
              4: "4",
              6: "6",
              8: "8",
              10: "10",
            }}
            value={mixer.osc3.volume}
            min={0}
            max={10}
            step={1}
            title=" "
            label="Oscillator 3 Volume"
            onChange={
              disabled ? () => {} : (v) => setMixerSource("osc3", { volume: v })
            }
            size="medium"
            disabled={disabled}
          />
        </Column>
        <MuteSwitches disabled={disabled} />

        <div className={styles.offsetColumn}>
          <ExternalInput
            audioContext={audioContext}
            mixerNode={mixerNode}
            disabled={disabled}
          />
          <Noise
            audioContext={audioContext}
            mixerNode={mixerNode}
            disabled={disabled}
          />
        </div>
      </Row>
      <Title>Mixer</Title>
    </Section>
  );
}

export default Mixer;
