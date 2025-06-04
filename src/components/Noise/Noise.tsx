import { useNoise } from "./hooks/useNoise";
import { useSynthStore } from "@/store/synthStore";
import { HorizontalRockerSwitch, VerticalRockerSwitch } from "../RockerSwitch";
import Column from "../Column";
import Row from "../Row";
import Knob from "../Knob";
import Flex from "../Flex";

type NoiseProps = {
  audioContext: AudioContext;
  mixerNode: AudioNode;
};

function Noise({ audioContext, mixerNode }: NoiseProps) {
  const { mixer, setMixerNoise } = useSynthStore();
  useNoise(audioContext, mixerNode);

  return (
    <Column>
      <Row>
        <Flex>
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.noise.enabled}
            onCheckedChange={(checked) => setMixerNoise({ enabled: checked })}
            label="Noise"
            bottomLabelRight="On"
            disabled={audioContext === null}
            style={{
              position: "absolute",
              left: "-72px",
            }}
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
              value={mixer.noise.volume}
              min={0}
              max={10}
              step={1}
              label="Noise Volume"
              onChange={(v) => setMixerNoise({ volume: v })}
              logarithmic={true}
              disabled={audioContext === null}
            />
            <VerticalRockerSwitch
              theme="blue"
              checked={mixer.noise.noiseType === "white"}
              onCheckedChange={(checked) =>
                setMixerNoise({ noiseType: checked ? "white" : "pink" })
              }
              label="Noise Type"
              topLabel="White"
              bottomLabel="Pink"
              disabled={audioContext === null}
            />
          </Flex>
        </Flex>
      </Row>
    </Column>
  );
}

export default Noise;
