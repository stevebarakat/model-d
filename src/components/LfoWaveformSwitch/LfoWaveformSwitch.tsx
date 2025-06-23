import { Square, Triangle } from "lucide-react";
import { useCallback } from "react";
import { RockerSwitch } from "../RockerSwitch";
import { useSynthStore } from "@/store/synthStore";

type LfoWaveformSwitchProps = {
  disabled?: boolean;
};

function LfoWaveformSwitch({ disabled = false }: LfoWaveformSwitchProps) {
  const lfoWaveform = useSynthStore((state) => state.lfoWaveform);
  const setLfoWaveform = useSynthStore((state) => state.setLfoWaveform);
  const changeLfoWaveform = useCallback(() => {
    setLfoWaveform(lfoWaveform === "triangle" ? "square" : "triangle");
  }, [lfoWaveform, setLfoWaveform]);
  return (
    <RockerSwitch
      theme="white"
      checked={lfoWaveform === "triangle"}
      onCheckedChange={changeLfoWaveform}
      label="LFO Waveform"
      topLabelRight={<Triangle size={10} strokeWidth={2} />}
      topLabelLeft={<Square size={10} strokeWidth={2} />}
      disabled={disabled}
    />
  );
}

export default LfoWaveformSwitch;
