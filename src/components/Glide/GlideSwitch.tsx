import { useSynthStore } from "@/store/synthStore";
import { RockerSwitch } from "../RockerSwitch";

function GlideSwitch() {
  const glideOn = useSynthStore((s) => s.glideOn);
  const setGlideOn = useSynthStore((s) => s.setGlideOn);
  return (
    <RockerSwitch
      theme="white"
      label="Glide (On/Off)"
      topLabel="Glide"
      bottomLabelRight="On"
      checked={glideOn}
      onCheckedChange={setGlideOn}
    />
  );
}

export default GlideSwitch;
