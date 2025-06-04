import ModulationSwitch from "@/components/Filter/ModulationSwitch";
import KeyboardControl from "@/components/Filter/KeyboardControl";
import Knob from "../Knob";
import Spacer from "../Spacer";
import { styles } from "@/components/Modifiers";
import Row from "../Row";
import Title from "../Title";

function Filter({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className={styles.container}>
      <div className={styles.filterSwitches}>
        <ModulationSwitch />
        <KeyboardControl />
      </div>
      <Title size="md">
        <Spacer width="28px" />
        Filter
      </Title>
      <Row>
        <Spacer width="16px" />
        <Knob
          valueLabels={{
            0: "-4",
            2.5: "-2",
            5: "0",
            7.5: "2",
            10: "4",
          }}
          value={0}
          min={0}
          max={10}
          step={0.5}
          label="Cutoff Frequency"
          disabled={disabled}
          onChange={() => {}}
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
          label="Emphasis"
          disabled={disabled}
          onChange={() => {}}
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
          title={
            <span>
              Amount
              <br />
              of Contour
            </span>
          }
          label="Amount of Contour"
          disabled={disabled}
          onChange={() => {}}
        />
      </Row>
    </div>
  );
}

export default Filter;
