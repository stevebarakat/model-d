import { LoudnessEnvelope, FilterEnvelope } from "@/components/Envelopes";
import Title from "@/components/Title";
import Filter from "@/components/Filter";
import Section from "../Section";
import Column from "../Column";
import ModulationSwitch from "../Filter/ModulationSwitch";
import KeyboardControl from "../Filter/KeyboardControl";
import styles from "./Modifiers.module.css";

function Modifiers() {
  return (
    <Section>
      <div className={styles.filterSwitches}>
        <ModulationSwitch />
        <KeyboardControl />
      </div>
      <Column
        style={{ paddingLeft: "2.25rem", paddingRight: "0.5rem" }}
        gap="var(--spacing-md)"
      >
        <Filter />
        <FilterEnvelope />
      </Column>
      <Column
        style={{
          borderTop: "2px solid var(--color-white-50)",
          paddingLeft: "1.5rem",
          paddingBottom: "var(--spacing-md)",
          width: "101%",
          // marginLeft: "-0.25rem",
        }}
      >
        <LoudnessEnvelope />
      </Column>
      <Title>Modifiers</Title>
    </Section>
  );
}

export default Modifiers;
