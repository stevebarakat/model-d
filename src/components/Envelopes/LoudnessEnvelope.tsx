import Knob from "../Knob";
import Row from "../Row";
import Title from "../Title";
import Column from "../Column";

function LoudnessEnvelope({ disabled = false }: { disabled?: boolean }) {
  return (
    <Column>
      <Title disabled={disabled} size="md">
        Loudness Contour
      </Title>
      <Column>
        <Row>
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
            label="Attack Time"
            onChange={() => {}}
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
          />
        </Row>
      </Column>
    </Column>
  );
}

export default LoudnessEnvelope;
