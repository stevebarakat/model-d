import Wheel from "../Wheel";
import { useSynthStore } from "@/store/synthStore";

interface ModulationWheelProps {
  disabled?: boolean;
}

function ModulationWheel({ disabled = false }: ModulationWheelProps) {
  const modWheel = useSynthStore((state) => state.modWheel);
  const setModWheel = useSynthStore((state) => state.setModWheel);
  return (
    <Wheel
      value={modWheel}
      min={0}
      max={100}
      onChange={setModWheel}
      onMouseUp={disabled ? () => {} : undefined}
      label="Mod"
      disabled={disabled}
    />
  );
}

export default ModulationWheel;
