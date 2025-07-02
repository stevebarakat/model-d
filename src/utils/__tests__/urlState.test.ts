import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  saveStateToURL,
  loadStateFromURL,
  updateURLWithState,
  copyURLToClipboard,
} from "../urlState";
import { createInitialState } from "@/store/state/initialState";

// Mock window.location and navigator.clipboard
const mockLocation = {
  pathname: "/",
  search: "",
  origin: "http://localhost:5173",
};

const mockHistory = {
  replaceState: vi.fn(),
};

const mockClipboard = {
  writeText: vi.fn(),
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
});

Object.defineProperty(window, "history", {
  value: mockHistory,
  writable: true,
});

Object.defineProperty(navigator, "clipboard", {
  value: mockClipboard,
  writable: true,
});

describe("URL State Functions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocation.search = "";
  });

  describe("saveStateToURL", () => {
    it("should convert synth state to URL parameters", () => {
      const state = createInitialState();
      const params = saveStateToURL(state);

      expect(params).toContain("osc1_waveform=sawtooth");
      expect(params).toContain("osc1_freq=440");
      expect(params).toContain("filter_cutoff=5");
      expect(params).toContain("main_volume=2.5");
    });

    it("should include all oscillator settings", () => {
      const state = createInitialState();
      const params = saveStateToURL(state);

      expect(params).toContain("osc1_waveform=sawtooth");
      expect(params).toContain("osc2_waveform=sawtooth");
      expect(params).toContain("osc3_waveform=rev_saw");
      expect(params).toContain("osc1_enabled=true");
      expect(params).toContain("osc2_enabled=true");
      expect(params).toContain("osc3_enabled=true");
    });

    it("should include mixer settings", () => {
      const state = createInitialState();
      const params = saveStateToURL(state);

      expect(params).toContain("mix_osc1_enabled=true");
      expect(params).toContain("mix_osc1_vol=8");
      expect(params).toContain("mix_noise_enabled=false");
      expect(params).toContain("mix_noise_type=white");
    });
  });

  describe("loadStateFromURL", () => {
    it("should return null for empty URL", () => {
      const result = loadStateFromURL();
      expect(result).toBeNull();
    });

    it("should parse oscillator settings from URL", () => {
      mockLocation.search =
        "?osc1_waveform=triangle&osc1_freq=220&osc1_range=16&osc1_enabled=true";
      const result = loadStateFromURL();

      expect(result).toEqual({
        oscillator1: {
          waveform: "triangle",
          frequency: 220,
          range: "16",
          enabled: true,
        },
      });
    });

    it("should parse mixer settings from URL", () => {
      mockLocation.search =
        "?mix_osc1_enabled=true&mix_osc1_vol=10&mix_osc2_enabled=true&mix_osc2_vol=6&mix_osc3_enabled=true&mix_osc3_vol=4&mix_noise_enabled=true&mix_noise_vol=5&mix_noise_type=pink&mix_ext_enabled=false&mix_ext_vol=0&mix_ext_overload=false";
      const result = loadStateFromURL();

      expect(result).toEqual({
        mixer: {
          osc1: { enabled: true, volume: 10 },
          osc2: { enabled: true, volume: 6 },
          osc3: { enabled: true, volume: 4 },
          noise: { enabled: true, volume: 5, noiseType: "pink" },
          external: { enabled: false, volume: 0, overload: false },
        },
      });
    });

    it("should parse filter settings from URL", () => {
      mockLocation.search =
        "?filter_cutoff=7&filter_emphasis=8&filter_contour=6&filter_attack=1&filter_decay=3&filter_sustain=5&filter_mod_on=true";
      const result = loadStateFromURL();

      expect(result).toEqual({
        filterCutoff: 7,
        filterEmphasis: 8,
        filterContourAmount: 6,
        filterAttack: 1,
        filterDecay: 3,
        filterSustain: 5,
        filterModulationOn: true,
      });
    });

    it("should handle partial URL parameters", () => {
      mockLocation.search = "?osc1_waveform=triangle&main_volume=9";
      const result = loadStateFromURL();

      expect(result).toEqual({
        oscillator1: {
          waveform: "triangle",
          frequency: 440, // default value
          range: "8", // default value
          enabled: true, // default value
        },
        mainVolume: 9,
        isMainActive: true, // default value
      });
    });
  });

  describe("updateURLWithState", () => {
    it("should update window history with new URL", () => {
      const state = createInitialState();
      updateURLWithState(state);

      expect(mockHistory.replaceState).toHaveBeenCalledWith(
        {},
        "",
        "/?osc1_waveform=sawtooth&osc1_freq=440&osc1_range=8&osc1_enabled=true&osc2_waveform=sawtooth&osc2_freq=0&osc2_range=8&osc2_enabled=true&osc3_waveform=rev_saw&osc3_freq=0&osc3_range=8&osc3_enabled=true&mix_osc1_enabled=true&mix_osc1_vol=8&mix_osc2_enabled=true&mix_osc2_vol=8&mix_osc3_enabled=true&mix_osc3_vol=8&mix_noise_enabled=false&mix_noise_vol=0&mix_noise_type=white&mix_ext_enabled=false&mix_ext_vol=0&mix_ext_overload=false&filter_cutoff=5&filter_emphasis=5&filter_contour=5&filter_attack=0.5&filter_decay=0&filter_sustain=0&filter_mod_on=false&loudness_attack=0.5&loudness_decay=0&loudness_sustain=5&lfo_waveform=triangle&lfo_rate=5&mod_mix=0&osc_mod_on=false&glide_on=false&glide_time=0.1&main_volume=2.5&main_active=true&keyboard_control1=false&keyboard_control2=false&osc3_control=true&osc3_filter_eg=true&noise_lfo_switch=true&decay_switch=false&master_tune=0&pitch_wheel=50&mod_wheel=50"
      );
    });
  });

  describe("copyURLToClipboard", () => {
    it("should copy URL to clipboard", async () => {
      const state = createInitialState();
      await copyURLToClipboard(state);

      expect(mockClipboard.writeText).toHaveBeenCalledWith(
        "http://localhost:5173/?osc1_waveform=sawtooth&osc1_freq=440&osc1_range=8&osc1_enabled=true&osc2_waveform=sawtooth&osc2_freq=0&osc2_range=8&osc2_enabled=true&osc3_waveform=rev_saw&osc3_freq=0&osc3_range=8&osc3_enabled=true&mix_osc1_enabled=true&mix_osc1_vol=8&mix_osc2_enabled=true&mix_osc2_vol=8&mix_osc3_enabled=true&mix_osc3_vol=8&mix_noise_enabled=false&mix_noise_vol=0&mix_noise_type=white&mix_ext_enabled=false&mix_ext_vol=0&mix_ext_overload=false&filter_cutoff=5&filter_emphasis=5&filter_contour=5&filter_attack=0.5&filter_decay=0&filter_sustain=0&filter_mod_on=false&loudness_attack=0.5&loudness_decay=0&loudness_sustain=5&lfo_waveform=triangle&lfo_rate=5&mod_mix=0&osc_mod_on=false&glide_on=false&glide_time=0.1&main_volume=2.5&main_active=true&keyboard_control1=false&keyboard_control2=false&osc3_control=true&osc3_filter_eg=true&noise_lfo_switch=true&decay_switch=false&master_tune=0&pitch_wheel=50&mod_wheel=50"
      );
    });
  });
});
