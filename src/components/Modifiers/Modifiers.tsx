import { LoudnessEnvelope, FilterEnvelope } from "@/components/Envelopes";
import Title from "@/components/Title";
import Filter from "@/components/Filter";
import Section from "../Section";
import Column from "../Column";
import ModulationSwitch from "../Filter/ModulationSwitch";
import KeyboardControl from "../Filter/KeyboardControl";

const filterSwitches: React.CSSProperties = {
  position: "absolute",
  top: "17.5%",
  left: "-1.75rem",
};

function Modifiers() {
  return (
    <Section>
      <div style={filterSwitches}>
        <ModulationSwitch />
        <KeyboardControl />
      </div>
      <Column
        style={{ paddingLeft: "1.75rem", paddingRight: "0.25rem" }}
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
        }}
      >
        <LoudnessEnvelope />
      </Column>
      <Title>Modifiers</Title>
    </Section>
  );
}

export default Modifiers;
