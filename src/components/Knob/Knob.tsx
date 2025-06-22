import React, { useEffect, useRef, useState } from "react";
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
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  showMidTicks?: boolean;
  type?: "arrow" | "radial";
  style?: React.CSSProperties;
};

type MousePosition = {
  clientY: number;
  clientX: number;
};

function getRotation(
  value: number,
  min: number,
  max: number,
  type: "arrow" | "radial" = "radial"
): number {
  const range = max - min;
  const percentage = (value - min) / range;

  if (type === "arrow") {
    return percentage * 150 - 75; // -75 to +75 degrees (9:30 to 2:30)
  } else {
    return percentage * 300 - 150; // -150 to +150 degrees (7:15 to 4:45)
  }
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
  size = "medium",
  disabled = false,
  showMidTicks = true,
  type = "radial",
  style,
}: KnobProps): React.ReactElement {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);
  const [startValue, setStartValue] = useState(0);
  const labelClass = title ? styles.labelHidden : styles.label;
  const id = slugify(label);

  const rotation = getRotation(value, min, max, type);
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

  useEffect(() => {
    if (!isDragging) return;

    function handleMouseUp(): void {
      setIsDragging(false);
    }
    function handleMouseMove(e: MousePosition): void {
      if (!isDragging) {
        return;
      }

      const sensitivity = 1.0;
      const deltaY = (startY - e.clientY) * sensitivity;
      const range = max - min;
      let newValue;

      newValue = Math.min(
        max,
        Math.max(min, startValue + (deltaY / 100) * range)
      );

      // Ensure we don't go below min or above max
      newValue = Math.min(max, Math.max(min, newValue));

      // Only apply precision for display, not for snapping
      onChange(newValue);
    }

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, min, max, startY, startValue, onChange]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent): void {
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

      onChange(Number(newValue.toFixed(2)));
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [value, min, max, step, onChange]);

  return (
    <div
      style={style}
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
      <div className={styles.knob}>
        {/* Tick marks around the knob */}
        {valueLabels &&
          (() => {
            const labelKeys = Object.keys(valueLabels)
              .map(Number)
              .sort((a, b) => a - b);
            const arc = type === "arrow" ? 150 : 262.5;
            const startAngle = type === "arrow" ? -75 : -130;
            const ticks = [];
            // Main ticks for valueLabels
            for (let i = 0; i < labelKeys.length; i++) {
              const tick = labelKeys[i];
              const angle = startAngle + ((tick - min) / (max - min)) * arc;
              ticks.push(
                <div
                  key={"tick-" + tick}
                  className={styles.knobTick}
                  style={{
                    transform: `rotate(${angle}deg) translate(-50%, calc(-1 * var(--tick-offset)))`,
                  }}
                />
              );
              // Add a small tick between this and the next label (only for radial type)
              if (
                showMidTicks &&
                type !== "arrow" &&
                i < labelKeys.length - 1
              ) {
                const nextTick = labelKeys[i + 1];
                const mid = (tick + nextTick) / 2;
                const midAngle = startAngle + ((mid - min) / (max - min)) * arc;
                ticks.push(
                  <div
                    key={`tick-mid-${tick}-${nextTick}`}
                    className={styles.knobTick}
                    style={{
                      transform: `rotate(${midAngle}deg) translate(-50%, calc(-1 * var(--tick-offset)))`,
                    }}
                  />
                );
              }
            }
            return ticks;
          })()}
        {/* Value labels around the knob */}
        {valueLabels &&
          Object.keys(valueLabels).map((tickKey) => {
            const tick = Number(tickKey);
            const arc = type === "arrow" ? 150 : 270;
            const startAngle = type === "arrow" ? -165 : 135;
            const angle = startAngle + ((tick - min) / (max - min)) * arc;
            const rad = (angle * Math.PI) / 180;
            const x = 50 + Math.cos(rad) * 80;
            const y = 50 + Math.sin(rad) * 80;
            return (
              <div
                key={tick}
                className={styles.valueLabel}
                style={{
                  left: `${x}%`,
                  top: `${y}%`,
                }}
              >
                {valueLabels[tick]}
              </div>
            );
          })}
        <div
          className={styles.knobBtm}
          style={{
            filter:
              type === "radial"
                ? "drop-shadow(0 1px 0 hsla(0, 0%, 30%))"
                : "drop-shadow(0 -1px 0 hsla(0, 0%, 60%))",
          }}
        >
          <div
            className={type === "arrow" ? styles.arrow : styles.radial}
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
            <div className={styles.dot} />
          </div>
        </div>
      </div>
      <input
        id={id}
        tabIndex={-1}
        type="range"
        min={min}
        max={max}
        step={min === 0 && max === 1 ? 1 : step}
        value={value}
        onChange={
          disabled
            ? undefined
            : (e) => {
                const rawValue = Number(e.target.value);
                onChange(Number(rawValue.toFixed(step >= 1 ? 0 : 2)));
              }
        }
        className={styles.rangeInput}
        disabled={disabled}
      />
    </div>
  );
}

export default Knob;
