import { useSynthStore } from "@/store/synthStore";
import { HorizontalRockerSwitch } from "../RockerSwitch";
import Knob from "../Knob";
import Wheel from "../Wheel";
import styles from "./SidePanel.module.css";

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
  const glideOn = useSynthStore((s) => s.glideOn);
  const setGlideOn = useSynthStore((s) => s.setGlideOn);

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
