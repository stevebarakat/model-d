import styles from "./HorizontalRockerSwitch.module.css";
import { slugify } from "@/utils";

type HorizontalRockerSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  topLabelLeft?: string;
  topLabel?: string;
  topLabelRight?: string;
  leftLabel?: string;
  bottomLabelLeft?: string;
  bottomLabel?: string;
  bottomLabelRight?: string;
  theme?: "black" | "orange" | "blue" | "white";
  disabled?: boolean;
  style?: React.CSSProperties;
};

function HorizontalRockerSwitch({
  checked,
  onCheckedChange,
  label = "",
  theme = "black",
  topLabelLeft,
  topLabel,
  topLabelRight,
  leftLabel,
  bottomLabelLeft,
  bottomLabel,
  bottomLabelRight,
  disabled = false,
  style,
}: HorizontalRockerSwitchProps) {
  // Covert label to slug for id
  const id = slugify(label);

  return (
    <div
      className={
        styles.horizontalRockerSwitch +
        (styles[theme] ? " " + styles[theme] : "") +
        (disabled ? " " + styles.disabled : "")
      }
      style={
        disabled
          ? { opacity: 0.5, pointerEvents: "none", ...style }
          : { ...style }
      }
    >
      {/* Label for screen readers */}
      <label htmlFor={id} className="sr-only">
        {label}
      </label>

      {/* Top Label */}
      <div className={styles.topLabel}>
        {topLabelLeft && <span className={styles.left}>{topLabelLeft}</span>}
        {topLabel && <span className={styles.center}>{topLabel}</span>}
        {topLabelRight && <span className={styles.right}>{topLabelRight}</span>}
      </div>

      {/* Left Label */}
      {/* {leftLabel && <span className={styles.leftLabel}>{leftLabel}</span>} */}

      {/* Switch Input */}
      <label
        htmlFor={id}
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
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
      </label>

      {/* Bottom Label */}
      <div className={`${styles.bottomLabel}`}>
        {bottomLabelLeft && (
          <span className={styles.left}>{bottomLabelLeft}</span>
        )}
        {bottomLabel && <span className={styles.center}>{bottomLabel}</span>}
        {bottomLabelRight && (
          <span className={styles.right}>{bottomLabelRight}</span>
        )}
      </div>
    </div>
  );
}

export default HorizontalRockerSwitch;
