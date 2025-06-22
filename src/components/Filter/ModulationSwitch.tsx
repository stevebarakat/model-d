import { RockerSwitch } from "@/components/RockerSwitch";
import { useSynthStore } from "@/store/synthStore";

function ModulationSwitch({ disabled }: { disabled: boolean }) {
  const filterModulationOn = useSynthStore((state) => state.filterModulationOn);
  const setFilterModulationOn = useSynthStore(
    (state) => state.setFilterModulationOn
  );
  return (
    <div>
      <RockerSwitch
        theme="orange"
        checked={filterModulationOn}
        onCheckedChange={setFilterModulationOn}
        label="Filter Modulation"
        topLabel="Filter Modulation"
        bottomLabelRight="On"
        disabled={disabled}
      />
    </div>
  );
}

export default ModulationSwitch;
