import PitchBender from "../PitchBender";
import ModulationWheel from "../ModulationWheel";
import styles from "./SidePanel.module.css";
import GlideSwitch from "../Glide/GlideSwitch";
import DecaySwitch from "../DecaySwitch";
import LfoRate from "../LfoRate";
import Column from "../Column";
import Row from "../Row";
import * as Tooltip from "@radix-ui/react-tooltip";
import Screw from "../Screw/Screw";

function SidePanel() {
  return (
    <Tooltip.Provider>
      <Column className={styles.sidePanel}>
        <Row gap="var(--spacing-md)">
          <LfoRate />
          <div className={styles.switches}>
            <GlideSwitch />
            <DecaySwitch />
          </div>
        </Row>
        <Row gap="var(--spacing-xl)" justify="center">
          <PitchBender />
          <ModulationWheel />
        </Row>
        <Row
          justify="flex-end"
          gap="2.5rem"
          style={{ top: "14px", left: "4px" }}
        >
          <Screw />
          <Screw />
        </Row>
      </Column>
    </Tooltip.Provider>
  );
}

export default SidePanel;
