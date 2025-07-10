import Knob from "../Knob";
import Row from "../Row";
import { useSynthStore } from "@/store/synthStore";
import { attackDecayValueLabels } from "./constants";

function FilterEnvelope() {
  const {
    filterAttack,
    filterDecay,
    filterSustain,
    isDisabled,
    setFilterEnvelope,
  } = useSynthStore();

  return (
    <Row gap="var(--spacing-xl)">
      <Knob
        type="attackDecay"
        valueLabels={attackDecayValueLabels}
        value={filterAttack}
        showMidTicks={false}
        min={0}
        max={10000}
        step={10}
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
        step={10}
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
