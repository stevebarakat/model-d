import { LoudnessEnvelope, FilterEnvelope } from "@/components/Envelopes";
import Title from "@/components/Title";
import Filter from "@/components/Filter";
import Section from "../Section";
import Column from "../Column";
import Row from "../Row";

interface ModifiersProps {
  disabled?: boolean;
}

function Modifiers({ disabled = false }: ModifiersProps) {
  return (
    <Section>
      <Column style={{ paddingLeft: "2.5rem", paddingRight: "0.5rem" }}>
        <Filter disabled={disabled} />
        <FilterEnvelope disabled={disabled} />
      </Column>
      <Row style={{ borderTop: "2px solid var(--color-white-50)" }} />
      <Column style={{ paddingLeft: "2.5rem", paddingRight: "0.5rem" }}>
        <LoudnessEnvelope disabled={disabled} />
      </Column>
      <Title>Modifiers</Title>
    </Section>
  );
}

export default Modifiers;
