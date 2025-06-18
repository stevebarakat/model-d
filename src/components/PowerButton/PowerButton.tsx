import React, { useCallback } from "react";
import { VerticalRockerSwitch } from "../RockerSwitches";
import Column from "../Column";
import { VintageLED } from "../VintageLED";
import Title from "../Title";

type PowerButtonProps = {
  isOn: boolean;
  onPowerOn: () => void;
  onPowerOff: () => void;
};

function PowerButton({ isOn, onPowerOn, onPowerOff }: PowerButtonProps) {
  const handleCheckedChange = useCallback(
    (e: React.FormEvent<HTMLInputElement>) => {
      if (e.currentTarget.checked) {
        onPowerOn();
      } else {
        onPowerOff();
      }
    },
    [onPowerOn, onPowerOff]
  );

  return (
    <Column>
      <VintageLED
        isOn={isOn}
        size="large"
        onCheckedChange={handleCheckedChange}
      />
      <Title size="sm" style={{ marginTop: "var(--spacing-xs)" }}>
        Power
      </Title>
      <VerticalRockerSwitch
        checked={isOn}
        onCheckedChange={handleCheckedChange}
        label="Power"
        theme="black"
        topLabel="On"
      />
    </Column>
  );
}

export default PowerButton;
