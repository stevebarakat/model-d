import Knob from "../Knob";
import { useSynthStore } from "@/store/synthStore";

type ModulationMixProps = {
  disabled?: boolean;
};

function ModulationMix({ disabled = false }: ModulationMixProps) {
  const modMix = useSynthStore((s) => s.modMix);
  const setModMix = useSynthStore((s) => s.setModMix);

  return (
    <Knob
      value={modMix}
      min={0}
      max={10}
      step={1}
      label="Modulation Mix"
      onChange={disabled ? () => {} : setModMix}
      valueLabels={{
        "0": (
          <span style={{ fontSize: "var(--font-size-xxs)" }}>
            Osc. 3/
            <br />
            Filter Eg
          </span>
        ),
        "2": "2",
        "4": "4",
        "6": "6",
        "8": "8",
        "10": (
          <span style={{ fontSize: "var(--font-size-xxs)" }}>
            Noise/
            <br />
            LFO
          </span>
        ),
      }}
      disabled={disabled}
    />
  );
}

export default ModulationMix;
