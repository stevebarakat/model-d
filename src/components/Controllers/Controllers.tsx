import { HorizontalRockerSwitch } from "../RockerSwitch";
import styles from "./Controllers.module.css";
import SectionTitle from "../SectionTitle";
import Knob from "../Knob";
import Tune from "../Tune";
import Glide from "../Glide";

function Controllers() {
  return (
    <section className="section">
      <div className={styles.column}>
        <div className={styles.row}>
          <Tune />
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
          <Glide />
          <Knob
            value={0}
            min={0}
            max={10}
            step={1}
            label="Modulation Mix"
            onChange={() => {}}
            valueLabels={{
              "0": "-7",
              "1.42": "-5",
              "2.85": "-3",
              "4.28": "-1",
              "5.71": "1",
              "7.14": "3",
              "8.57": "5",
              "10": "7",
            }}
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
