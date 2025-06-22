import Knob from "../Knob";
import { RockerSwitch } from "../RockerSwitch";
import Title from "../Title";
import { useSynthStore } from "@/store/synthStore";
import Section from "../Section";
import Column from "../Column";
import Row from "../Row";

type OutputProps = {
  disabled?: boolean;
  children?: React.ReactNode;
};

export default function Output({ disabled = false, children }: OutputProps) {
  const { masterVolume, setMasterVolume, isMasterActive, setIsMasterActive } =
    useSynthStore();
  return (
    <Section>
      {children}
      <Column
        gap="var(--spacing-xl)"
        style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
      >
        <Row gap="var(--spacing-md)">
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
          <RockerSwitch
            theme="blue"
            checked={isMasterActive}
            onCheckedChange={
              disabled
                ? () => {}
                : (checked) => {
                    setIsMasterActive(checked);
                  }
            }
            label="Main Output"
            topLabel="Main&nbsp;Output"
            bottomLabelRight="On"
            disabled={disabled}
          />
        </Row>
      </Column>
      <Title>Output</Title>
    </Section>
  );
}
