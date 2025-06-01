import { useSynthStore } from "@/store/synthStore";
import Knob from "../Knob";

function Tune() {
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
    />
  );
}

export default Tune;
