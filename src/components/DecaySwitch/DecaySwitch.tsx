import { HorizontalRockerSwitch } from "../RockerSwitch";

interface DecaySwitchProps {
  disabled?: boolean;
}

function DecaySwitch({ disabled = false }: DecaySwitchProps) {
  return (
    <HorizontalRockerSwitch
      theme="white"
      label="Decay"
      topLabel="Decay"
      bottomLabelRight="On"
      checked={false}
      onCheckedChange={disabled ? () => {} : () => {}}
      disabled={disabled}
    />
  );
}

export default DecaySwitch;
