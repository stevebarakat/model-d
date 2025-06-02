import { useSynthStore } from "@/store/synthStore";
import Knob from "../Knob";

interface GlideProps {
  disabled?: boolean;
}

function Glide({ disabled = false }: GlideProps) {
  const glideTime = useSynthStore((s) => s.glideTime);
  const setGlideTime = useSynthStore((s) => s.setGlideTime);
  return (
    <Knob
      value={glideTime}
      min={0}
      max={10}
      step={0.01}
      label="Glide Time"
      onChange={disabled ? () => {} : setGlideTime}
      valueLabels={{
        "0": "0",
        "2": "2",
        "4": "4",
        "6": "6",
        "8": "8",
        "10": "10",
      }}
      disabled={disabled}
    />
  );
}

export default Glide;
