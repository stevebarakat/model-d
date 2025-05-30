import { HorizontalRockerSwitch } from "../RockerSwitch";
import styles from "./Controllers.module.css";
import Knob from "../Knob";
import SectionTitle from "../SectionTitle";
import { useSynthStore } from "@/store/synthStore";

function Controllers() {
  const glideTime = useSynthStore((s) => s.glideTime);
  const setGlideTime = useSynthStore((s) => s.setGlideTime);

  return (
    <section className={styles.section}>
      <div className={styles.column}>
        <div className={styles.row}>
          <Knob
            size="medium"
            value={0}
            min={0}
            max={10}
            step={1}
            label="Tune"
            onChange={() => {}}
          />
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
        <div className={styles.row}>
          <Knob
            size="medium"
            value={glideTime}
            min={0}
            max={1}
            step={0.01}
            label="Glide Time"
            onChange={setGlideTime}
          />
          <Knob
            size="medium"
            value={0}
            min={0}
            max={10}
            step={1}
            label="Modulation Mix"
            onChange={() => {}}
          />
        </div>
        <div className={styles.row}>
          <HorizontalRockerSwitch
            theme="blue"
            checked={false}
            onCheckedChange={() => {}}
            label="Send to mod 1"
            bottomLabelLeft="Osc. 3"
            bottomLabelRight="Filter Eg"
          />
          <HorizontalRockerSwitch
            theme="blue"
            checked={false}
            onCheckedChange={() => {}}
            label="Send to mod 2"
            bottomLabelLeft="Noise"
            bottomLabelRight="LFO"
          />
        </div>
      </div>
      <SectionTitle>Controllers</SectionTitle>
    </section>
  );
}

export default Controllers;
