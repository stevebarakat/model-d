import React, { useEffect, useRef, useState, useCallback } from "react";
import { slugify } from "@/utils";
import styles from "./Knob.module.css";

type KnobProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  label: string;
  title?: string | React.ReactElement | null;
  unit?: string;
  onChange: (value: number) => void;
  valueLabels?: Record<number, string | React.ReactElement>;
  logarithmic?: boolean;
  size?: "small" | "medium" | "large";
  disabled?: boolean;
};

type MousePosition = {
  clientY: number;
  clientX: number;
};

function getRotation(
  value: number,
  min: number,
  max: number,
  logarithmic: boolean
): number {
  const range = max - min;
  let percentage;
  if (logarithmic) {
    const logMin = Math.log(min);
    const logMax = Math.log(max);
    const logValue = Math.log(value);
    percentage = (logValue - logMin) / (logMax - logMin);
  } else {
    percentage = (value - min) / range;
  }
  return percentage * 300 - 150; // -150 to +150 degrees
}

function getDisplayValue(
  value: number,
  step: number,
  unit: string,
  valueLabels?: Record<number, string | React.ReactElement>
): string | React.ReactElement {
  if (valueLabels?.[Math.round(value)]) {
    return valueLabels[Math.round(value)];
  }
  return value.toFixed(step >= 1 ? 0 : 2) + (unit ? ` ${unit}` : "");
}

function Knob({
  value,
  min,
  max,
  step = 1,
  label,
  title = "",
  unit = "",
  onChange,
  valueLabels,
  logarithmic = false,
  size = "medium",
  disabled = false,
}: KnobProps): React.ReactElement {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isKeyboardActive, setIsKeyboardActive] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const labelClass = title ? styles.labelHidden : styles.label;
  const id = slugify(label);

  const rotation = getRotation(value, min, max, logarithmic);
  const displayValue = getDisplayValue(value, step, unit, valueLabels);
  const ariaValueText =
    typeof displayValue === "string"
      ? displayValue
      : value.toFixed(step >= 1 ? 0 : 2) + (unit ? ` ${unit}` : "");

  function handleMouseDown(e: React.MouseEvent): void {
    if (disabled) {
      return;
    }
    setIsDragging(true);
    setStartY(e.clientY);
    setStartValue(value);
  }

  const handleMouseMove = useCallback(
    (e: MousePosition): void => {
      if (!isDragging) {
        return;
      }

      // Increase sensitivity for logarithmic knobs
      const sensitivity = logarithmic ? 2.0 : 1.0;
      const deltaY = (startY - e.clientY) * sensitivity;
      const range = max - min;
      let newValue;

      if (logarithmic) {
        const logMin = Math.log(min);
        const logMax = Math.log(max);
        const logRange = logMax - logMin;
        const logStartValue = Math.log(Math.max(min, startValue));
        // Adjust delta calculation for logarithmic scale
        const logDelta = (deltaY / 200) * logRange;
        const logNewValue = Math.min(
          logMax,
          Math.max(logMin, logStartValue + logDelta)
        );
        newValue = Math.exp(logNewValue);

        // For logarithmic knobs, use a more precise step calculation
        const effectiveStep = Math.max(0.01, step);
        const steps = Math.round((newValue - min) / effectiveStep);
        newValue = min + steps * effectiveStep;
      } else {
        newValue = Math.min(
          max,
          Math.max(min, startValue + (deltaY / 100) * range)
        );
        // For linear knobs, use normal step calculation
        const steps = Math.round(newValue / step);
        newValue = steps * step;
      }

      // Ensure we don't go below min or above max
      newValue = Math.min(max, Math.max(min, newValue));

      // Round to appropriate precision based on step size
      const precision = step < 0.1 ? 2 : step < 1 ? 1 : 0;
      onChange(Number(newValue.toFixed(precision)));
    },
    [min, max, startY, startValue, onChange, logarithmic, step, isDragging]
  );

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

      setIsKeyboardActive(true);
      onChange(Number(newValue.toFixed(2)));
    },
    [value, min, max, step, onChange]
  );

  useEffect(() => {
    if (!isDragging) return;

    function handleMouseUp(): void {
      setIsDragging(false);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, min, max, startY, startValue, onChange, handleMouseMove]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [value, min, max, step, onChange, handleKeyDown]);

  useEffect(() => {
    if (!isKeyboardActive) return;
    const timer = setTimeout(() => setIsKeyboardActive(false), 1000);
    return () => clearTimeout(timer);
  }, [isKeyboardActive, value]);

  return (
    <div
      className={`${styles.knobContainer} ${disabled && styles.disabled} ${
        styles[`knobContainer${size.charAt(0).toUpperCase() + size.slice(1)}`]
      }`}
    >
      <label
        htmlFor={id}
        className={`${labelClass} ${
          styles[`label${size.charAt(0).toUpperCase() + size.slice(1)}`]
        }`}
      >
        {label}
      </label>
      {title && (
        <span
          className={`${styles.title} ${
            styles[`title${size.charAt(0).toUpperCase() + size.slice(1)}`]
          }`}
        >
          {title}
        </span>
      )}
      <div className={styles.knobRing}></div>
      <div className={styles.ticks}></div>
      <div className={styles.knob}>
        {/* Value labels around the knob */}
        {valueLabels &&
          Object.keys(valueLabels).map((tickKey) => {
            const tick = Number(tickKey);
            const arc = 270;
            const startAngle = 135;
            const angle = startAngle + ((tick - min) / (max - min)) * arc;
            const rad = (angle * Math.PI) / 180;
            const x = 50 + Math.cos(rad) * 80;
            const y = 50 + Math.sin(rad) * 80;
            return (
              <div
                key={tick}
                className={styles.valueLabel}
                style={{
                  position: "absolute",
                  left: `${x}%`,
                  top: `${y}%`,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                }}
              >
                {valueLabels[tick]}
              </div>
            );
          })}
        <div className={styles.knobBtm}>
          <div
            className={styles.outerKnob}
            ref={knobRef}
            style={{ transform: `rotate(${rotation}deg)` }}
            onMouseDown={handleMouseDown}
            tabIndex={disabled ? -1 : 0}
            role="slider"
            aria-valuemin={min}
            aria-valuemax={max}
            aria-valuenow={value}
            aria-label={label}
            aria-valuetext={ariaValueText}
            aria-disabled={disabled}
          >
            <div className={styles.innerKnob}></div>
            <div className={styles.dot}></div>
          </div>
        </div>
      </div>
      <input
        id={id}
        type="range"
        min={logarithmic ? Math.log(min) : min}
        max={logarithmic ? Math.log(max) : max}
        step={
          min === 0 && max === 1
            ? 1
            : logarithmic
            ? (Math.log(max) - Math.log(min)) / 100
            : step
        }
        value={logarithmic ? Math.log(value) : value}
        onChange={
          disabled
            ? undefined
            : (e) => {
                const rawValue = Number(e.target.value);
                const newValue = logarithmic ? Math.exp(rawValue) : rawValue;
                // For binary switches (0/1), ensure we get exact values
                if (min === 0 && max === 1) {
                  onChange(Math.round(newValue));
                } else {
                  onChange(Number(newValue.toFixed(step >= 1 ? 0 : 2)));
                }
              }
        }
        className={styles.rangeInput}
        disabled={disabled}
      />
    </div>
  );
}

export default Knob;
