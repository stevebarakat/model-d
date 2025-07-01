import { RockerSwitch } from "../RockerSwitch";
import { useSynthStore } from "@/store/synthStore";

function Limiter() {
  const isDisabled = useSynthStore((state) => state.isDisabled);

  return (
    <RockerSwitch
      theme="blue"
      checked={false}
      onCheckedChange={() => {}}
      label="Limiter"
      topLabel="Limiter"
      bottomLabelRight="On"
      disabled={isDisabled}
    />
  );
}

export default Limiter;
