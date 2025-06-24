import React from "react";
import { calculateLabelPosition } from "../utils";
import styles from "../Knob.module.css";

type KnobLabelsProps = {
  valueLabels: Record<number, string | React.ReactElement>;
  min: number;
  max: number;
  type: "arrow" | "radial";
  logarithmic?: boolean;
};

export function KnobLabels({
  valueLabels,
  min,
  max,
  type,
  logarithmic = false,
}: KnobLabelsProps) {
  return (
    <>
      {Object.keys(valueLabels).map((tickKey) => {
        const tick = Number(tickKey);
        const { x, y } = calculateLabelPosition(
          tick,
          min,
          max,
          type,
          logarithmic
        );

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
