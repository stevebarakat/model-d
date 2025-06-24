import React from "react";
import { calculateTickAngle } from "../utils";
import styles from "../Knob.module.css";

type KnobTicksProps = {
  valueLabels: Record<number, string | React.ReactElement>;
  min: number;
  max: number;
  type: "arrow" | "radial";
  showMidTicks: boolean;
  logarithmic?: boolean;
};

export function KnobTicks({
  valueLabels,
  min,
  max,
  type,
  showMidTicks,
  logarithmic = false,
}: KnobTicksProps) {
  const labelKeys = Object.keys(valueLabels)
    .map(Number)
    .sort((a, b) => a - b);

  const ticks = [];

  // Main ticks for valueLabels
  for (let i = 0; i < labelKeys.length; i++) {
    const tick = labelKeys[i];
    const angle = calculateTickAngle(tick, min, max, type, logarithmic);

    ticks.push(
      <div
        key={`tick-${tick}`}
        className={styles.knobTick}
        style={{
          transform: `rotate(${angle}deg) translate(-50%, calc(-1 * var(--tick-offset)))`,
        }}
      />
    );

    // Add a small tick between this and the next label (only for radial type)
    if (showMidTicks && type !== "arrow" && i < labelKeys.length - 1) {
      const nextTick = labelKeys[i + 1];
      const mid = (tick + nextTick) / 2;
      const midAngle = calculateTickAngle(mid, min, max, type, logarithmic);

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

  return <>{ticks}</>;
}
