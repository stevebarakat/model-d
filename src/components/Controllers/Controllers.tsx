import { RockerSwitch } from "../RockerSwitch";
import Title from "../Title";
import Tune from "../Tune";
import Glide from "../Glide";
import ModulationMix from "../ModulationMix";
import Section from "../Section";
import Column from "../Column";
import Row from "../Row";
import { useSynthStore } from "@/store/synthStore";

interface ControllersProps {
  disabled?: boolean;
}

function Controllers({ disabled = false }: ControllersProps) {
  const osc3FilterEgSwitch = useSynthStore((s) => s.osc3FilterEgSwitch);
  const setOsc3FilterEgSwitch = useSynthStore((s) => s.setOsc3FilterEgSwitch);
  const noiseLfoSwitch = useSynthStore((s) => s.noiseLfoSwitch);
  const setNoiseLfoSwitch = useSynthStore((s) => s.setNoiseLfoSwitch);

  return (
    <Section
      style={{
        paddingLeft: "var(--spacing-md)",
        paddingRight: "var(--spacing-md)",
      }}
    >
      <Column gap="var(--spacing-lg)">
        <Tune disabled={disabled} />
        <Row gap="var(--spacing-sm)">
          <Glide disabled={disabled} />
          <ModulationMix disabled={disabled} />
        </Row>
        <Row
          justify="space-around"
          style={{ marginBottom: "var(--spacing-md)" }}
        >
          <RockerSwitch
            checked={osc3FilterEgSwitch}
            onCheckedChange={disabled ? () => {} : setOsc3FilterEgSwitch}
            label="Send to mod 1"
            bottomLabelLeft="Osc. 3"
            bottomLabelRight="Filter Eg"
            disabled={disabled}
          />
          <RockerSwitch
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
