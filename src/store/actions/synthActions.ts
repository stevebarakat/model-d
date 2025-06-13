import { StateCreator } from "zustand";
import {
  SynthState,
  SynthActions,
  OscillatorState,
  MixerSourceState,
  MixerNoiseState,
  MixerExternalState,
} from "../types/synth";

export function createSynthActions(
  set: Parameters<StateCreator<SynthState & SynthActions>>[0]
): SynthActions {
  return {
    setActiveKeys: (key) =>
      set((state: SynthState) => ({
        activeKeys: typeof key === "function" ? key(state.activeKeys) : key,
      })),
    setKeyboardRef: (ref) => set({ keyboardRef: ref }),
    setPitchWheel: (value) => set({ pitchWheel: value }),
    setModWheel: (value) => set({ modWheel: value }),
    setMasterTune: (value) => set({ masterTune: value }),
    setOscillator1: (osc: Partial<OscillatorState>) =>
      set((state: SynthState) => ({
        oscillator1: { ...state.oscillator1, ...osc },
      })),
    setOscillator2: (osc: Partial<OscillatorState>) =>
      set((state: SynthState) => ({
        oscillator2: { ...state.oscillator2, ...osc },
      })),
    setOscillator3: (osc: Partial<OscillatorState>) =>
      set((state: SynthState) => ({
        oscillator3: { ...state.oscillator3, ...osc },
      })),
    setMixerSource: (
      source: "osc1" | "osc2" | "osc3",
      value: Partial<MixerSourceState>
    ) =>
      set((state: SynthState) => ({
        mixer: {
          ...state.mixer,
          [source]: { ...state.mixer[source], ...value },
        },
      })),
    setMixerNoise: (value: Partial<MixerNoiseState>) =>
      set((state: SynthState) => ({
        mixer: {
          ...state.mixer,
          noise: { ...state.mixer.noise, ...value },
        },
      })),
    setMixerExternal: (value: Partial<MixerExternalState>) =>
      set((state: SynthState) => ({
        mixer: {
          ...state.mixer,
          external: { ...state.mixer.external, ...value },
        },
      })),
    setGlideOn: (on: boolean) => set({ glideOn: on }),
    setGlideTime: (time: number) => set({ glideTime: time }),
    setMasterVolume: (value) => set({ masterVolume: value }),
    setIsMasterActive: (value) => set({ isMasterActive: value }),
    setFilterEnvelope: (env) =>
      set((state: SynthState) => ({
        filterAttack:
          env.attack !== undefined ? env.attack : state.filterAttack,
        filterDecay: env.decay !== undefined ? env.decay : state.filterDecay,
        filterSustain:
          env.sustain !== undefined ? env.sustain : state.filterSustain,
      })),
    setFilterCutoff: (value) => set({ filterCutoff: value }),
    setFilterEmphasis: (value) => set({ filterEmphasis: value }),
    setFilterContourAmount: (value) => set({ filterContourAmount: value }),
    setFilterModulationOn: (on: boolean) => set({ filterModulationOn: on }),
    setKeyboardControl1: (on: boolean) => set({ keyboardControl1: on }),
    setKeyboardControl2: (on: boolean) => set({ keyboardControl2: on }),
    setOscillatorModulationOn: (on: boolean) =>
      set({ oscillatorModulationOn: on }),
  };
}
