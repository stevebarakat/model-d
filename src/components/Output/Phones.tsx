// import { useSynthStore } from "@/store/synthStore";
import Row from "../Row";
import { RockerSwitch } from "../RockerSwitch";
import Knob from "../Knob";

function Phones() {
  // const { phonesVolume, setPhonesVolume, arePhonesActive, setArePhonesActive } =
  //   useSynthStore();

  // const phonesVolume = 0;
  // const arePhonesActive = false;

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
        value={0}
        logarithmic={true}
        min={0}
        max={10}
        step={0.1}
        onChange={() => {}}
        label="Volume"
      />
      <RockerSwitch
        theme="blue"
        checked={false}
        onCheckedChange={() => {
          // setArePhonesActive(checked);
        }}
        label="Phones"
        topLabel="Phones"
        bottomLabelRight="On"
      />
    </Row>
  );
}

export default Phones;
