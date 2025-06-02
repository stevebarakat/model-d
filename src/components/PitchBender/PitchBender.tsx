import Wheel from "../Wheel";

function PitchBender() {
  return (
    <Wheel
      value={0}
      min={0}
      max={100}
      onChange={() => {}}
      onMouseUp={() => {}}
      label="Pitch"
    />
  );
}

export default PitchBender;
