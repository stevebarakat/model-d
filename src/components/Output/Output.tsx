import Knob from "../Knob";
import HorizontalRockerSwitch from "../RockerSwitch/HorizontalRockerSwitch";
import Title from "../Title";
import { useSynthStore } from "@/store/synthStore";
import Section from "../Section";
import Column from "../Column";
import Row from "../Row";
import LedIndicator from "../LedIndicator";

interface OutputProps {
  disabled?: boolean;
}

function Output({ disabled = false }: OutputProps) {
  const { masterVolume, setMasterVolume, isMasterActive, setIsMasterActive } =
    useSynthStore();
  return (
    <Section>
      <Column style={{ gap: "var(--spacing-md)" }}>
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
            value={masterVolume}
            min={0}
            max={10}
            step={0.1}
            onChange={disabled ? () => {} : setMasterVolume}
            label="Volume"
            disabled={disabled}
          />
          <HorizontalRockerSwitch
            theme="blue"
            checked={isMasterActive}
            onCheckedChange={disabled ? () => {} : setIsMasterActive}
            label="Main Output"
            bottomLabelRight="On"
            disabled={disabled}
          />
        </Row>
        <Row>
          <HorizontalRockerSwitch
            theme="blue"
            checked={false}
            onCheckedChange={disabled ? () => {} : () => {}}
            label="Send to mod 1"
            topLabel="Limiter"
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
            value={10}
            min={0}
            max={10}
            step={0.1}
            onChange={() => {}}
            label="Amount"
            disabled={disabled}
          />
          <LedIndicator
            label="Overload"
            isEnabled={false}
            volume={10}
            audioLevel={10}
            disabled={disabled}
          />
        </Row>
      </Column>
      <Title>Output</Title>
    </Section>
  );
}

export default Output;
