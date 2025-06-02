import Knob from "../Knob";
import HorizontalRockerSwitch from "../RockerSwitch/HorizontalRockerSwitch";
import Title from "../Title";
import styles from "./Output.module.css";
import { useSynthStore } from "@/store/synthStore";

function Output() {
  const { masterVolume, setMasterVolume } = useSynthStore();
  return (
    <section>
      <div className={styles.column}>
        <div className={styles.row}>
          <Knob
            value={masterVolume}
            min={0}
            max={10}
            step={0.1}
            onChange={setMasterVolume}
            label="Master Volume"
          />
          <HorizontalRockerSwitch
            checked={false}
            onCheckedChange={() => {}}
            label="Mute"
            bottomLabelRight="On"
          />
        </div>
      </div>
      <Title>Output</Title>
    </section>
  );
}

export default Output;
