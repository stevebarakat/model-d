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
import HorizontalRockerSwitch from "../RockerSwitch/HorizontalRockerSwitch";
import Flex from "../Flex";

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
          <Flex gap="50px">
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
                disabled
                  ? () => {}
                  : (v) => setMixerSource("osc1", { volume: v })
              }
              size="medium"
              disabled={disabled}
            />
            <HorizontalRockerSwitch
              theme="blue"
              checked={mixer.osc1.enabled}
              onCheckedChange={(checked) =>
                setMixerSource("osc1", { enabled: checked })
              }
              label="Oscillator 1"
              bottomLabelRight="On"
              disabled={disabled}
            />
          </Flex>
          <Flex gap="50px">
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
              title="Volume"
              label="Oscillator 2 Volume"
              onChange={
                disabled
                  ? () => {}
                  : (v) => setMixerSource("osc2", { volume: v })
              }
              size="medium"
              disabled={disabled}
            />
            <HorizontalRockerSwitch
              theme="blue"
              checked={mixer.osc2.enabled}
              onCheckedChange={(checked) =>
                setMixerSource("osc2", { enabled: checked })
              }
              label="Oscillator 2"
              bottomLabelRight="On"
              disabled={disabled}
            />
          </Flex>
          <Flex gap="50px">
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
              title="Volume"
              label="Oscillator 3 Volume"
              onChange={
                disabled
                  ? () => {}
                  : (v) => setMixerSource("osc3", { volume: v })
              }
              size="medium"
              disabled={disabled}
            />
            <HorizontalRockerSwitch
              theme="blue"
              checked={mixer.osc3.enabled}
              onCheckedChange={(checked) =>
                setMixerSource("osc3", { enabled: checked })
              }
              label="Oscillator 3"
              bottomLabelRight="On"
              disabled={disabled}
            />
          </Flex>
        </Column>
        {/* <MuteSwitches /> */}

        <div className={styles.offsetColumn}>
          <ExternalInput audioContext={audioContext} mixerNode={mixerNode} />
          <Noise audioContext={audioContext} mixerNode={mixerNode} />
        </div>
      </Row>
      <Title>Mixer</Title>
    </Section>
  );
}

export default Mixer;
