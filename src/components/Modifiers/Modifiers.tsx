import styles from "./Modifiers.module.css";
import Knob from "../Knob";
import HorizontalRockerSwitch from "../HorizontalRockerSwitch";
import SectionTitle from "../SectionTitle";

function Modifiers() {
  return (
    <section className={styles.section}>
      <div className={styles.column}>
        <div className={styles.modSwitches}>
          <div className={styles.flexRow}>
            <span>&nbsp;</span>
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
            <span>1</span>
            <HorizontalRockerSwitch
              theme="orange"
              checked={false}
              onCheckedChange={() => {}}
              label="Keyboard Control"
              topLabelRight="On"
            />
          </div>
          <div className={styles.flexRow}>
            <span>2</span>
            <HorizontalRockerSwitch
              theme="orange"
              checked={false}
              onCheckedChange={() => {}}
              label="Keyboard Control"
              topLabel="Keyboard Control"
              bottomLabelRight="On"
            />
          </div>
        </div>
        <div className={styles.sectionTitle}>Filter</div>
        <div className={styles.row}>
          <Knob
            size="medium"
            value={0}
            min={0}
            max={10}
            step={1}
            label="Cutoff Frequency"
            onChange={() => {}}
          />
          <Knob
            size="medium"
            value={0}
            min={0}
            max={10}
            step={1}
            label="Emphasis"
            onChange={() => {}}
          />
          <Knob
            size="medium"
            value={0}
            min={0}
            max={10}
            step={1}
            label="Amount of Contour"
            onChange={() => {}}
          />
        </div>
        <div className={styles.row}>
          <Knob
            size="medium"
            value={0}
            min={0}
            max={10}
            step={1}
            label="Attack Time"
            onChange={() => {}}
          />
          <Knob
            size="medium"
            value={0}
            min={0}
            max={10}
            step={1}
            label="Decay Time"
            onChange={() => {}}
          />
          <Knob
            size="medium"
            value={0}
            min={0}
            max={10}
            step={1}
            label="Sustain Level"
            onChange={() => {}}
          />
        </div>
        <div className={styles.sectionTitle}>Loudness Contour</div>
        <div className={styles.row}>
          <Knob
            size="medium"
            value={0}
            min={0}
            max={10}
            step={1}
            label="Attack Time"
            onChange={() => {}}
          />
          <Knob
            size="medium"
            value={0}
            min={0}
            max={10}
            step={1}
            label="Decay Time"
            onChange={() => {}}
          />
          <Knob
            size="medium"
            value={0}
            min={0}
            max={10}
            step={1}
            label="Sustain Level"
            onChange={() => {}}
          />
        </div>
      </div>
      <SectionTitle>Modifiers</SectionTitle>
    </section>
  );
}

export default Modifiers;
