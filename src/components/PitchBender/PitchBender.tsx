import Wheel from "../Wheel";
import { useSynthStore } from "@/store/synthStore";

function PitchBender() {
  const pitchWheel = useSynthStore((s) => s.pitchWheel);
  const setPitchWheel = useSynthStore((s) => s.setPitchWheel);

  const handleChange = (value: number) => {
    setPitchWheel(value);
  };

  const handleMouseUp = () => {
    setPitchWheel(50); // Center position
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
    />
  );
}

export default PitchBender;
