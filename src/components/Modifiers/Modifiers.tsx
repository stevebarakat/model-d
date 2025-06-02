import { LoudnessEnvelope, FilterEnvelope } from "@/components/Envelopes";
import Title from "@/components/Title";
import Filter from "@/components/Filter";
import Section from "../Section";
import Column from "../Column";

function Modifiers() {
  return (
    <Section>
      <Column>
        <Filter />
        <FilterEnvelope />
        <LoudnessEnvelope />
      </Column>
      <Title>Modifiers</Title>
    </Section>
  );
}

export default Modifiers;
