import { useSynthStore } from "@/store/synthStore";
import Row from "../Row";
import { RockerSwitch } from "../RockerSwitch";
import Knob from "../Knob";

function MainOutput() {
  const { masterVolume, setMasterVolume, isMasterActive, setIsMasterActive } =
    useSynthStore();
  return (
    <Row gap="var(--spacing-md)" style={{ padding: "var(--spacing-md) 0" }}>
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
        logarithmic={true}
        min={0}
        max={10}
        step={0.1}
        onChange={setMasterVolume}
        label="Volume"
      />
      <RockerSwitch
        theme="blue"
        checked={isMasterActive}
        onCheckedChange={(checked) => {
          setIsMasterActive(checked);
        }}
        label="Main Output"
        topLabel="Main&nbsp;Output"
        bottomLabelRight="On"
      />
    </Row>
  );
}

export default MainOutput;
