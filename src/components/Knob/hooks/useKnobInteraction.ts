import { useCallback, useEffect, useState } from "react";
import { calculateValueFromDelta } from "../utils";
import { useKnobKeyboard } from "./useKnobKeyboard";
import { KnobType } from "../types";

type UseKnobInteractionProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  type: KnobType;
  onChange: (value: number) => void;
  logarithmic?: boolean;
  size?: "small" | "medium" | "large";
};

export function useKnobInteraction({
  value,
  min,
  max,
  step,
  type,
  onChange,
  logarithmic = false,
  size,
}: UseKnobInteractionProps) {
  const { knobRef } = useKnobKeyboard({
    value,
    min,
    max,
    step,
    type,
    onChange,
    logarithmic,
    size,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  const sensitivity = 1;

  const updateValue = useCallback(
    (newValue: number) => {
      const now = Date.now();
      // Limit updates to 60fps (16ms)
      if (now - lastUpdateTime < 16) return;

      // Only apply threshold-based updates for arrow knobs
      // Radial knobs should update freely
      if (type === "arrow") {
        const threshold = step < 1 ? step / 10 : 0.1;
        if (Math.abs(newValue - value) < threshold) return;
      }

      setLastUpdateTime(now);
      onChange(newValue);
    },
    [onChange, lastUpdateTime, value, step, type]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent): void => {
      e.preventDefault();
      setIsDragging(true);
      setStartY(e.clientY);
      setStartValue(value);

      // Set pointer capture for better tracking
      if (knobRef.current) {
        knobRef.current.setPointerCapture(e.pointerId);
      }
    },
    [value, knobRef]
  );

  const handlePointerMove = useCallback(
    (e: PointerEvent): void => {
      if (!isDragging) return;

      const deltaY = (startY - e.clientY) * sensitivity;
      const newValue = calculateValueFromDelta(
        deltaY,
        startValue,
        1,
        min,
        max,
        step,
        type,
        logarithmic,
        size
      );

      // Only apply threshold-based updates for arrow knobs
      // Radial knobs should update freely
      if (type === "arrow") {
        const threshold = step < 1 ? step / 10 : 0.1;
        if (Math.abs(newValue - value) >= threshold) {
          updateValue(newValue);
        }
      } else {
        updateValue(newValue);
      }
    },
    [
      isDragging,
      startY,
      startValue,
      sensitivity,
      min,
      max,
      step,
      type,
      value,
      updateValue,
      logarithmic,
    ]
  );

  const handlePointerUp = useCallback(
    (e: PointerEvent): void => {
      if (!isDragging) return;

      setIsDragging(false);

      // Release pointer capture
      if (knobRef.current) {
        knobRef.current.releasePointerCapture(e.pointerId);
      }
    },
    [isDragging, knobRef]
  );

  // Set up global event listeners
  useEffect(() => {
    if (!isDragging) return;

    document.addEventListener("pointermove", handlePointerMove, {
      passive: false,
    });
    document.addEventListener("pointerup", handlePointerUp, { passive: false });

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return {
    knobRef,
    isDragging,
    handlePointerDown,
  };
}
