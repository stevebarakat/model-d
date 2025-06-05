import Knob from "../Knob";
import Spacer from "../Spacer";
import Row from "../Row";
import Title from "../Title";
import Column from "../Column";

function LoudnessEnvelope({ disabled = false }: { disabled?: boolean }) {
  return (
    <Column style={{ borderTop: "2px solid var(--color-off-white)" }}>
      <Title size="md">
        <Spacer width="24px" />
        Loudness Contour
      </Title>
      <Column>
        <Row>
          <Spacer width="13px" />
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
