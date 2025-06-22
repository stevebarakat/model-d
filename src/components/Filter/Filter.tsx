import Knob from "../Knob";
import Row from "../Row";
import Title from "../Title";
import { useSynthStore } from "@/store/synthStore";

type FilterProps = {
  disabled?: boolean;
};

function Filter({ disabled = false }: FilterProps) {
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
      <Title disabled={disabled} size="md">
        Filter
      </Title>
      <Row>
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
          disabled={disabled}
          onChange={setFilterCutoff}
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
          disabled={disabled}
          onChange={setFilterEmphasis}
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
          disabled={disabled}
          onChange={setFilterContourAmount}
        />
      </Row>
    </div>
  );
}

export default Filter;
