import Wheel from "../Wheel";

function ModulationWheel() {
  return (
    <Wheel
      value={0}
      min={0}
      max={100}
      onChange={() => {}}
      onMouseUp={() => {}}
      label="Mod"
    />
  );
}

export default ModulationWheel;
