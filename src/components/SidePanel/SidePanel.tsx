import { HorizontalRockerSwitch } from "../RockerSwitch";
import Knob from "../Knob";
import Wheel from "../Wheel";
import styles from "./SidePanel.module.css";
import GlideSwitch from "../Glide/GlideSwitch";

function ModWheels() {
  return (
    <div className={styles.wheels}>
      <Wheel
        value={0}
        min={0}
        max={100}
        onChange={() => {}}
        onMouseUp={() => {}}
        label="Pitch"
      />
      <Wheel value={0} min={0} max={100} onChange={() => {}} label="Mod" />
    </div>
  );
}

function SidePanel() {
  return (
    <div className={styles.sidePanel}>
      <div className={styles.row}>
        <Knob
          size="small"
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
          label="LFO Rate"
          onChange={(v) => console.log(v)}
        />
        <div className={styles.sideSwitches}>
          <GlideSwitch />
          <HorizontalRockerSwitch
            theme="blue"
            label="Decay"
            topLabel="Decay"
            bottomLabelRight="On"
            checked={false}
            onCheckedChange={() => {}}
          />
        </div>
      </div>
      <ModWheels />
    </div>
  );
}

export default SidePanel;
