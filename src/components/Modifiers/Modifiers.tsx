import { LoudnessEnvelope, FilterEnvelope } from "@/components/Envelopes";
import Title from "@/components/Title";
import Filter from "@/components/Filter";
import Section from "../Section";
import Column from "../Column";

interface ModifiersProps {
  disabled?: boolean;
}

function Modifiers({ disabled = false }: ModifiersProps) {
  return (
    <Section>
      <Column>
        <Filter disabled={disabled} />
        <FilterEnvelope disabled={disabled} />
        <LoudnessEnvelope disabled={disabled} />
      </Column>
      <Title>Modifiers</Title>
    </Section>
  );
}

export default Modifiers;
