import { useSynthStore } from "@/store/synthStore";
import Knob from "../Knob";
import Overload from "../Overload";
import { useExternalInput } from "./hooks";
import Row from "../Row";
import Column from "../Column";

type ExternalInputProps = {
  audioContext: AudioContext;
  mixerNode: AudioNode;
};

function ExternalInput({ audioContext, mixerNode }: ExternalInputProps) {
  const { mixer, setMixerExternal } = useSynthStore();
  const { audioLevel } = useExternalInput(audioContext, mixerNode);

  return (
    <Column>
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
          value={mixer.external.volume}
          min={0}
          max={10}
          step={1}
          label="External Input Volume"
          onChange={(v) => setMixerExternal({ volume: v })}
          logarithmic={true}
          disabled={audioContext === null}
        />
        <Overload
          isEnabled={mixer.external.enabled}
          volume={mixer.external.volume}
          audioLevel={audioLevel}
        />
      </Row>
    </Column>
  );
}

export default ExternalInput;
