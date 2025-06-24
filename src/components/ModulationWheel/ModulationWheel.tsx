import Wheel from "../Wheel";
import { useSynthStore } from "@/store/synthStore";

function ModulationWheel() {
  const modWheel = useSynthStore((state) => state.modWheel);
  const setModWheel = useSynthStore((state) => state.setModWheel);
  return (
    <Wheel
      value={modWheel}
      min={0}
      max={100}
      onChange={setModWheel}
      label="Mod"
    />
  );
}

export default ModulationWheel;
