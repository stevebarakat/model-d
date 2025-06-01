import Wheel from "../Wheel";
import styles from "./SidePanel.module.css";
import GlideSwitch from "../Glide/GlideSwitch";
import DecaySwitch from "../DecaySwitch";
import LfoRate from "../LfoRate";

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
        <LfoRate />
        <div className={styles.sideSwitches}>
          <GlideSwitch />
          <DecaySwitch />
        </div>
      </div>
      <ModWheels />
    </div>
  );
}

export default SidePanel;
