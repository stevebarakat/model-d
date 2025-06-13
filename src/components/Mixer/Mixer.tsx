import { useSynthStore } from "@/store/synthStore";
import Knob from "../Knob";
import Title from "../Title";
import Noise from "../Noise";
import ExternalInput from "../ExternalInput";
import Row from "../Row";
import Column from "../Column";
import Section from "../Section";
import HorizontalRockerSwitch from "../RockerSwitch/HorizontalRockerSwitch";

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
                      console.log("Osc1 volume changed to", v);
                      setMixerSource("osc1", { volume: v });
                    }
              }
              size="medium"
              disabled={disabled}
            />
            <HorizontalRockerSwitch
              style={{ left: "15px" }}
              theme="blue"
              checked={mixer.osc1.enabled}
              onCheckedChange={(checked) => {
                console.log("Osc1 enabled changed to", checked);
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
                      console.log("Osc2 volume changed to", v);
                      setMixerSource("osc2", { volume: v });
                    }
              }
              size="medium"
              disabled={disabled}
            />
            <HorizontalRockerSwitch
              style={{ left: "15px" }}
              theme="blue"
              checked={mixer.osc2.enabled}
              onCheckedChange={(checked) => {
                console.log("Osc2 enabled changed to", checked);
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
                      console.log("Osc3 volume changed to", v);
                      setMixerSource("osc3", { volume: v });
                    }
              }
              size="medium"
              disabled={disabled}
            />
            <HorizontalRockerSwitch
              style={{ left: "15px" }}
              theme="blue"
              checked={mixer.osc3.enabled}
              onCheckedChange={(checked) => {
                console.log("Osc3 enabled changed to", checked);
                setMixerSource("osc3", { enabled: checked });
              }}
              label="Oscillator 3"
              bottomLabelRight="On"
              disabled={disabled}
            />
          </Row>
        </Column>
        <Column style={{ paddingRight: "5rem", left: "35px" }}>
          <ExternalInput audioContext={audioContext} mixerNode={mixerNode} />
          <Noise audioContext={audioContext} mixerNode={mixerNode} />
        </Column>
      </Row>
      <Title>Mixer</Title>
    </Section>
  );
}

export default Mixer;
