import { useCallback, useEffect, useRef } from "react";

type UseKnobKeyboardProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
};

export function useKnobKeyboard({
  value,
  min,
  max,
  step,
  onChange,
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
          newValue = Math.min(max, value + stepSize);
          break;
        case "ArrowDown":
        case "ArrowLeft":
          newValue = Math.max(min, value - stepSize);
          break;
        default:
          return;
      }

      onChange(Number(newValue.toFixed(step >= 1 ? 0 : 2)));
    },
    [value, min, max, step, onChange]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return { knobRef };
}
