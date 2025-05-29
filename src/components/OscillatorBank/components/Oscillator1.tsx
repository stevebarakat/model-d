import { useSynthStore } from "@/store/synthStore";
import OscillatorPanel from "./OscillatorPanel";
import ArrowKnob from "@/components/ArrowKnob";
import {
  TriangleIcon,
  TriSawIcon,
  SawtoothIcon,
  SquareIcon,
  WidePulseIcon,
  NarrowPulseIcon,
} from "../icons/WaveformIcons";
import { OscillatorWaveform, OscillatorRange } from "@/store/types/synth";

const waveforms: OscillatorWaveform[] = [
  "triangle",
  "tri_saw",
  "sawtooth",
  "pulse1",
  "pulse2",
  "pulse3",
];
const waveformIcons = [
  <TriangleIcon key="triangle" />,
  <TriSawIcon key="tri_saw" />,
  <SawtoothIcon key="sawtooth" />,
  <SquareIcon key="pulse1" />,
  <WidePulseIcon key="pulse2" />,
  <NarrowPulseIcon key="pulse3" />,
];
const ranges: OscillatorRange[] = ["lo", "32", "16", "8", "4", "2"];

export default function Oscillator1() {
  const { oscillator1, setOscillator1 } = useSynthStore();

  function handleWaveformChange(value: number) {
    setOscillator1({ waveform: waveforms[Math.round(value)] });
  }
  function handleRangeChange(value: number) {
    setOscillator1({ range: ranges[Math.round(value)] });
  }

  return (
    <OscillatorPanel>
      <ArrowKnob
        value={ranges.indexOf(oscillator1.range)}
        min={0}
        max={ranges.length - 1}
        step={1}
        label="Range"
        onChange={handleRangeChange}
        valueLabels={ranges.reduce((acc, r, i) => ({ ...acc, [i]: r }), {})}
      />
      <ArrowKnob
        value={waveforms.indexOf(oscillator1.waveform)}
        min={0}
        max={waveforms.length - 1}
        step={1}
        label="Waveform"
        onChange={handleWaveformChange}
        valueLabels={waveformIcons.reduce(
          (acc, icon, i) => ({ ...acc, [i]: icon }),
          {}
        )}
      />
    </OscillatorPanel>
  );
}
