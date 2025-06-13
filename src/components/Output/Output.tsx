import Knob from "../Knob";
import HorizontalRockerSwitch from "../RockerSwitch/HorizontalRockerSwitch";
import Title from "../Title";
import { useSynthStore } from "@/store/synthStore";
import Section from "../Section";
import Column from "../Column";
import Row from "../Row";

type OutputProps = {
  disabled?: boolean;
};

export default function Output({ disabled = false }: OutputProps) {
  const {
    masterVolume,
    setMasterVolume,
    isMasterActive,
    setIsMasterActive,
    phonesVolume = 0,
    setPhonesVolume = () => {},
    isPhonesActive = false,
    setIsPhonesActive = () => {},
  } = useSynthStore();
  console.log("[Output] isMasterActive:", isMasterActive);
  return (
    <Section>
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
          <HorizontalRockerSwitch
            theme="blue"
            checked={isMasterActive}
            onCheckedChange={
              disabled
                ? () => {}
                : (checked) => {
                    console.log(
                      "[Output] Main Output switch toggled:",
                      checked
                    );
                    setIsMasterActive(checked);
                  }
            }
            label="Main Output"
            topLabel="Main&nbsp;Output"
            bottomLabelRight="On"
            disabled={disabled}
          />
        </Row>
        <Row>
          <HorizontalRockerSwitch
            theme="blue"
            checked={false}
            onCheckedChange={disabled ? () => {} : () => {}}
            label="A - 440"
            topLabel="A - 440"
            bottomLabelRight="On"
            disabled={disabled}
          />
        </Row>
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
            value={phonesVolume}
            min={0}
            max={10}
            step={0.1}
            onChange={disabled ? () => {} : setPhonesVolume}
            label="Phones Volume"
            title="Volume"
            disabled={disabled}
          />
          <HorizontalRockerSwitch
            theme="blue"
            checked={isPhonesActive}
            onCheckedChange={disabled ? () => {} : setIsPhonesActive}
            label="Enable Headphones"
            topLabel="Phones"
            bottomLabelRight="On"
            disabled={disabled}
          />
        </Row>
      </Column>
      <Title>Output</Title>
    </Section>
  );
}
