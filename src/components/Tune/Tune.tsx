import Knob from "../Knob";

function Tune() {
  return (
    <Knob
      value={0}
      min={0}
      max={10}
      step={1}
      label="Tune"
      onChange={(value) => {
        console.log(value);
      }}
      valueLabels={{
        "0": "-2",
        "2.5": "-1",
        "5": "0",
        "7.5": "1",
        "10": "2",
      }}
    />
  );
}

export default Tune;
