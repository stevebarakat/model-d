import Knob from "../Knob";
import { useSynthStore } from "@/store/synthStore";

interface LFORateProps {
  disabled?: boolean;
}

function LFORate({ disabled = false }: LFORateProps) {
  const lfoRate = useSynthStore((state) => state.lfoRate);
  const setLfoRate = useSynthStore((state) => state.setLfoRate);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Knob
        size="small"
        valueLabels={{
          0: "0",
          2: "2",
          4: "4",
          6: "6",
          8: "8",
          10: "10",
        }}
        value={lfoRate}
        min={0}
        max={10}
        step={1}
        label="LFO Rate"
        onChange={disabled ? () => {} : setLfoRate}
        disabled={disabled}
      />
    </div>
  );
}

export default LFORate;
