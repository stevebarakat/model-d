import Knob from "../Knob";
import Spacer from "../Spacer";
import { styles } from "@/components/Modifiers";
import Row from "../Row";
import Title from "../Title";

function LoudnessEnvelope() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <Title>Loudness Contour</Title>
      <div className={styles.container}>
        <Spacer width="24px" style={{ backgroundColor: "red" }} />
        <Row>
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
            label="Attack Time"
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
            label="Decay Time"
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
            label="Sustain Level"
            onChange={() => {}}
          />
        </Row>
      </div>
    </div>
  );
}

export default LoudnessEnvelope;
