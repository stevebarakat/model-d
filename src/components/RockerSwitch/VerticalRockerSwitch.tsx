import styles from "./VerticalRockerSwitch.module.css";
import { slugify } from "@/utils";

type VerticalRockerSwitchProps = {
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

function VerticalRockerSwitch({
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
}: VerticalRockerSwitchProps) {
  // Covert label to slug for id
  const id = slugify(label);

  return (
    <div
      className={
        styles.verticalRockerSwitch +
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
          {bottomLabel && <span className={styles.center}>{bottomLabel}</span>}
          {bottomLabelRight && (
            <span className={styles.right}>{bottomLabelRight}</span>
          )}
        </div>
      </label>
    </div>
  );
}

export default VerticalRockerSwitch;
