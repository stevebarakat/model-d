import Knob from "../Knob";
import Row from "../Row";
import Title from "../Title";
import Column from "../Column";
import { useSynthStore } from "@/store/synthStore";

function LoudnessEnvelope() {
  const {
    loudnessAttack,
    loudnessDecay,
    loudnessSustain,
    isDisabled,
    setLoudnessEnvelope,
  } = useSynthStore();

  return (
    <Column
      style={{ paddingRight: "0.75rem", paddingTop: "var(--spacing-sm)" }}
    >
      <Title size="md">Loudness Contour</Title>
      <Column>
        <Row gap="var(--spacing-xl)">
          <Knob
            type="millisecond"
            valueLabels={{
              0: "m-sec.",
              1000: "10",
              2000: "200",
              3000: "",
              4000: "600",
              5000: "",
              6000: "1",
              7000: "",
              8000: "5",
              9000: "10",
              10000: "sec.",
            }}
            value={loudnessAttack}
            showMidTicks={false}
            min={0}
            max={10000}
            step={1}
            label="Attack Time"
            onChange={(value) => setLoudnessEnvelope({ attack: value })}
            disabled={isDisabled}
          />
          {loudnessAttack}
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
              10000: "sec.",
            }}
            value={loudnessDecay}
            showMidTicks={false}
            min={0}
            max={10000}
            step={1}
            label="Decay Time"
            onChange={(value) => setLoudnessEnvelope({ decay: value })}
            disabled={isDisabled}
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
            value={loudnessSustain}
            min={0}
            max={10}
            step={1}
            label="Sustain Level"
            onChange={(value) => setLoudnessEnvelope({ sustain: value })}
            disabled={isDisabled}
          />
        </Row>
      </Column>
    </Column>
  );
}

export default LoudnessEnvelope;
