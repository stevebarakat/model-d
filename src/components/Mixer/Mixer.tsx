import { useSynthStore } from "@/store/synthStore";
import HorizontalRockerSwitch from "../HorizontalRockerSwitch";
import VerticalRockerSwitch from "../VerticalRockerSwitch";
import Knob from "../Knob";
import SectionTitle from "../SectionTitle";
import styles from "./Mixer.module.css";
import { useExternalInput } from "./hooks/useExternalInput";
import { useAudioContext } from "@/hooks/useAudioContext";
import { Overload } from "../Overload/Overload";

function Mixer() {
  const { mixer, setMixerSource, setMixerNoise, setMixerExternal } =
    useSynthStore();
  const { audioContext, isInitialized, initialize } = useAudioContext();
  const { audioLevel } = useExternalInput(audioContext);

  const handleExternalToggle = async (checked: boolean) => {
    if (!isInitialized) {
      await initialize();
    }
    setMixerExternal({ enabled: checked });
  };

  return (
    <section className={styles.section}>
      <div className={styles.container}>
        <div className={styles.column}>
          <span className={styles.label}>Volume</span>
          <Knob
            value={mixer.osc1.volume}
            min={0}
            max={10}
            step={1}
            label=""
            onChange={(v) => setMixerSource("osc1", { volume: v })}
            size="medium"
          />
          <Knob
            value={mixer.osc2.volume}
            min={0}
            max={10}
            step={1}
            label=""
            onChange={(v) => setMixerSource("osc2", { volume: v })}
            size="medium"
          />
          <Knob
            value={mixer.osc3.volume}
            min={0}
            max={10}
            step={1}
            label=""
            onChange={(v) => setMixerSource("osc3", { volume: v })}
            size="medium"
          />
        </div>
        <div className={styles.mixerSwitches}>
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.osc1.enabled}
            onCheckedChange={(checked) =>
              setMixerSource("osc1", { enabled: checked })
            }
            label="Oscillator 1"
            bottomLabelRight="On"
          />
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.external.enabled}
            onCheckedChange={handleExternalToggle}
            label="External Input"
            bottomLabelRight="On"
          />
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.osc2.enabled}
            onCheckedChange={(checked) =>
              setMixerSource("osc2", { enabled: checked })
            }
            label="Oscillator 2"
            bottomLabelRight="On"
          />
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.noise.enabled}
            onCheckedChange={(checked) => setMixerNoise({ enabled: checked })}
            label="Noise"
            bottomLabelRight="On"
          />
          <HorizontalRockerSwitch
            theme="blue"
            checked={mixer.osc3.enabled}
            onCheckedChange={(checked) =>
              setMixerSource("osc3", { enabled: checked })
            }
            label="Oscillator 3"
            bottomLabelRight="On"
          />
        </div>
        <div className={styles.offsetColumn}>
          <div className={styles.row}>
            <Knob
              value={mixer.external.volume}
              min={0}
              max={10}
              step={1}
              label="External Input Volume"
              onChange={(v) => setMixerExternal({ volume: v })}
              size="medium"
            />
            <Overload
              isEnabled={mixer.external.enabled}
              volume={mixer.external.volume}
              audioLevel={audioLevel}
            />
          </div>
          <div className={styles.row}>
            <Knob
              value={mixer.noise.volume}
              min={0}
              max={10}
              step={1}
              label="Noise Volume"
              onChange={(v) => setMixerNoise({ volume: v })}
              size="medium"
            />
            <VerticalRockerSwitch
              checked={mixer.noise.noiseType === "pink"}
              onCheckedChange={(checked) =>
                setMixerNoise({ noiseType: checked ? "pink" : "white" })
              }
              label={mixer.noise.noiseType === "pink" ? "Pink" : "White"}
              theme="blue"
            />
          </div>
        </div>
      </div>
      <SectionTitle>Mixer</SectionTitle>
    </section>
  );
}

export default Mixer;
