import Knob from "../Knob";
import Row from "../Row";
import { useSynthStore } from "@/store/synthStore";
import { valueToKnobPos } from "../Knob/utils/attackDecayMapping";

function FilterEnvelope() {
  const {
    filterAttack,
    filterDecay,
    filterSustain,
    isDisabled,
    setFilterEnvelope,
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
    <Row gap="var(--spacing-xl)">
      <Knob
        type="attackDecay"
        valueLabels={attackDecayValueLabels}
        value={filterAttack}
        showMidTicks={false}
        min={0}
        max={10000}
        step={1}
        label="Attack Time"
        onChange={(v) => setFilterEnvelope({ attack: v })}
        disabled={isDisabled}
      />
      <Knob
        type="attackDecay"
        valueLabels={attackDecayValueLabels}
        value={filterDecay}
        showMidTicks={false}
        min={0}
        max={10000}
        step={1}
        label="Decay Time"
        onChange={(v) => setFilterEnvelope({ decay: v })}
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
        value={filterSustain}
        min={0}
        max={10}
        step={1}
        label="Sustain Level"
        onChange={(v) => setFilterEnvelope({ sustain: v })}
        disabled={isDisabled}
      />
    </Row>
  );
}

export default FilterEnvelope;
