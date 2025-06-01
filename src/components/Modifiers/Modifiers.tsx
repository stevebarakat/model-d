import { LoudnessEnvelope, FilterEnvelope } from "@/components/Envelopes";
import { HorizontalRockerSwitch } from "@/components/RockerSwitch";
import SectionTitle from "@/components/SectionTitle";
import Filter from "@/components/Filter";
import styles from "./Modifiers.module.css";

function Modifiers() {
  return (
    <section>
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
        <FilterEnvelope />
        <LoudnessEnvelope />
      </div>
      <SectionTitle>Modifiers</SectionTitle>
    </section>
  );
}

export default Modifiers;
