import { SynthState } from "@/store/types/synth";

export interface Preset {
  id: string;
  name: string;
  description: string;
  category: string;
  parameters: Partial<SynthState>;
  shareURL?: string; // Optional URL for sharing
}

export const presets: Preset[] = [
  {
    id: "air-bass",
    name: "Air Bass",
    description:
      "Light, airy bass with subtle noise and smooth filter movement.",
    category: "Bass",
    parameters: {
      oscillator1: {
        waveform: "sawtooth",
        frequency: 0,
        range: "32",
        enabled: true,
      },
      oscillator2: {
        waveform: "sawtooth",
        frequency: -2,
        range: "32",
        enabled: true,
      },
      oscillator3: {
        waveform: "triangle",
        frequency: -2,
        range: "16",
        enabled: true,
      },
      mixer: {
        osc1: { enabled: true, volume: 6 },
        osc2: { enabled: true, volume: 6 },
        osc3: { enabled: true, volume: 6 },
        noise: { enabled: true, volume: 2, noiseType: "white" },
        external: { enabled: false, volume: 2, overload: false },
      },
      filterCutoff: 2.5,
      filterEmphasis: 2.5,
      filterAttack: 0.5,
      filterDecay: 2.5,
      filterSustain: 7.5,
      filterContourAmount: 7.5,
      filterModulationOn: true,
      keyboardControl1: true,
      loudnessAttack: 0.5,
      loudnessDecay: 2.5,
      loudnessSustain: 7.5,
      mainVolume: 6,
      glideOn: true,
      glideTime: 6.5,
      modMix: 2.5,
      osc3Control: true,
      osc3FilterEgSwitch: true,
      lfoRate: 0,
      lfoWaveform: "triangle",
      decaySwitchOn: true,
      oscillatorModulationOn: true,
    },
  },
  {
    id: "midnight-funk",
    name: "Midnight Funk",
    description:
      "Funky, modulated synth sound with triangle LFO and rich filter movement.",
    category: "Funk",
    parameters: {
      oscillator1: {
        waveform: "sawtooth",
        frequency: 0,
        range: "16",
        enabled: true,
      },
      oscillator2: {
        waveform: "sawtooth",
        frequency: 0,
        range: "16",
        enabled: true,
      },
      oscillator3: {
        waveform: "pulse1",
        frequency: -0.25,
        range: "32",
        enabled: true,
      },
      mixer: {
        osc1: { enabled: true, volume: 10 },
        osc2: { enabled: true, volume: 8 },
        osc3: { enabled: true, volume: 6 },
        noise: { enabled: false, volume: 0, noiseType: "white" },
        external: { enabled: false, volume: 0, overload: false },
      },
      filterCutoff: 3,
      filterEmphasis: 8,
      filterAttack: 0,
      filterDecay: 2,
      filterSustain: 8,
      filterContourAmount: 8,
      loudnessAttack: 0,
      loudnessDecay: 3,
      loudnessSustain: 8,
      mainVolume: 7,
      glideOn: false,
      glideTime: 0,
      keyboardControl1: true,
      osc3FilterEgSwitch: true,
      osc3Control: true,
    },
  },
];

export const getPresetById = (id: string): Preset | undefined => {
  return presets.find((preset) => preset.id === id);
};

export const getPresetsByCategory = (category: string): Preset[] => {
  return presets.filter((preset) => preset.category === category);
};

export const getCategories = (): string[] => {
  return [...new Set(presets.map((preset) => preset.category))];
};
