import Title from "../Title";
import Section from "../Section";
import Column from "../Column";
import MainOutput from "./MainOutput";
import Limiter from "../Limiter";
import Phones from "./Phones";

export default function Output() {
  return (
    <Section>
      <Column
        align="flex-start"
        gap="1.5rem"
        style={{ padding: "0.5rem", paddingRight: "0.5rem" }}
      >
        <MainOutput />
        <Limiter />
        <Phones />
      </Column>
      <Title>Output</Title>
    </Section>
  );
}
