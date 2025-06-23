import Knob from "../Knob";
import { useSynthStore } from "@/store/synthStore";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useCallback } from "react";

interface LFORateProps {
  disabled?: boolean;
}

function LFORate({ disabled = false }: LFORateProps) {
  const lfoWaveform = useSynthStore((state) => state.lfoWaveform);
  const setLfoWaveform = useSynthStore((state) => state.setLfoWaveform);
  const lfoRate = useSynthStore((state) => state.lfoRate);
  const setLfoRate = useSynthStore((state) => state.setLfoRate);
  // TODO: Wire value/onChange to actual LFO rate state
  const handleDoubleClick = useCallback(() => {
    setLfoWaveform(lfoWaveform === "triangle" ? "square" : "triangle");
  }, [lfoWaveform, setLfoWaveform]);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <div onDoubleClick={disabled ? undefined : handleDoubleClick}>
            <Knob
              size="small"
              valueLabels={{
                0: "0",
                2: "2",
                4: "4",
                6: "6",
                8: "8",
                10: "10",
              }}
              value={lfoRate}
              min={0}
              max={10}
              step={1}
              label="LFO Rate"
              onChange={disabled ? () => {} : setLfoRate}
              disabled={disabled}
            />
          </div>
        </Tooltip.Trigger>
        <Tooltip.Content side="top" align="center" sideOffset={8}>
          double click to change waveform
        </Tooltip.Content>
      </Tooltip.Root>
    </div>
  );
}

export default LFORate;
