import { LoudnessEnvelope, FilterEnvelope } from "@/components/Envelopes";
import Title from "@/components/Title";
import Filter from "@/components/Filter";
import Section from "../Section";
import Column from "../Column";
import Row from "../Row";
import ModulationSwitch from "../Filter/ModulationSwitch";
import KeyboardControl from "../Filter/KeyboardControl";

interface ModifiersProps {
  disabled?: boolean;
}

const style: React.CSSProperties = {
  position: "absolute",
  top: "20%",
  left: "-1.75rem",
};

function Modifiers({ disabled = false }: ModifiersProps) {
  return (
    <Section>
      <Column
        style={{ paddingLeft: "1.75rem", paddingRight: "0.25rem" }}
        gap="var(--spacing-md)"
      >
        <div style={style}>
          <ModulationSwitch disabled={disabled} />
          <KeyboardControl disabled={disabled} />
        </div>
        <Filter disabled={disabled} />
        <FilterEnvelope disabled={disabled} />
      </Column>
      <Column
        style={{
          borderTop: "2px solid var(--color-white-50)",
          paddingLeft: "1.75rem",
          width: "102%",
          marginLeft: "-0.25rem",
          paddingBottom: "var(--spacing-md)",
        }}
      >
        <LoudnessEnvelope disabled={disabled} />
      </Column>
      <Title>Modifiers</Title>
    </Section>
  );
}

export default Modifiers;
