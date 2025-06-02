import Knob from "../Knob";
import HorizontalRockerSwitch from "../RockerSwitch/HorizontalRockerSwitch";
import Title from "../Title";
import styles from "./Output.module.css";
import { useSynthStore } from "@/store/synthStore";

interface OutputProps {
  disabled?: boolean;
}

function Output({ disabled = false }: OutputProps) {
  const { masterVolume, setMasterVolume, isMasterActive, setIsMasterActive } =
    useSynthStore();
  return (
    <section>
      <div className={styles.column}>
        <div className={styles.row}>
          <Knob
            valueLabels={{
              0: "0",
              2: "2",
              4: "4",
              6: "6",
              8: "8",
              10: "10",
            }}
            value={masterVolume}
            min={0}
            max={10}
            step={0.1}
            onChange={disabled ? () => {} : setMasterVolume}
            label="Volume"
            disabled={disabled}
          />
          <HorizontalRockerSwitch
            checked={isMasterActive}
            onCheckedChange={disabled ? () => {} : setIsMasterActive}
            label="Main Output"
            bottomLabelRight="On"
            disabled={disabled}
          />
        </div>
      </div>
      <Title>Output</Title>
    </section>
  );
}

export default Output;
