import { useSynthStore } from "@/store/synthStore";
import { RockerSwitch } from "../RockerSwitches";

interface GlideSwitchProps {
  disabled?: boolean;
}

function GlideSwitch({ disabled = false }: GlideSwitchProps) {
  const glideOn = useSynthStore((s) => s.glideOn);
  const setGlideOn = useSynthStore((s) => s.setGlideOn);
  return (
    <RockerSwitch
      theme="white"
      label="Glide (On/Off)"
      topLabel="Glide"
      bottomLabelRight="On"
      checked={glideOn}
      onCheckedChange={disabled ? () => {} : setGlideOn}
      disabled={disabled}
    />
  );
}

export default GlideSwitch;
