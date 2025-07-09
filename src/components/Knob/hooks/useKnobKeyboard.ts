import { useCallback, useEffect, useRef } from "react";
import { calculateValueFromDelta } from "../utils";
import { KnobType } from "../types";

type UseKnobKeyboardProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  type: KnobType;
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
          newValue = calculateValueFromDelta(
            -stepSize * 10,
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
          newValue = calculateValueFromDelta(
            stepSize * 10,
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
