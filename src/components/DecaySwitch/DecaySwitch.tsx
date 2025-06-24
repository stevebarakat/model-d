import { RockerSwitch } from "../RockerSwitch";
import { useSynthStore } from "@/store/synthStore";

function DecaySwitch() {
  const decaySwitchOn = useSynthStore((state) => state.decaySwitchOn);
  const setDecaySwitchOn = useSynthStore((state) => state.setDecaySwitchOn);

  return (
    <RockerSwitch
      theme="white"
      label="Decay"
      topLabel="Decay"
      bottomLabelRight="On"
      checked={decaySwitchOn}
      onCheckedChange={setDecaySwitchOn}
    />
  );
}

export default DecaySwitch;
