import { HorizontalRockerSwitch } from "@/components/RockerSwitches";
import styles from "../OscillatorBank.module.css";
import { useSynthStore } from "@/store/synthStore";

function OscillatorModulation({ disabled = false }: { disabled?: boolean }) {
  const oscillatorModulationOn = useSynthStore(
    (state) => state.oscillatorModulationOn
  );
  const setOscillatorModulationOn = useSynthStore(
    (state) => state.setOscillatorModulationOn
  );
  return (
    <div className={styles.oscModulation}>
      <HorizontalRockerSwitch
        theme="orange"
        checked={oscillatorModulationOn}
        onCheckedChange={setOscillatorModulationOn}
        label="Oscillator Modulation"
        topLabel="Oscillator Modulation"
        bottomLabelRight="On"
        disabled={disabled}
      />
    </div>
  );
}

export default OscillatorModulation;
