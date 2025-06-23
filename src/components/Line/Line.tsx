import React from "react";
import styles from "./Line.module.css";

type LineProps = {
  style?: React.CSSProperties;
  side?: "left" | "right";
};

export default function Line({ style, side = "left" }: LineProps) {
  const sideStyle = side === "left" ? { left: "5.1rem" } : { right: "6.75rem" };

  return <div className={styles.line} style={{ ...style, ...sideStyle }}></div>;
}
