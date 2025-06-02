import Wheel from "../Wheel";

interface PitchBenderProps {
  disabled?: boolean;
}

function PitchBender({ disabled = false }: PitchBenderProps) {
  return (
    <Wheel
      value={0}
      min={0}
      max={100}
      onChange={disabled ? () => {} : () => {}}
      onMouseUp={disabled ? () => {} : () => {}}
      label="Pitch"
      disabled={disabled}
    />
  );
}

export default PitchBender;
