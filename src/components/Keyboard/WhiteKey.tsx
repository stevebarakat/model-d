import React from "react";
import styles from "./Keyboard.module.css";
import type { WhiteKeyProps } from "./types";

export function WhiteKey({
  isActive,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
}: WhiteKeyProps) {
  return (
    <div
      className={`${styles.whiteKey} ${isActive ? styles.whiteKeyActive : ""}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  );
}

export default React.memo(WhiteKey);
