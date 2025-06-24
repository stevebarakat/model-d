import Knob from "../Knob";
import Row from "../Row";
import Title from "../Title";
import { useSynthStore } from "@/store/synthStore";

function Filter() {
  const filterCutoff = useSynthStore((state) => state.filterCutoff);
  const filterEmphasis = useSynthStore((state) => state.filterEmphasis);
  const setFilterCutoff = useSynthStore((state) => state.setFilterCutoff);
  const setFilterEmphasis = useSynthStore((state) => state.setFilterEmphasis);
  const filterContourAmount = useSynthStore(
    (state) => state.filterContourAmount
  );
  const setFilterContourAmount = useSynthStore(
    (state) => state.setFilterContourAmount
  );
  return (
    <div>
      <Title size="md">Filter</Title>
      <Row gap="var(--spacing-lg)">
        <Knob
          valueLabels={{
            0: "-4",
            2.5: "-2",
            5: "0",
            7.5: "2",
            10: "4",
          }}
          value={filterCutoff}
          min={0}
          max={10}
          step={0.5}
          label="Cutoff Frequency"
          onChange={setFilterCutoff}
          logarithmic={true}
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
          value={filterEmphasis}
          min={0}
          max={10}
          step={1}
          label="Emphasis"
          onChange={setFilterEmphasis}
          logarithmic={true}
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
          value={filterContourAmount}
          min={0}
          max={10}
          step={1}
          title={
            <span>
              Amount
              <br />
              of Contour
            </span>
          }
          label="Amount of Contour"
          onChange={setFilterContourAmount}
        />
      </Row>
    </div>
  );
}

export default Filter;
