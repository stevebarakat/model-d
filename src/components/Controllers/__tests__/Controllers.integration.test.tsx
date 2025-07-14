import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Controllers from "../Controllers";
import { useSynthStore } from "@/store/synthStore";

// Helper to get current synth store state
const getSynthState = () => useSynthStore.getState();

describe("Controllers modulation routing", () => {
  beforeEach(() => {
    // Reset store to default before each test
    useSynthStore.setState({
      osc3FilterEgSwitch: false,
      noiseLfoSwitch: false,
      modMix: 0,
      isDisabled: false,
    });
  });

  it("toggles modulation source switches and updates state", () => {
    render(<Controllers />);

    // Find the two rocker switches by their labels
    const osc3FilterEgSwitch = screen.getByLabelText(/Send to mod 1/i);
    const noiseLfoSwitch = screen.getByLabelText(/Send to mod 2/i);

    // Toggle OSC3/Filter EG switch ON
    fireEvent.click(osc3FilterEgSwitch);
    expect(getSynthState().osc3FilterEgSwitch).toBe(true);

    // Toggle Noise/LFO switch ON
    fireEvent.click(noiseLfoSwitch);
    expect(getSynthState().noiseLfoSwitch).toBe(true);

    // Toggle OSC3/Filter EG switch OFF
    fireEvent.click(osc3FilterEgSwitch);
    expect(getSynthState().osc3FilterEgSwitch).toBe(false);
  });

  it("changes Modulation Mix knob and updates state", () => {
    render(<Controllers />);
    // Find the Modulation Mix knob by its aria-label
    const modMixKnob = screen.getByRole("slider", { name: /Modulation Mix/i });

    // Simulate changing the knob (simulate keyboard arrow for accessibility)
    modMixKnob.focus();
    fireEvent.keyDown(modMixKnob, { key: "ArrowUp" });
    // The Knob component should call setModMix with the incremented value
    // You may need to adjust this if your Knob requires a different event

    // Alternatively, directly fire a change event if supported:
    // fireEvent.change(modMixKnob, { target: { value: 7 } });

    // Check that the state has changed (should be > 0 after ArrowUp)
    expect(getSynthState().modMix).toBeGreaterThan(0);
  });
});
