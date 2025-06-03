import { useSynthStore } from "@/store/synthStore";
import Knob from "../Knob";
import Overload from "../Overload";
import { useExternalInput } from "./hooks";
import Row from "../Row";
import Column from "../Column";
import Flex from "../Flex";
import HorizontalRockerSwitch from "../RockerSwitch/HorizontalRockerSwitch";

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
        <Flex gap="10px">
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.external.enabled}
            onCheckedChange={(checked) =>
              setMixerExternal({ enabled: checked })
            }
            label="External Input"
            bottomLabelRight="On"
            disabled={audioContext === null}
            style={{ alignSelf: "center" }}
          />
          <Flex>
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
              title="External Input Volume"
              label="External Input Volume"
              onChange={
                audioContext === null
                  ? () => {}
                  : (v) => setMixerExternal({ volume: v })
              }
              size="medium"
              disabled={audioContext === null || !mixer.external.enabled}
            />
            <Overload
              isEnabled={mixer.external.enabled}
              volume={mixer.external.volume}
              audioLevel={audioLevel}
            />
          </Flex>
        </Flex>
      </Row>
    </Column>
  );
}

export default ExternalInput;
