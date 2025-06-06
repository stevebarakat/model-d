import { HorizontalRockerSwitch } from "../RockerSwitch";
import Title from "../Title";
import Knob from "../Knob";
import Tune from "../Tune";
import Glide from "../Glide";
import Section from "../Section";
import Column from "../Column";
import Row from "../Row";

interface ControllersProps {
  disabled?: boolean;
}

function Controllers({ disabled = false }: ControllersProps) {
  return (
    <Section style={{ padding: "6.5rem var(--spacing-xs) 0" }}>
      <Column gap="var(--spacing-xs)">
        <Tune disabled={disabled} />
        <Row gap="0.25rem">
          <Glide disabled={disabled} />
          <Knob
            value={0}
            min={0}
            max={10}
            step={1}
            label="Modulation Mix"
            onChange={disabled ? () => {} : () => {}}
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
            checked={false}
            onCheckedChange={disabled ? () => {} : () => {}}
            label="Send to mod 1"
            bottomLabelLeft="Osc. 3"
            bottomLabelRight="Filter Eg"
            disabled={disabled}
          />
          <HorizontalRockerSwitch
            checked={false}
            onCheckedChange={disabled ? () => {} : () => {}}
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
