import HorizontalRockerSwitch from "../HorizontalRockerSwitch";
import Knob from "../Knob";
import ModWheel from "../ModWheel";
import styles from "./SidePanel.module.css";

function ModWheels() {
  return (
    <div className={styles.modWheels}>
      <div className={styles.modWheelwell}>
        <ModWheel
          value={0}
          min={0}
          max={100}
          onChange={() => {}}
          onMouseUp={() => {}}
          label="Pitch"
        />
      </div>
      <div className={styles.modWheelwell}>
        <ModWheel value={0} min={0} max={100} onChange={() => {}} label="Mod" />
      </div>
    </div>
  );
}

function SidePanel() {
  return (
    <div className={styles.sidePanel}>
      <div className={styles.row}>
        <Knob
          size="small"
          value={0}
          min={0}
          max={100}
          onChange={() => {}}
          label="LFO Rate"
        />
        <div className={styles.sideSwitches}>
          <HorizontalRockerSwitch
            theme="blue"
            label="Glide"
            topLabel="Glide"
            bottomLabelRight="On"
            checked={false}
            onCheckedChange={() => {}}
          />
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
