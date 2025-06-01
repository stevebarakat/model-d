import { HorizontalRockerSwitch } from "@/components/RockerSwitch";
import styles from "../OscillatorBank.module.css";

function OscillatorMod() {
  return (
    <div className={styles.oscModulation}>
      <HorizontalRockerSwitch
        className={styles.oscModSwitch}
        theme="orange"
        checked={false}
        onCheckedChange={() => {}}
        label="Oscillator Modulation"
        topLabel="Oscillator Modulation"
        bottomLabelRight="On"
      />
    </div>
  );
}

export default OscillatorMod;
