import { useSynthStore } from "@/store/synthStore";
import Knob from "../Knob";

function Tune({ disabled = false }: { disabled?: boolean }) {
  const { masterTune, setMasterTune } = useSynthStore();

  return (
    <Knob
      value={masterTune}
      min={-2}
      max={2}
      step={0.01}
      label="Tune"
      onChange={setMasterTune}
      valueLabels={{
        "-2": "-2",
        "0": "0",
        "2": "+2",
      }}
      disabled={disabled}
    />
  );
}

export default Tune;
