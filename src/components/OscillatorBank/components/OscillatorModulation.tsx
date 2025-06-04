import { HorizontalRockerSwitch } from "@/components/RockerSwitch";
import styles from "../OscillatorBank.module.css";

function OscillatorModulation({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className={styles.oscModulation}>
      <HorizontalRockerSwitch
        theme="orange"
        checked={false}
        onCheckedChange={() => {}}
        label="Oscillator Modulation"
        topLabel="Oscillator Modulation"
        bottomLabelRight="On"
        disabled={disabled}
      />
    </div>
  );
}

export default OscillatorModulation;
