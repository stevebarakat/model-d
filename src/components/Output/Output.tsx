import Title from "../Title";
import Section from "../Section";
import Column from "../Column";
import MainOutput from "./MainOutput";
import Tuner from "../Tuner";
import AuxOut from "./AuxOut";

function Output() {
  return (
    <Section>
      <Column
        align="flex-start"
        gap="1.5rem"
        style={{ padding: "0.5rem", paddingRight: "0.5rem" }}
      >
        <MainOutput />
        <Tuner />
        <AuxOut />
      </Column>
      <Title>Output</Title>
    </Section>
  );
}

export default Output;
