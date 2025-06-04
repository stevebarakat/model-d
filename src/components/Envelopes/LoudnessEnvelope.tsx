import Knob from "../Knob";
import Spacer from "../Spacer";
import { styles } from "@/components/Modifiers";
import Row from "../Row";
import Title from "../Title";
import FlexY from "../FlexY";

function LoudnessEnvelope({ disabled = false }: { disabled?: boolean }) {
  return (
    <FlexY>
      <Title size="md">
        <Spacer width="24px" />
        Loudness Contour
      </Title>
      <div className={styles.container}>
        <Row>
          <Spacer width="13px" />
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
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
          />
        </Row>
      </div>
    </FlexY>
  );
}

export default LoudnessEnvelope;
