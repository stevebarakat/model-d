import Title from "../Title";
import Section from "../Section";
import Column from "../Column";
import MainOutput from "./MainOutput";
import Row from "../Row";
import Logo from "../Logo";

type OutputProps = {
  children?: React.ReactNode;
};

export default function Output({ children }: OutputProps) {
  return (
    <Section>
      <Column
        // gap="4.3rem"
        style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
      >
        <MainOutput />
        {children}
        <Logo />
        <Row
          style={{
            borderTop: "var(--color-white-50) solid 2px",
            width: "115%",
            padding: "var(--spacing-md) 0",
          }}
        ></Row>
      </Column>
      <Title>Output</Title>
    </Section>
  );
}
