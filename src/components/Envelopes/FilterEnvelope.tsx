import Knob from "../Knob";
import Spacer from "../Spacer";
import Row from "../Row";
import Title from "../Title";
import Section from "../Section";

function FilterEnvelope() {
  return (
    <Section>
      <Title size="sm">Filter Contour</Title>
      <Row>
        <Spacer width="16px" />
        <Knob
          valueLabels={{
            0: "m-sec.",
            1: "10",
            2: "200",
            3: "",
            4: "600",
            5: "",
            6: "1",
            7: "",
            8: "5",
            9: "10",
            10: "sec.",
          }}
          value={0}
          min={0}
          max={10}
          step={1}
          label="Attack Time"
          onChange={() => {}}
        />
        <Knob
          valueLabels={{
            0: "0",
            2: "2",
            4: "4",
            6: "6",
            8: "8",
            10: "10",
          }}
          value={0}
          min={0}
          max={10}
          step={1}
          label="Decay Time"
          onChange={() => {}}
        />
        <Knob
          valueLabels={{
            0: "0",
            2: "2",
            4: "4",
            6: "6",
            8: "8",
            10: "10",
          }}
          value={0}
          min={0}
          max={10}
          step={1}
          label="Sustain Level"
          onChange={() => {}}
        />
      </Row>
    </Section>
  );
}

export default FilterEnvelope;
