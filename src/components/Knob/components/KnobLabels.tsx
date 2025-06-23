import React from "react";
import { calculateLabelPosition } from "../utils";
import styles from "../Knob.module.css";

interface KnobLabelsProps {
  valueLabels: Record<number, string | React.ReactElement>;
  min: number;
  max: number;
  type: "arrow" | "radial";
}

export function KnobLabels({ valueLabels, min, max, type }: KnobLabelsProps) {
  return (
    <>
      {Object.keys(valueLabels).map((tickKey) => {
        const tick = Number(tickKey);
        const { x, y } = calculateLabelPosition(tick, min, max, type);

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
    </>
  );
}
