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
    <Section>
      <Column>
        <Row>
          <Tune disabled={disabled} />
        </Row>
        <Row>
          <Glide disabled={disabled} />
          <Knob
            value={0}
            min={0}
            max={10}
            step={1}
            label="Modulation Mix"
            onChange={disabled ? () => {} : () => {}}
            valueLabels={{
              "0": "-7",
              "1.42": "-5",
              "2.85": "-3",
              "4.28": "-1",
              "5.71": "1",
              "7.14": "3",
              "8.57": "5",
              "10": "7",
            }}
            disabled={disabled}
          />
        </Row>
        <Row>
          <HorizontalRockerSwitch
            theme="blue"
            checked={false}
            onCheckedChange={disabled ? () => {} : () => {}}
            label="Send to mod 1"
            bottomLabelLeft="Osc. 3"
            bottomLabelRight="Filter Eg"
            disabled={disabled}
          />
          <HorizontalRockerSwitch
            theme="blue"
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
