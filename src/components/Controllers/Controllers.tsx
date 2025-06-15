import { HorizontalRockerSwitch } from "../RockerSwitches";
import Title from "../Title";
import Knob from "../Knob";
import Tune from "../Tune";
import Glide from "../Glide";
import Section from "../Section";
import Column from "../Column";
import Row from "../Row";
import { useSynthStore } from "@/store/synthStore";

interface ControllersProps {
  disabled?: boolean;
}

function Controllers({ disabled = false }: ControllersProps) {
  const modMix = useSynthStore((s) => s.modMix);
  const setModMix = useSynthStore((s) => s.setModMix);
  const osc3FilterEgSwitch = useSynthStore((s) => s.osc3FilterEgSwitch);
  const setOsc3FilterEgSwitch = useSynthStore((s) => s.setOsc3FilterEgSwitch);
  const noiseLfoSwitch = useSynthStore((s) => s.noiseLfoSwitch);
  const setNoiseLfoSwitch = useSynthStore((s) => s.setNoiseLfoSwitch);

  return (
    <Section
      style={{
        paddingLeft: "var(--spacing-xs)",
        paddingRight: "var(--spacing-xs)",
      }}
    >
      <Column gap="var(--spacing-xs)">
        <Tune disabled={disabled} />
        <Row gap="0.25rem">
          <Glide disabled={disabled} />
          <Knob
            value={modMix}
            min={0}
            max={10}
            step={1}
            label="Modulation Mix"
            onChange={disabled ? () => {} : setModMix}
            valueLabels={{
              "0": "0",
              "2": "2",
              "4": "4",
              "6": "6",
              "8": "8",
              "10": "10",
            }}
            disabled={disabled}
          />
        </Row>
        <Row justify="space-around">
          <HorizontalRockerSwitch
            checked={osc3FilterEgSwitch}
            onCheckedChange={disabled ? () => {} : setOsc3FilterEgSwitch}
            label="Send to mod 1"
            bottomLabelLeft="Osc. 3"
            bottomLabelRight="Filter Eg"
            disabled={disabled}
          />
          <HorizontalRockerSwitch
            checked={noiseLfoSwitch}
            onCheckedChange={disabled ? () => {} : setNoiseLfoSwitch}
            label="Send to mod 2"
            bottomLabelLeft="Noise"
            bottomLabelRight="LFO"
            disabled={disabled}
          />
        </Row>
      </Column>
      <Title>Controllers</Title>
    </Section>
  );
}

export default Controllers;
