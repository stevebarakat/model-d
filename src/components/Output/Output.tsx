import Title from "../Title";
import Section from "../Section";
import Column from "../Column";
import MainOutput from "./MainOutput";
import Tuner from "../Tuner";
import Phones from "./Phones";
import { useSynthStore } from "@/store/synthStore";

export default function Output() {
  const isDisabled = useSynthStore((s) => s.isDisabled);

  return (
    <Section className={isDisabled ? "disabled" : ""}>
      <Column
        align="flex-start"
        gap="1.5rem"
        style={{ padding: "0.5rem", paddingRight: "0.5rem" }}
      >
        <MainOutput />
        <Tuner />
        <Phones />
      </Column>
      <Title>Output</Title>
    </Section>
  );
}
