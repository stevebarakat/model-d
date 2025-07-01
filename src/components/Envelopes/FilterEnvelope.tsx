import Knob from "../Knob";
import Row from "../Row";
import { useSynthStore } from "@/store/synthStore";

function FilterEnvelope() {
  const { filterAttack, filterDecay, filterSustain, isDisabled } =
    useSynthStore((state) => state);
  const { setFilterEnvelope } = useSynthStore((state) => state);

  return (
    <Row gap="var(--spacing-xl)">
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
        value={filterAttack}
        showMidTicks={false}
        min={0}
        max={10}
        step={1}
        label="Attack Time"
        onChange={(v) => setFilterEnvelope({ attack: v })}
        disabled={isDisabled}
      />
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
        value={filterDecay}
        showMidTicks={false}
        min={0}
        max={10}
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
