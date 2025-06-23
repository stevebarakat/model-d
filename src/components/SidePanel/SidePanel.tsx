import PitchBender from "../PitchBender";
import ModulationWheel from "../ModulationWheel";
import styles from "./SidePanel.module.css";
import GlideSwitch from "../Glide/GlideSwitch";
import DecaySwitch from "../DecaySwitch";
import LfoRate from "../LfoRate";
import Column from "../Column";
import Row from "../Row";
import LfoWaveformSwitch from "../LfoWaveformSwitch";

interface SidePanelProps {
  disabled?: boolean;
}

function SidePanel({ disabled = false }: SidePanelProps) {
  return (
    <Column style={{ marginTop: "var(--spacing-md)" }}>
      <Row gap="var(--spacing-md)">
        <LfoRate disabled={disabled} />
        <div className={styles.switches}>
          <LfoWaveformSwitch disabled={disabled} />
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
