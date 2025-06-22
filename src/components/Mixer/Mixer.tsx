import { useSynthStore } from "@/store/synthStore";
import Knob from "../Knob";
import Title from "../Title";
import Noise from "../Noise";
import ExternalInput from "../ExternalInput";
import Row from "../Row";
import Column from "../Column";
import Section from "../Section";
import { RockerSwitch } from "../RockerSwitch";
import Line from "../Line";

type MixerProps = {
  audioContext: AudioContext;
  mixerNode: AudioNode;
  disabled?: boolean;
};

function Mixer({ audioContext, mixerNode, disabled = false }: MixerProps) {
  const { mixer, setMixerSource } = useSynthStore();

  return (
    <Section>
      <Row>
        <Column gap="0.5rem">
          <Row>
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
                  : (v) => {
                      setMixerSource("osc1", { volume: v });
                    }
              }
              size="medium"
              disabled={disabled}
              style={{
                top: "-0.25rem",
              }}
            />
            <Line />
            <RockerSwitch
              style={{ left: "1.5rem" }}
              theme="blue"
              checked={mixer.osc1.enabled}
              onCheckedChange={(checked) => {
                setMixerSource("osc1", { enabled: checked });
              }}
              label="Oscillator 1"
              bottomLabelRight="On"
              disabled={disabled}
            />
          </Row>
          <Row>
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
                disabled
                  ? () => {}
                  : (v) => {
                      setMixerSource("osc2", { volume: v });
                    }
              }
              size="medium"
              disabled={disabled}
              style={{
                top: "-0.25rem",
              }}
            />
            <Line />
            <RockerSwitch
              style={{ left: "1.5rem" }}
              theme="blue"
              checked={mixer.osc2.enabled}
              onCheckedChange={(checked) => {
                setMixerSource("osc2", { enabled: checked });
              }}
              label="Oscillator 2"
              bottomLabelRight="On"
              disabled={disabled}
            />
          </Row>
          <Row>
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
                disabled
                  ? () => {}
                  : (v) => {
                      setMixerSource("osc3", { volume: v });
                    }
              }
              size="medium"
              disabled={disabled}
              style={{
                top: "-0.25rem",
              }}
            />
            <Line />
            <RockerSwitch
              style={{ left: "1.5rem" }}
              theme="blue"
              checked={mixer.osc3.enabled}
              onCheckedChange={(checked) => {
                setMixerSource("osc3", { enabled: checked });
              }}
              label="Oscillator 3"
              bottomLabelRight="On"
              disabled={disabled}
            />
          </Row>
        </Column>
        <Column style={{ paddingRight: "5rem", left: "35px", gap: "0.5rem" }}>
          <ExternalInput audioContext={audioContext} mixerNode={mixerNode} />
          <Noise audioContext={audioContext} mixerNode={mixerNode} />
        </Column>
      </Row>
      <Title>Mixer</Title>
    </Section>
  );
}

export default Mixer;
