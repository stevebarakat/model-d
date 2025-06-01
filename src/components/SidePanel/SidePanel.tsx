import Wheel from "../Wheel";
import styles from "./SidePanel.module.css";
import GlideSwitch from "../Glide/GlideSwitch";
import DecaySwitch from "../DecaySwitch";
import LfoRate from "../LfoRate";
import { useState } from "react";

function ModWheels() {
  const [pitch, setPitch] = useState(0);
  const [mod, setMod] = useState(0);

  return (
    <div className={styles.wheels}>
      <Wheel
        value={pitch}
        min={0}
        max={100}
        onChange={setPitch}
        onMouseUp={() => {}}
        label="Pitch"
      />
      <Wheel
        value={mod}
        min={0}
        max={100}
        onChange={setMod}
        onMouseUp={() => {}}
        label="Mod"
      />
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
