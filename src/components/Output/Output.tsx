import Title from "../Title";
import Section from "../Section";
import Column from "../Column";
import MainOutput from "./MainOutput";
import Phones from "./Phones";

export default function Output() {
  return (
    <Section>
      <Column
        gap="4.3rem"
        style={{ padding: "0.5rem", paddingRight: "0.5rem" }}
      >
        <MainOutput />
        <Phones />
      </Column>
      <Title>Output</Title>
    </Section>
  );
}
