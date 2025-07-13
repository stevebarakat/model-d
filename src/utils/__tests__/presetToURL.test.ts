import { presetToURL } from "../presetToURL";
import { presets } from "@/data/presets";

describe("presetToURL", () => {
  it("should generate a URL for a preset", () => {
    const preset = presets[0]; // Shamisen preset
    const url = presetToURL(preset, "http://localhost:3000");

    expect(url).toContain("http://localhost:3000?");
    expect(url).toContain("osc1_waveform=sawtooth");
    expect(url).toContain("osc1_freq=0");
    expect(url).toContain("osc1_range=4");
    expect(url).toContain("osc1_enabled=true");
  });

  it("should include all preset parameters in the URL", () => {
    const preset = presets.find((p) => p.id === "harpsicord");
    if (!preset) throw new Error("Harpsicord preset not found");

    const url = presetToURL(preset, "http://localhost:3000");

    // Check for key parameters from the harpsicord preset
    expect(url).toContain("osc1_waveform=sawtooth");
    expect(url).toContain("osc1_range=8");
    expect(url).toContain("osc2_waveform=pulse3");
    expect(url).toContain("filter_cutoff=5");
    expect(url).toContain("glide_on=false");
    expect(url).toContain("decay_switch=true");
  });

  it("should use window.location.origin as default base URL", () => {
    const preset = presets[0];
    const url = presetToURL(preset);

    expect(url).toContain("?");
    expect(url).toContain("osc1_waveform=sawtooth");
  });

  it("should generate different URLs for different presets", () => {
    const shamisen = presets.find((p) => p.id === "shamisen");
    const harpsicord = presets.find((p) => p.id === "harpsicord");

    if (!shamisen || !harpsicord) throw new Error("Presets not found");

    const shamisenUrl = presetToURL(shamisen, "http://localhost:3000");
    const harpsicordUrl = presetToURL(harpsicord, "http://localhost:3000");

    expect(shamisenUrl).not.toBe(harpsicordUrl);
  });
});
