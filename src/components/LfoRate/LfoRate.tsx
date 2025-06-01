import Knob from "../Knob";

function LFORate() {
  return (
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
      value={0}
      min={0}
      max={10}
      step={1}
      label="LFO Rate"
      onChange={(v) => console.log(v)}
    />
  );
}

export default LFORate;
