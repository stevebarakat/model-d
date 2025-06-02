import { useSynthStore } from "@/store/synthStore";
import { HorizontalRockerSwitch } from "../RockerSwitch";
import styles from "./Mixer.module.css";

function MuteSwitches() {
  const { mixer, setMixerSource, setMixerNoise, setMixerExternal } =
    useSynthStore();

  return (
    <div>
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
          onCheckedChange={(checked) => setMixerExternal({ enabled: checked })}
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
    </div>
  );
}

export default MuteSwitches;
