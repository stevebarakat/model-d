import styles from "./Modifiers.module.css";
import Knob from "../Knob";
import { HorizontalRockerSwitch } from "../RockerSwitch";
import SectionTitle from "../SectionTitle";
import LoudnessContour from "../LoudnessContour";
import Spacer from "../Spacer";

function Modifiers() {
  return (
    <section className="section">
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
        <div className={styles.subSectionTitle}>Filter</div>
        <div className={styles.row}>
          <Spacer width="16px" />
          <Knob
            valueLabels={{
              0: "0",
              2: "2",
              4: "4",
              6: "6",
              8: "8",
              10: "10",
            }}
            value={0}
            min={0}
            max={10}
            step={1}
            label="Cutoff Frequency"
            onChange={() => {}}
          />
          <Knob
            valueLabels={{
              0: "0",
              2: "2",
              4: "4",
              6: "6",
              8: "8",
              10: "10",
            }}
            value={0}
            min={0}
            max={10}
            step={1}
            label="Emphasis"
            onChange={() => {}}
          />
          <Knob
            valueLabels={{
              0: "0",
              2: "2",
              4: "4",
              6: "6",
              8: "8",
              10: "10",
            }}
            value={0}
            min={0}
            max={10}
            step={1}
            label="Amount of Contour"
            onChange={() => {}}
          />
        </div>
        <div className={styles.row}>
          <Spacer width="16px" />
          <Knob
            valueLabels={{
              0: "0",
              2: "2",
              4: "4",
              6: "6",
              8: "8",
              10: "10",
            }}
            value={0}
            min={0}
            max={10}
            step={1}
            label="Attack Time"
            onChange={() => {}}
          />
          <Knob
            valueLabels={{
              0: "0",
              2: "2",
              4: "4",
              6: "6",
              8: "8",
              10: "10",
            }}
            value={0}
            min={0}
            max={10}
            step={1}
            label="Decay Time"
            onChange={() => {}}
          />
          <Knob
            valueLabels={{
              0: "0",
              2: "2",
              4: "4",
              6: "6",
              8: "8",
              10: "10",
            }}
            value={0}
            min={0}
            max={10}
            step={1}
            label="Sustain Level"
            onChange={() => {}}
          />
        </div>
        <LoudnessContour />
      </div>
      <SectionTitle>Modifiers</SectionTitle>
    </section>
  );
}

export default Modifiers;
