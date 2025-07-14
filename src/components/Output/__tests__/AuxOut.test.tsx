import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import AuxOut from "../AuxOut";
import { useSynthStore } from "@/store/synthStore";

// Mock the store
vi.mock("@/store/synthStore", () => ({
  useSynthStore: vi.fn(),
}));

describe("AuxOut", () => {
  const mockSetAuxOutput = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (
      useSynthStore as jest.MockedFunction<typeof useSynthStore>
    ).mockReturnValue({
      auxOutput: {
        enabled: false,
        volume: 0,
      },
      setAuxOutput: mockSetAuxOutput,
      isDisabled: false,
    } as ReturnType<typeof useSynthStore>);
  });

  it("renders aux output controls", () => {
    render(<AuxOut />);

    expect(screen.getByText("Volume")).toBeInTheDocument();
    expect(screen.getByText("Aux Out")).toBeInTheDocument();
  });

  it("displays current aux output state", () => {
    (
      useSynthStore as jest.MockedFunction<typeof useSynthStore>
    ).mockReturnValue({
      auxOutput: {
        enabled: true,
        volume: 5,
      },
      setAuxOutput: mockSetAuxOutput,
      isDisabled: false,
    } as ReturnType<typeof useSynthStore>);

    render(<AuxOut />);

    // The knob should show the current volume value
    const knob = screen.getByRole("slider");
    expect(knob).toHaveValue("5");
  });

  it("calls setAuxOutput when volume changes", () => {
    render(<AuxOut />);

    const knob = screen.getByRole("slider");
    fireEvent.change(knob, { target: { value: "7" } });

    expect(mockSetAuxOutput).toHaveBeenCalledWith({ volume: 7 });
  });

  it("calls setAuxOutput when enabled state changes", () => {
    render(<AuxOut />);

    const switchButton = screen.getByRole("button", { name: "Aux Out" });
    fireEvent.click(switchButton);

    expect(mockSetAuxOutput).toHaveBeenCalledWith({ enabled: true });
  });

  it("is disabled when synth is disabled", () => {
    (
      useSynthStore as jest.MockedFunction<typeof useSynthStore>
    ).mockReturnValue({
      auxOutput: {
        enabled: false,
        volume: 0,
      },
      setAuxOutput: mockSetAuxOutput,
      isDisabled: true,
    } as ReturnType<typeof useSynthStore>);

    render(<AuxOut />);

    const knob = screen.getByRole("slider");
    const switchButton = screen.getByRole("button", { name: "Aux Out" });

    expect(knob).toBeDisabled();
    expect(switchButton).toBeDisabled();
  });
});
