import React from "react";
import styles from "./Keyboard.module.css";
import type { BlackKeyProps } from "./types";

export function BlackKey({
  isActive,
  position,
  width,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
}: BlackKeyProps) {
  return (
    <div
      className={`${styles.blackKey} ${isActive ? styles.blackKeyActive : ""}`}
      style={{ left: `${position}%`, width: `${width}%` }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  );
}

export default React.memo(BlackKey);
