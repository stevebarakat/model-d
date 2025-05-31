import Knob from "../Knob";
import styles from "./LoudnessContour.module.css";
import Spacer from "../Spacer";

function LoudnessContour() {
  return (
    <div className={styles.container}>
      <div className={styles.subSectionTitle}>Loudness Contour</div>
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
      </div>
    </div>
  );
}

export default LoudnessContour;
