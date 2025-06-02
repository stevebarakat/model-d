import Knob from "../Knob";

interface LFORateProps {
  disabled?: boolean;
}

function LFORate({ disabled = false }: LFORateProps) {
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
      onChange={disabled ? () => {} : (v) => console.log(v)}
      disabled={disabled}
    />
  );
}

export default LFORate;
