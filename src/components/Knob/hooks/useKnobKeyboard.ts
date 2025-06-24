import { useCallback, useEffect, useRef } from "react";
import { calculateValueFromDelta } from "../utils";

type UseKnobKeyboardProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  type: "radial" | "arrow";
  onChange: (value: number) => void;
  logarithmic?: boolean;
};

export function useKnobKeyboard({
  value,
  min,
  max,
  step,
  type,
  onChange,
  logarithmic = false,
}: UseKnobKeyboardProps) {
  const knobRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent): void => {
      if (!knobRef.current?.contains(document.activeElement)) return;

      const isShiftPressed = e.shiftKey;
      const multiplier = isShiftPressed ? 10 : 1;
      const stepSize = step * multiplier;

      let newValue = value;

      switch (e.key) {
        case "ArrowUp":
        case "ArrowRight":
          // Use calculateValueFromDelta for consistent behavior with mouse interaction
          newValue = calculateValueFromDelta(
            -stepSize * 10, // Negative delta for increase
            value,
            1,
            min,
            max,
            step,
            type,
            logarithmic
          );
          break;
        case "ArrowDown":
        case "ArrowLeft":
          // Use calculateValueFromDelta for consistent behavior with mouse interaction
          newValue = calculateValueFromDelta(
            stepSize * 10, // Positive delta for decrease
            value,
            1,
            min,
            max,
            step,
            type,
            logarithmic
          );
          break;
        default:
          return;
      }

      // Only apply step snapping for arrow knobs
      if (type === "arrow") {
        newValue = Number(newValue.toFixed(step >= 1 ? 0 : 2));
      }

      onChange(newValue);
    },
    [value, min, max, step, type, onChange, logarithmic]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { knobRef };
}
