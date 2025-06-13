import Section from "../Section";
import Column from "../Column";
import Row from "../Row";

function Power({ children }: { children: React.ReactNode }) {
  return (
    <Section>
      <Column
        gap="var(--spacing-xl)"
        style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
      >
        <Row gap="var(--spacing-md)">{children}</Row>
      </Column>
    </Section>
  );
}

export default Power;
