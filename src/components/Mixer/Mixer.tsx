import { useSynthStore } from "@/store/synthStore";
import { HorizontalRockerSwitch } from "../RockerSwitch";
import Knob from "../Knob";
import Title from "../Title";
import styles from "./Mixer.module.css";
import Noise from "../Noise";
import ExternalInput from "../ExternalInput";
import Row from "../Row";
import Column from "../Column";
import Section from "../Section";

type MixerProps = {
  audioContext: AudioContext;
  mixerNode: AudioNode;
};

function Mixer({ audioContext, mixerNode }: MixerProps) {
  const { mixer, setMixerSource, setMixerNoise, setMixerExternal } =
    useSynthStore();

  const handleExternalToggle = (checked: boolean) => {
    setMixerExternal({ enabled: checked });
  };

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
            onChange={(v) => setMixerSource("osc1", { volume: v })}
            size="medium"
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
            onChange={(v) => setMixerSource("osc2", { volume: v })}
            size="medium"
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
            onChange={(v) => setMixerSource("osc3", { volume: v })}
            size="medium"
          />
        </Column>
        <div className={styles.mixerSwitches}>
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.osc1.enabled}
            onCheckedChange={(checked) =>
              setMixerSource("osc1", { enabled: checked })
            }
            label="Oscillator 1"
            bottomLabelRight="On"
          />
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.external.enabled}
            onCheckedChange={handleExternalToggle}
            label="External Input"
            bottomLabelRight="On"
          />
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.osc2.enabled}
            onCheckedChange={(checked) =>
              setMixerSource("osc2", { enabled: checked })
            }
            label="Oscillator 2"
            bottomLabelRight="On"
          />
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.noise.enabled}
            onCheckedChange={(checked) => setMixerNoise({ enabled: checked })}
            label="Noise"
            bottomLabelRight="On"
          />
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.osc3.enabled}
            onCheckedChange={(checked) =>
              setMixerSource("osc3", { enabled: checked })
            }
            label="Oscillator 3"
            bottomLabelRight="On"
          />
        </div>
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
