import Wheel from "../Wheel";
import { useSynthStore } from "@/store/synthStore";

type PitchBenderProps = {
  disabled?: boolean;
};

function PitchBender({ disabled = false }: PitchBenderProps) {
  const pitchWheel = useSynthStore((s) => s.pitchWheel);
  const setPitchWheel = useSynthStore((s) => s.setPitchWheel);

  const handleChange = (value: number) => {
    if (!disabled) setPitchWheel(value);
  };

  const handleMouseUp = () => {
    if (!disabled) setPitchWheel(50); // Center position
  };

  return (
    <Wheel
      value={pitchWheel}
      min={0}
      max={100}
      step={0.01}
      onChange={handleChange}
      onMouseUp={handleMouseUp}
      label="Pitch"
      disabled={disabled}
    />
  );
}

export default PitchBender;
