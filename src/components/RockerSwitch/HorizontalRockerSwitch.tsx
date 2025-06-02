import React from "react";
import styles from "./HorizontalRockerSwitch.module.css";
import { slugify } from "@/utils/helpers";

type RockerSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  topLabelLeft?: string;
  topLabel?: string;
  topLabelRight?: string;
  leftLabel?: string;
  bottomLabelLeft?: string;
  bottomLabelCenter?: string;
  bottomLabelRight?: string;
  theme?: "black" | "orange" | "blue" | "white";
  className?: string;
  disabled?: boolean;
};

function HorizontalRockerSwitch({
  checked,
  onCheckedChange,
  label = "",
  theme = "white",
  topLabelLeft,
  topLabel,
  topLabelRight,
  leftLabel,
  bottomLabelLeft,
  bottomLabelCenter,
  bottomLabelRight,
  className,
  disabled = false,
}: RockerSwitchProps) {
  // Covert label to slug for id
  const id = slugify(label);

  return (
    <div
      className={
        styles.horizontalRockerSwitch +
        (styles[theme] ? " " + styles[theme] : "") +
        (disabled ? " " + styles.disabled : "")
      }
      style={disabled ? { opacity: 0.5, pointerEvents: "none" } : {}}
    >
      {/* Label for screen readers */}
      <label htmlFor={id}>
        <span className="sr-only">{label}</span>

        {/* Top Label */}
        <div className={`${styles.topLabel}`}>
          {topLabelLeft && <span className={styles.left}>{topLabelLeft}</span>}
          {topLabel && <span className={styles.center}>{topLabel}</span>}
          {topLabelRight && (
            <span className={styles.right}>{topLabelRight}</span>
          )}
        </div>

        {/* Left Label */}
        {leftLabel && <span className={styles.leftLabel}>{leftLabel}</span>}

        {/* Switch Input */}
        <input
          id={id}
          className={styles.state}
          type="checkbox"
          name="switch"
          onChange={(e) => onCheckedChange(e.target.checked)}
          checked={checked}
          disabled={disabled}
        />
        <div className={styles.control}></div>

        {/* Bottom Label */}
        <div className={`${styles.bottomLabel}`}>
          {bottomLabelLeft && (
            <span className={styles.left}>{bottomLabelLeft}</span>
          )}
          {bottomLabelCenter && (
            <span className={styles.center}>{bottomLabelCenter}</span>
          )}
          {bottomLabelRight && (
            <span className={styles.right}>{bottomLabelRight}</span>
          )}
        </div>
      </label>
    </div>
  );
}

export default HorizontalRockerSwitch;
