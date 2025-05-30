import { useSynthStore } from "@/store/synthStore";
import { HorizontalRockerSwitch } from "../RockerSwitch";
import Knob from "../Knob";
import Wheel from "../Wheel";
import styles from "./SidePanel.module.css";

function ModWheels() {
  return (
    <div className={styles.modWheels}>
      <div className={styles.modWheelwell}>
        <Wheel
          value={0}
          min={0}
          max={100}
          onChange={() => {}}
          onMouseUp={() => {}}
          label="Pitch"
        />
      </div>
      <div className={styles.modWheelwell}>
        <Wheel value={0} min={0} max={100} onChange={() => {}} label="Mod" />
      </div>
    </div>
  );
}

function SidePanel() {
  const glideOn = useSynthStore((s) => s.glideOn);
  const setGlideOn = useSynthStore((s) => s.setGlideOn);

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
            label="Glide (On/Off)"
            topLabel="Glide"
            bottomLabelRight="On"
            checked={glideOn}
            onCheckedChange={setGlideOn}
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
