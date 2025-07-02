import { SynthState } from "../types/synth";

export function createInitialState(): Omit<
  SynthState,
  | "setActiveKeys"
  | "setKeyboardRef"
  | "setPitchWheel"
  | "setModWheel"
  | "setOscillator1"
  | "setOscillator2"
  | "setOscillator3"
> {
  return {
    isDisabled: true,
    activeKeys: null,
    keyboardRef: { synth: null },
    pitchWheel: 50,
    modWheel: 50,
    masterTune: 0,
    oscillator1: {
      waveform: "sawtooth",
      frequency: 440,
      range: "8",
      enabled: true,
    },
    oscillator2: {
      waveform: "sawtooth",
      frequency: 0,
      range: "8",
      enabled: true,
    },
    oscillator3: {
      waveform: "rev_saw",
      frequency: 0,
      range: "8",
      enabled: true,
    },
    mixer: {
      osc1: { enabled: true, volume: 8 },
      osc2: { enabled: true, volume: 8 },
      osc3: { enabled: true, volume: 8 },
      noise: { enabled: false, volume: 0, noiseType: "white" },
      external: { enabled: false, volume: 0, overload: false },
    },
    mainVolume: 2.5,
    isMainActive: true,
    glideOn: false,
    glideTime: 0.1,
    filterAttack: 0.5,
    filterDecay: 2.5,
    filterSustain: 5,
    filterCutoff: 5,
    filterEmphasis: 5,
    filterContourAmount: 5,
    filterModulationOn: false,
    keyboardControl1: false,
    keyboardControl2: false,
    loudnessAttack: 0.5,
    loudnessDecay: 2.5,
    loudnessSustain: 8,
    decaySwitchOn: false,
    oscillatorModulationOn: false,
    lfoWaveform: "triangle",
    lfoRate: 5,
    modMix: 0,
    osc3Control: true,
    osc3FilterEgSwitch: true,
    noiseLfoSwitch: true,
  };
}
