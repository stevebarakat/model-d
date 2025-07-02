import { presetToURL } from "../presetToURL";
import { presets } from "@/data/presets";

describe("presetToURL", () => {
  it("should generate a URL for a preset", () => {
    const preset = presets[0]; // Fat Bass preset
    const url = presetToURL(preset, "http://localhost:3000");

    expect(url).toContain("http://localhost:3000?");
    expect(url).toContain("osc1_waveform=sawtooth");
    expect(url).toContain("osc1_freq=440");
    expect(url).toContain("osc1_range=16");
    expect(url).toContain("osc1_enabled=true");
  });

  it("should include all preset parameters in the URL", () => {
    const preset = presets.find((p) => p.id === "lead-synth");
    if (!preset) throw new Error("Lead synth preset not found");

    const url = presetToURL(preset, "http://localhost:3000");

    // Check for key parameters from the lead synth preset
    expect(url).toContain("osc1_waveform=sawtooth");
    expect(url).toContain("osc1_range=8");
    expect(url).toContain("osc2_waveform=pulse1");
    expect(url).toContain("filter_cutoff=7");
    expect(url).toContain("glide_on=true");
    expect(url).toContain("glide_time=2.5");
  });

  it("should use window.location.origin as default base URL", () => {
    const preset = presets[0];
    const url = presetToURL(preset);

    expect(url).toContain("?");
    expect(url).toContain("osc1_waveform=sawtooth");
  });

  it("should generate different URLs for different presets", () => {
    const fatBass = presets.find((p) => p.id === "fat-bass");
    const leadSynth = presets.find((p) => p.id === "lead-synth");

    if (!fatBass || !leadSynth) throw new Error("Presets not found");

    const fatBassUrl = presetToURL(fatBass, "http://localhost:3000");
    const leadSynthUrl = presetToURL(leadSynth, "http://localhost:3000");

    expect(fatBassUrl).not.toBe(leadSynthUrl);
  });
});
