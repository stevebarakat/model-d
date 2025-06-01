import { HorizontalRockerSwitch } from "../RockerSwitch";

function DecaySwitch() {
  return (
    <HorizontalRockerSwitch
      theme="white"
      label="Decay"
      topLabel="Decay"
      bottomLabelRight="On"
      checked={false}
      onCheckedChange={() => {}}
    />
  );
}

export default DecaySwitch;
