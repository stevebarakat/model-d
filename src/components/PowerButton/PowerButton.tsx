import React from "react";
import { VerticalRockerSwitch } from "../RockerSwitches";
import Column from "../Column";
import { VintageLED } from "../VintageLED";
import Title from "../Title";

interface PowerButtonProps {
  isOn: boolean;
  onPowerOn: () => void;
  onPowerOff: () => void;
}

const PowerButton: React.FC<PowerButtonProps> = ({
  isOn,
  onPowerOn,
  onPowerOff,
}) => {
  const handleCheckedChange = React.useCallback(
    (checked: boolean) => {
      if (checked) {
        onPowerOn();
      } else {
        onPowerOff();
      }
    },
    [onPowerOn, onPowerOff]
  );

  return (
    <Column>
      <VintageLED isOn={isOn} size="large" />
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
};

export default PowerButton;
