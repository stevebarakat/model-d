import PitchBender from "../PitchBender";
import ModulationWheel from "../ModulationWheel";
import styles from "./SidePanel.module.css";
import GlideSwitch from "../Glide/GlideSwitch";
import DecaySwitch from "../DecaySwitch";
import LfoRate from "../LfoRate";
import Column from "../Column";
import Row from "../Row";

interface SidePanelProps {
  disabled?: boolean;
}

function SidePanel({ disabled = false }: SidePanelProps) {
  return (
    <Column justify="flex-end">
      <Row gap="var(--spacing-md)">
        <LfoRate disabled={disabled} />
        <div className={styles.switches}>
          <GlideSwitch disabled={disabled} />
          <DecaySwitch disabled={disabled} />
        </div>
      </Row>
      <Row gap="var(--spacing-xl)" justify="center">
        <PitchBender disabled={disabled} />
        <ModulationWheel disabled={disabled} />
      </Row>
    </Column>
  );
}

export default SidePanel;
