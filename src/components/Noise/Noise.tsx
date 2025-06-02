import { useNoise } from "./hooks/useNoise";
import { useSynthStore } from "@/store/synthStore";
import { VerticalRockerSwitch } from "../RockerSwitch";
import Column from "../Column";
import Row from "../Row";
import Knob from "../Knob";

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
        />
        <VerticalRockerSwitch
          checked={mixer.noise.noiseType === "pink"}
          onCheckedChange={(checked) =>
            setMixerNoise({ noiseType: checked ? "pink" : "white" })
          }
          label={mixer.noise.noiseType === "pink" ? "Pink" : "White"}
          theme="blue"
        />
      </Row>
    </Column>
  );
}

export default Noise;
