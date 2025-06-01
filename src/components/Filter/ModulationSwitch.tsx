import { HorizontalRockerSwitch } from "@/components/RockerSwitch";

function ModulationSwitch() {
  return (
    <div>
      <HorizontalRockerSwitch
        theme="orange"
        checked={false}
        onCheckedChange={() => {}}
        label="Filter Modulation"
        topLabel="Filter Modulation"
        bottomLabelRight="On"
      />
    </div>
  );
}

export default ModulationSwitch;
