import { useCallback, useEffect, useState } from "react";
import { getSensitivity, calculateValueFromDelta } from "../utils";
import { useKnobKeyboard } from "./useKnobKeyboard";

type UseKnobInteractionProps = {
  value: number;
  min: number;
  max: number;
  step: number;
  size: "small" | "medium" | "large";
  onChange: (value: number) => void;
};

export function useKnobInteraction({
  value,
  min,
  max,
  step,
  size,
  onChange,
}: UseKnobInteractionProps) {
  const { knobRef } = useKnobKeyboard({ value, min, max, step, onChange });
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const [lastUpdateTime, setLastUpdateTime] = useState(0);

  const sensitivity = getSensitivity(max, min, size);

  const updateValue = useCallback(
    (newValue: number) => {
      const now = Date.now();
      // Limit updates to 60fps (16ms)
      if (now - lastUpdateTime < 16) return;

      setLastUpdateTime(now);
      onChange(newValue);
    },
    [onChange, lastUpdateTime]
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
        step
      );

      // Only update if value actually changed
      if (Math.abs(newValue - value) > 0.001) {
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
      value,
      updateValue,
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

  const handleWheel = useCallback(
    (e: React.WheelEvent): void => {
      e.preventDefault();

      const wheelSensitivity = sensitivity * 0.1;
      const delta = e.deltaY > 0 ? -1 : 1;
      const newValue = calculateValueFromDelta(
        delta,
        value,
        wheelSensitivity,
        min,
        max,
        step
      );

      onChange(newValue);
    },
    [value, sensitivity, min, max, step, onChange]
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
    handleWheel,
  };
}
