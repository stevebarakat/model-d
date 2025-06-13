import { HorizontalRockerSwitch } from "@/components/RockerSwitch";

function ModulationSwitch({ disabled }: { disabled: boolean }) {
  return (
    <div>
      <HorizontalRockerSwitch
        theme="orange"
        checked={false}
        onCheckedChange={() => {}}
        label="Filter Modulation"
        topLabel="Filter Modulation"
        bottomLabelRight="On"
        disabled={disabled}
      />
    </div>
  );
}

export default ModulationSwitch;
