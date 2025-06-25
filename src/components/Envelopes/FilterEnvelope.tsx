import Knob from "../Knob";
import Row from "../Row";
import { useSynthStore } from "@/store/synthStore";

function FilterEnvelope() {
  const filterAttack = useSynthStore((state) => state.filterAttack);
  const filterDecay = useSynthStore((state) => state.filterDecay);
  const filterSustain = useSynthStore((state) => state.filterSustain);
  const setFilterEnvelope = useSynthStore((state) => state.setFilterEnvelope);
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
      />
    </Row>
  );
}

export default FilterEnvelope;
