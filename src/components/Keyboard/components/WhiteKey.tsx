import React from "react";
import styles from "../Keyboard.module.css";
import type { WhiteKeyProps } from "../types";
import { useSynthStore } from "@/store/synthStore";

export function WhiteKey({
  isActive,
  onPointerDown,
  onPointerUp,
  onPointerEnter,
  onPointerLeave,
}: WhiteKeyProps) {
  const isDisabled = useSynthStore((s) => s.isDisabled);
  return (
    <button
      type="button"
      className={`${styles.whiteKey} ${isActive ? styles.whiteKeyActive : ""} ${
        isDisabled ? "disabled" : ""
      }`}
      disabled={isDisabled}
      aria-pressed={isActive}
      aria-label="Piano key"
      onPointerDown={isDisabled ? undefined : onPointerDown}
      onPointerUp={isDisabled ? undefined : onPointerUp}
      onPointerEnter={isDisabled ? undefined : onPointerEnter}
      onPointerLeave={isDisabled ? undefined : onPointerLeave}
    />
  );
}

export default React.memo(WhiteKey);
