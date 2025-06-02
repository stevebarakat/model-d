import PitchBender from "../PitchBender";
import ModulationWheel from "../ModulationWheel";
import styles from "./SidePanel.module.css";
import GlideSwitch from "../Glide/GlideSwitch";
import DecaySwitch from "../DecaySwitch";
import LfoRate from "../LfoRate";

function SidePanel() {
  return (
    <div className={styles.column}>
      <div className={styles.row}>
        <LfoRate />
        <div className={styles.switches}>
          <GlideSwitch />
          <DecaySwitch />
        </div>
      </div>
      <div className={styles.wheels}>
        <PitchBender />
        <ModulationWheel />
      </div>
    </div>
  );
}

export default SidePanel;
