import { convertPresetToStoreFormat } from "../presetConversion";
import { presets } from "@/data/presets";
import { describe, it, expect } from "vitest";

describe("convertPresetToStoreFormat", () => {
  it("should convert a preset to store format", () => {
    const preset = presets[0]; // Shamisen preset
    const storeFormat = convertPresetToStoreFormat(preset);

    // Check controllers
    expect(storeFormat.masterTune).toBe(0);
    expect(storeFormat.glideTime).toBe(0);
    expect(storeFormat.modMix).toBe(0);
    expect(storeFormat.osc3FilterEgSwitch).toBe(false);
    expect(storeFormat.noiseLfoSwitch).toBe(false);

    // Check filter
    expect(storeFormat.filterCutoff).toBe(-2);
    expect(storeFormat.filterEmphasis).toBe(4);
    expect(storeFormat.filterContourAmount).toBe(6);
    expect(storeFormat.filterAttack).toBe(0);
    expect(storeFormat.filterDecay).toBe(25);
    expect(storeFormat.filterSustain).toBe(4);
    expect(storeFormat.filterModulationOn).toBe(true);

    // Check loudness envelope
    expect(storeFormat.loudnessAttack).toBe(0);
    expect(storeFormat.loudnessDecay).toBe(50);
    expect(storeFormat.loudnessSustain).toBe(0);

    // Check oscillators
    expect(storeFormat.oscillator1?.waveform).toBe("sawtooth");
    expect(storeFormat.oscillator1?.frequency).toBe(0);
    expect(storeFormat.oscillator1?.range).toBe("4");
    expect(storeFormat.oscillator1?.enabled).toBe(true);

    // Check side panel
    expect(storeFormat.glideOn).toBe(true);
    expect(storeFormat.decaySwitchOn).toBe(false);
    expect(storeFormat.lfoRate).toBe(0);
    expect(storeFormat.lfoWaveform).toBe("triangle");

    // Check main volume
    expect(storeFormat.mainVolume).toBe(5);
  });

  it("should handle oscillators correctly", () => {
    const preset = presets[0];
    const storeFormat = convertPresetToStoreFormat(preset);

    // Check that oscillator properties are preserved
    expect(storeFormat.oscillatorModulationOn).toBe(false);
    expect(storeFormat.osc3Control).toBe(true);
    expect(storeFormat.mixer?.osc1.enabled).toBe(true);
    expect(storeFormat.mixer?.osc1.volume).toBe(5);
  });
});
