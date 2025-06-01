import ModulationSwitch from "@/components/Filter/ModulationSwitch";
import KeyboardControl from "@/components/Filter/KeyboardControl";
import Knob from "../Knob";
import Spacer from "../Spacer";
import { styles } from "@/components/Modifiers";

function Filter() {
  return (
    <div className={styles.container}>
      <div className={styles.filterSwitches}>
        <ModulationSwitch />
        <KeyboardControl />
      </div>
      <div className={styles.subSectionTitle}>Filter</div>
      <div className={styles.row}>
        <Spacer width="16px" />
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
          label="Cutoff Frequency"
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
          label="Amount of Contour"
          onChange={() => {}}
        />
      </div>
    </div>
  );
}

export default Filter;
