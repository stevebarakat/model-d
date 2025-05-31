import styles from "./Modifiers.module.css";
import { HorizontalRockerSwitch } from "@/components/RockerSwitch";
import SectionTitle from "@/components/SectionTitle";
import LoudnessContour from "@/components/LoudnessContour";
import Filter from "@/components/Filter";
import FilterContour from "@/components/FilterContour";

function Modifiers() {
  return (
    <section className="section">
      <div className={styles.column}>
        <div className={styles.modSwitches}>
          <div className={styles.flexRow}>
            <HorizontalRockerSwitch
              theme="orange"
              checked={false}
              onCheckedChange={() => {}}
              label="Filter Modulation"
              topLabel="Filter Modulation"
              bottomLabelRight="On"
            />
          </div>
          <div className={styles.flexRow}>
            <HorizontalRockerSwitch
              theme="orange"
              checked={false}
              onCheckedChange={() => {}}
              label="Keyboard Control"
              leftLabel="1"
              topLabelRight="On"
            />
          </div>
          <div className={styles.flexRow}>
            <HorizontalRockerSwitch
              theme="orange"
              checked={false}
              onCheckedChange={() => {}}
              label="Keyboard Control"
              leftLabel="2"
              topLabel="Keyboard Control"
              bottomLabelRight="On"
            />
          </div>
        </div>
        <Filter />
        <FilterContour />
        <LoudnessContour />
      </div>
      <SectionTitle>Modifiers</SectionTitle>
    </section>
  );
}

export default Modifiers;
