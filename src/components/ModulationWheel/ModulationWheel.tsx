import Wheel from "../Wheel";

interface ModulationWheelProps {
  disabled?: boolean;
}

function ModulationWheel({ disabled = false }: ModulationWheelProps) {
  return (
    <Wheel
      value={0}
      min={0}
      max={100}
      onChange={disabled ? () => {} : () => {}}
      onMouseUp={disabled ? () => {} : () => {}}
      label="Mod"
      disabled={disabled}
    />
  );
}

export default ModulationWheel;
