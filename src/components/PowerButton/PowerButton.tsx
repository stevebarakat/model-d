import React from "react";
import VerticalRockerSwitch from "../RockerSwitch/VerticalRockerSwitch";

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
    <VerticalRockerSwitch
      checked={isOn}
      onCheckedChange={handleCheckedChange}
      label="Power"
      theme="orange"
      topLabel="ON"
      bottomLabel="OFF"
    />
  );
};

export default PowerButton;
