import Section from "../Section";
import Column from "../Column";
import Row from "../Row";
import PowerButton from "../PowerButton";

function Power() {
  return (
    <Section>
      <Column
        gap="var(--spacing-xl)"
        style={{ paddingLeft: "0.5rem", paddingRight: "0.5rem" }}
      >
        <Row gap="var(--spacing-md)">
          <PowerButton isOn={true} onPowerOn={() => {}} onPowerOff={() => {}} />
        </Row>
      </Column>
    </Section>
  );
}

export default Power;
