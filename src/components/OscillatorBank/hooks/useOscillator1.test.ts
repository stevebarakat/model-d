import { describe, it, expect, beforeEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useOscillator1 } from "./useOscillator1";
import { useSynthStore } from "@/store/synthStore";

// Mock the oscillator audio modules
vi.mock("../audio/oscillator1", () => ({
  createOscillator1: vi.fn(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    update: vi.fn(),
    getNode: vi.fn(() => mockOscNode),
    getGainNode: vi.fn(() => mockGainNode),
    setFrequency: vi.fn(),
  })),
}));

// Mock oscillator and gain nodes
const mockOscNode = {
  frequency: {
    setValueAtTime: vi.fn(),
    setTargetAtTime: vi.fn(),
  },
};

const mockGainNode = {
  gain: { value: 1 },
  connect: vi.fn(),
};

// Mock AudioContext
const mockAudioContext = {
  currentTime: 0,
  createOscillator: vi.fn(() => mockOscNode),
  createGain: vi.fn(() => mockGainNode),
} as unknown as AudioContext;

describe("useOscillator1 Glide", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Reset store to initial state
    useSynthStore.setState({
      oscillator1: {
        waveform: "sawtooth",
        range: "8",
        frequency: 440,
        enabled: true,
      },
      mixer: {
        osc1: { enabled: true, volume: 8 },
        osc2: { enabled: true, volume: 8 },
        osc3: { enabled: true, volume: 8 },
        noise: { enabled: false, volume: 0, noiseType: "white" },
        external: { enabled: false, volume: 0, overload: false },
      },
      glideOn: false,
      glideTime: 0.1,
    });
  });

  it("should jump instantly when glide is OFF", () => {
    // Set glide OFF
    useSynthStore.setState({ glideOn: false });

    const { result } = renderHook(() => useOscillator1(mockAudioContext));

    act(() => {
      result.current.triggerAttack("A4");
    });

    // Should call setValueAtTime for instant frequency change
    expect(mockOscNode.frequency.setValueAtTime).toHaveBeenCalledWith(
      440, // A4 frequency
      0 // currentTime
    );
    expect(mockOscNode.frequency.setTargetAtTime).not.toHaveBeenCalled();
  });

  it("should glide smoothly when glide is ON", () => {
    // Set glide ON with 0.5 second glide time
    useSynthStore.setState({ glideOn: true, glideTime: 0.5 });

    const { result } = renderHook(() => useOscillator1(mockAudioContext));

    act(() => {
      result.current.triggerAttack("A4");
    });

    // Should call setTargetAtTime for smooth transition
    expect(mockOscNode.frequency.setTargetAtTime).toHaveBeenCalledWith(
      440, // A4 frequency
      0, // currentTime
      0.5 // glideTime
    );
    expect(mockOscNode.frequency.setValueAtTime).not.toHaveBeenCalled();
  });

  it("should use the correct glide time from store", () => {
    const customGlideTime = 2.5;
    useSynthStore.setState({ glideOn: true, glideTime: customGlideTime });

    const { result } = renderHook(() => useOscillator1(mockAudioContext));

    act(() => {
      result.current.triggerAttack("C5");
    });

    expect(mockOscNode.frequency.setTargetAtTime).toHaveBeenCalledWith(
      expect.closeTo(523.25, 2), // C5 frequency
      0,
      customGlideTime
    );
  });
});
