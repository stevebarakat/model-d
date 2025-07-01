import { RockerSwitch } from "../RockerSwitch";
import { useSynthStore } from "@/store/synthStore";

function Tuner() {
  const isDisabled = useSynthStore((state) => state.isDisabled);

  return (
    <RockerSwitch
      theme="blue"
      checked={false}
      onCheckedChange={() => {}}
      label="Tuner"
      topLabel="A-440"
      bottomLabelRight="On"
      disabled={isDisabled}
    />
  );
}

export default Tuner;
