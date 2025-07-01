import { RockerSwitch } from "../RockerSwitch";
import { useAudioContext } from "@/hooks/useAudioContext";

function Tuner() {
  const { isInitialized } = useAudioContext();

  return (
    <RockerSwitch
      theme="blue"
      checked={false}
      onCheckedChange={() => {}}
      label="Tuner"
      topLabel="A-440"
      bottomLabelRight="On"
      disabled={!isInitialized}
    />
  );
}

export default Tuner;
