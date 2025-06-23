import { RockerSwitch } from "../RockerSwitch";
import { useSynthStore } from "@/store/synthStore";

interface DecaySwitchProps {
  disabled?: boolean;
}

function DecaySwitch({ disabled = false }: DecaySwitchProps) {
  const decaySwitchOn = useSynthStore((state) => state.decaySwitchOn);
  const setDecaySwitchOn = useSynthStore((state) => state.setDecaySwitchOn);

  return (
    <RockerSwitch
      theme="white"
      label="Decay"
      topLabelLeft="Decay"
      topLabelRight="On"
      checked={decaySwitchOn}
      onCheckedChange={disabled ? () => {} : setDecaySwitchOn}
      disabled={disabled}
    />
  );
}

export default DecaySwitch;
