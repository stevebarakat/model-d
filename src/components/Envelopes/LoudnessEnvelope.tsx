import Knob from "../Knob";
import Row from "../Row";
import Title from "../Title";
import Column from "../Column";
import { useSynthStore } from "@/store/synthStore";
import { valueToKnobPos } from "../Knob/utils/attackDecayMapping";

function LoudnessEnvelope() {
  const {
    loudnessAttack,
    loudnessDecay,
    loudnessSustain,
    isDisabled,
    setLoudnessEnvelope,
  } = useSynthStore();

  // Define label values and map to knob positions
  const attackDecayValueLabels = Object.fromEntries([
    [valueToKnobPos(1), "m-sec."],
    [valueToKnobPos(10), "10"],
    [valueToKnobPos(200), "200"],
    [valueToKnobPos(600), "600"],
    [valueToKnobPos(1000), "1"],
    [valueToKnobPos(5000), "5"],
    [valueToKnobPos(10000), "10 sec."],
  ]);

  return (
    <Column
      style={{ paddingRight: "0.75rem", paddingTop: "var(--spacing-sm)" }}
    >
      <Title size="md">Loudness Contour</Title>
      <Column>
        <Row gap="var(--spacing-xl)">
          <Knob
            type="attackDecay"
            valueLabels={attackDecayValueLabels}
            value={loudnessAttack}
            showMidTicks={true}
            min={0}
            max={10000}
            step={1}
            label="Attack Time"
            onChange={(value) => setLoudnessEnvelope({ attack: value })}
            disabled={isDisabled}
          />
          {loudnessAttack}
          <Knob
            type="attackDecay"
            valueLabels={attackDecayValueLabels}
            value={loudnessDecay}
            showMidTicks={true}
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
