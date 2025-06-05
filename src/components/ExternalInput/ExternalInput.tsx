import { useSynthStore } from "@/store/synthStore";
import Knob from "../Knob";
import LedIndicator from "../LedIndicator";
import { useExternalInput } from "./hooks";
import Row from "../Row";
import HorizontalRockerSwitch from "../RockerSwitch/HorizontalRockerSwitch";

type ExternalInputProps = {
  audioContext: AudioContext;
  mixerNode: AudioNode;
};

function ExternalInput({ audioContext, mixerNode }: ExternalInputProps) {
  const { mixer, setMixerExternal } = useSynthStore();
  const { audioLevel } = useExternalInput(audioContext, mixerNode);

  return (
    <Row>
      <HorizontalRockerSwitch
        theme="blue"
        checked={mixer.external.enabled}
        onCheckedChange={(checked) => setMixerExternal({ enabled: checked })}
        label="External Input"
        bottomLabelRight="On"
        disabled={audioContext === null}
        style={{
          position: "absolute",
          left: "-72px",
        }}
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
        value={mixer.external.volume}
        min={0}
        max={10}
        step={1}
        label="External Input Volume"
        title={
          <span>
            External
            <br />
            Input Volume
          </span>
        }
        onChange={(v) => setMixerExternal({ volume: v })}
        logarithmic={true}
        disabled={audioContext === null}
      />
      <LedIndicator
        label="Signal"
        isEnabled={mixer.external.enabled}
        volume={mixer.external.volume}
        audioLevel={audioLevel}
        disabled={audioContext === null}
      />
    </Row>
  );
}

export default ExternalInput;
