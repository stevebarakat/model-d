import Knob from "../Knob";
import HorizontalRockerSwitch from "../RockerSwitch/HorizontalRockerSwitch";
import Title from "../Title";
import styles from "./Output.module.css";

function Output() {
  return (
    <section>
      <div className={styles.column}>
        <div className={styles.row}>
          <Knob
            value={0}
            min={0}
            max={10}
            step={1}
            onChange={(v) => console.log(v)}
            label="Volume"
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
