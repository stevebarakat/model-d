import { RockerSwitch } from "../RockerSwitch";
import { useSynthStore } from "@/store/synthStore";

type DecaySwitchProps = {
  disabled?: boolean;
};

function DecaySwitch({ disabled = false }: DecaySwitchProps) {
  const decaySwitchOn = useSynthStore((state) => state.decaySwitchOn);
  const setDecaySwitchOn = useSynthStore((state) => state.setDecaySwitchOn);

  return (
    <RockerSwitch
      theme="white"
      label="Decay"
      topLabel="Decay"
      bottomLabelRight="On"
      checked={decaySwitchOn}
      onCheckedChange={disabled ? () => {} : setDecaySwitchOn}
      disabled={disabled}
    />
  );
}

export default DecaySwitch;
