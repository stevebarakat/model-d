import { useSynthStore } from "@/store/synthStore";
import Knob from "../Knob";
import Overload from "../Overload";
import styles from "./ExternalInput.module.css";
import { useExternalInput } from "./hooks";

type ExternalInputProps = {
  audioContext: AudioContext;
  mixerNode: AudioNode;
};

function ExternalInput({ audioContext, mixerNode }: ExternalInputProps) {
  const { mixer, setMixerExternal } = useSynthStore();
  const { audioLevel } = useExternalInput(audioContext, mixerNode);

  return (
    <div className={styles.externalInputContainer}>
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
          value={mixer.external.volume}
          min={0}
          max={10}
          step={1}
          label="External Input Volume"
          onChange={(v) => setMixerExternal({ volume: v })}
        />
        <Overload
          isEnabled={mixer.external.enabled}
          volume={mixer.external.volume}
          audioLevel={audioLevel}
        />
      </div>
    </div>
  );
}

export default ExternalInput;
