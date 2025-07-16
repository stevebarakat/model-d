import React from "react";
import styles from "./Line.module.css";

type LineProps = {
  style?: React.CSSProperties;
  side?: "left" | "right";
};

function Line({ style, side = "left" }: LineProps) {
  return (
    <div
      className={styles.line}
      style={{
        ...style,
        borderLeft:
          side === "left" ? "2px solid var(--color-white-50)" : "none",
        borderRight:
          side === "right" ? "2px solid var(--color-white-50)" : "none",
      }}
    />
  );
}

export default Line;
