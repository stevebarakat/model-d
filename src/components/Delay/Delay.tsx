import { useDelay } from "./hooks/useDelay";
import { useSynthStore } from "@/store/synthStore";
import { RockerSwitch } from "../RockerSwitch";
import Row from "../Row";
import Knob from "../Knob";
import styles from "./Delay.module.css";

type DelayProps = {
  audioContext: AudioContext;
  inputNode: AudioNode;
  outputNode: AudioNode;
};

function Delay({ audioContext, inputNode, outputNode }: DelayProps) {
  const {
    delayEnabled,
    delayTime,
    delayFeedback,
    delayMix,
    setDelayEnabled,
    setDelayTime,
    setDelayFeedback,
    setDelayMix,
    isDisabled,
  } = useSynthStore();
  useDelay(audioContext, inputNode, outputNode);

  return (
    <div className={styles.delayContainer}>
      <div className={styles.delayTitle}>Delay Effect</div>
      <div className={styles.controls}>
        <Row justify="center" style={{ marginBottom: "8px" }}>
          <RockerSwitch
            theme="blue"
            checked={delayEnabled}
            onCheckedChange={setDelayEnabled}
            label="Delay"
            bottomLabelRight="On"
            disabled={isDisabled}
          />
        </Row>
        <div className={styles.knobRow}>
          <Knob
            valueLabels={{
              0: "0",
              2: "200",
              4: "400",
              6: "600",
              8: "800",
              10: "1000",
            }}
            value={delayTime}
            min={0}
            max={10}
            step={0.5}
            label="Time (ms)"
            onChange={setDelayTime}
            disabled={isDisabled || !delayEnabled}
          />

          <Knob
            valueLabels={{
              0: "0",
              2: "0.2",
              4: "0.4",
              6: "0.6",
              8: "0.8",
              10: "0.9",
            }}
            value={delayFeedback}
            min={0}
            max={10}
            step={0.5}
            label="Feedback"
            onChange={setDelayFeedback}
            disabled={isDisabled || !delayEnabled}
          />

          <Knob
            valueLabels={{
              0: "0",
              2: "0.2",
              4: "0.4",
              6: "0.6",
              8: "0.8",
              10: "1.0",
            }}
            value={delayMix}
            min={0}
            max={10}
            step={0.5}
            label="Mix"
            onChange={setDelayMix}
            disabled={isDisabled || !delayEnabled}
          />
        </div>
      </div>
    </div>
  );
}

export default Delay;
