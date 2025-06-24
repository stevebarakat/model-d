import { RockerSwitch } from "@/components/RockerSwitch";
import { useSynthStore } from "@/store/synthStore";

const style: React.CSSProperties = {
  position: "absolute",
  top: "22.5%",
  left: "-1.5rem",
};

function OscillatorModulation() {
  const oscillatorModulationOn = useSynthStore(
    (state) => state.oscillatorModulationOn
  );
  const setOscillatorModulationOn = useSynthStore(
    (state) => state.setOscillatorModulationOn
  );
  return (
    <div style={style}>
      <RockerSwitch
        theme="orange"
        checked={oscillatorModulationOn}
        onCheckedChange={setOscillatorModulationOn}
        label="Oscillator Modulation"
        topLabel="Oscillator Modulation"
        bottomLabelRight="On"
      />
    </div>
  );
}

export default OscillatorModulation;
