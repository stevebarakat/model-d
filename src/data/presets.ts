import { SynthState } from "@/store/types/synth";

export type Preset = {
  id: string;
  name: string;
  description: string;
  category: string;
  controllers: {
    tune: number; // 0-10
    glideTime: number; // 0-10
    modMix: number; // 0-10
    osc3FilterEgSwitch: boolean;
    noiseLfoSwitch: boolean;
  };
  filter: {
    filterCutoff: number;
    filterEmphasis: number;
    filterContourAmount: number;
    filterAttack: number;
    filterDecay: number;
    filterSustain: number;
    filterModulationOn: boolean;
  };
  loudness: {
    loudnessAttack: number;
    loudnessDecay: number;
    loudnessSustain: number;
  };
  oscillators: Partial<SynthState>;
  sidePanel: {
    glideOn: boolean;
    decaySwitchOn: boolean;
    lfoRate: number;
    lfoWaveform: string;
    modWheel: number;
  };
  mainVolume: number;
  shareURL?: string; // Optional URL for sharing
};

export const presets: Preset[] = [
  {
    id: "shamisen",
    name: "Shamisen (Chinese plucked instrument)",
    description:
      "OSCILLATOR-1 and OSCILLATOR-2 in unison. Play black keys only in middle of the keyboard.",
    category: "Plucked",
    controllers: {
      tune: 0,
      glideTime: 0,
      modMix: 0,
      osc3FilterEgSwitch: false,
      noiseLfoSwitch: false,
    },
    oscillators: {
      oscillatorModulationOn: false,
      osc3Control: true,
      oscillator1: {
        waveform: "sawtooth",
        frequency: 0,
        range: "4",
        enabled: true,
      },
      oscillator2: {
        waveform: "sawtooth",
        frequency: 0,
        range: "4",
        enabled: true,
      },
      oscillator3: {
        waveform: "triangle",
        frequency: 4,
        range: "lo",
        enabled: false,
      },
      mixer: {
        osc1: { enabled: true, volume: 5 },
        osc2: { enabled: true, volume: 5 },
        osc3: { enabled: false, volume: 0 },
        noise: { enabled: false, volume: 0, noiseType: "white" },
        external: { enabled: false, volume: 0, overload: false },
      },
    },
    filter: {
      filterCutoff: -2,
      filterEmphasis: 4,
      filterContourAmount: 6,
      filterAttack: 0, // 0ms - instant attack
      filterDecay: 25, // 25ms - quick decay
      filterSustain: 4,
      filterModulationOn: true,
    },
    loudness: {
      loudnessAttack: 0, // 0ms - instant attack
      loudnessDecay: 50, // 50ms - quick decay
      loudnessSustain: 0,
    },
    sidePanel: {
      glideOn: true,
      decaySwitchOn: false,
      lfoRate: 0,
      lfoWaveform: "triangle",
      modWheel: 2,
    },
    mainVolume: 5,
  },
  {
    id: "harpsicord",
    name: "Harpsicord",
    description:
      "Oscillator-1 and OSCILLATOR-2 in unison. Increase DECAY TIME control to 7 for lower register of keyboard.",
    category: "Plucked",
    controllers: {
      tune: 0,
      glideTime: 0,
      modMix: 0,
      osc3FilterEgSwitch: false,
      noiseLfoSwitch: false,
    },
    oscillators: {
      oscillatorModulationOn: false,
      osc3Control: false,
      oscillator1: {
        waveform: "sawtooth",
        frequency: 0,
        range: "8",
        enabled: true,
      },
      oscillator2: {
        waveform: "pulse3",
        frequency: 0,
        range: "8",
        enabled: true,
      },
      oscillator3: {
        waveform: "triangle",
        frequency: 0,
        range: "8",
        enabled: false,
      },
      mixer: {
        osc1: { enabled: true, volume: 3 },
        osc2: { enabled: true, volume: 5 },
        osc3: { enabled: false, volume: 0 },
        noise: { enabled: false, volume: 0, noiseType: "white" },
        external: { enabled: false, volume: 0, overload: false },
      },
    },
    filter: {
      filterCutoff: 5,
      filterEmphasis: 7,
      filterContourAmount: 0,
      filterAttack: 0, // 0ms - instant attack
      filterDecay: 10, // 10ms - very quick decay
      filterSustain: 0,
      filterModulationOn: true,
    },
    loudness: {
      loudnessAttack: 0, // 0ms - instant attack
      loudnessDecay: 10, // 10ms - very quick decay
      loudnessSustain: 0,
    },
    sidePanel: {
      glideOn: false,
      decaySwitchOn: true,
      lfoRate: 0,
      lfoWaveform: "triangle",
      modWheel: 0,
    },
    mainVolume: 5,
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
