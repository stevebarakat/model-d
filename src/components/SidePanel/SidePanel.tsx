import PitchBender from "../PitchBender";
import ModulationWheel from "../ModulationWheel";
import styles from "./SidePanel.module.css";
import GlideSwitch from "../Glide/GlideSwitch";
import DecaySwitch from "../DecaySwitch";
import LfoRate from "../LfoRate";

interface SidePanelProps {
  disabled?: boolean;
}

function SidePanel({ disabled = false }: SidePanelProps) {
  return (
    <div className={styles.column}>
      <div className={styles.row}>
        <LfoRate disabled={disabled} />
        <div className={styles.switches}>
          <GlideSwitch disabled={disabled} />
          <DecaySwitch disabled={disabled} />
        </div>
      </div>
      <div className={styles.wheels}>
        <PitchBender disabled={disabled} />
        <ModulationWheel disabled={disabled} />
      </div>
    </div>
  );
}

export default SidePanel;
