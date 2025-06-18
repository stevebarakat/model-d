import styles from "./VerticalRockerSwitch.module.css";
import { slugify } from "@/utils";

type VerticalRockerSwitchProps = {
  checked: boolean;
  onCheckedChange: (e: React.FormEvent<HTMLInputElement>) => void;
  label: string;
  topLabel?: string | React.ReactElement;
  leftLabel?: string;
  bottomLabel?: string;
  theme?: "black" | "orange" | "blue" | "white";
  disabled?: boolean;
  style?: React.CSSProperties;
};

function VerticalRockerSwitch({
  checked,
  onCheckedChange,
  label = "",
  theme = "black",
  topLabel,
  bottomLabel,
  disabled = false,
  style,
}: VerticalRockerSwitchProps) {
  // Runtime check: if onCheckedChange is not a function, throw a clear error.
  if (typeof onCheckedChange !== "function") {
    throw new Error(
      "VerticalRockerSwitch: onCheckedChange must be a function."
    );
  }

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
        <div className={`${styles.topLabel}`}>{topLabel}</div>

        {/* Switch Input */}
        <input
          id={id}
          className={styles.state}
          type="checkbox"
          name="switch"
          onChange={onCheckedChange}
          checked={checked}
          disabled={disabled}
        />
        <div className={styles.control}></div>

        {/* Bottom Label */}
        <div className={`${styles.bottomLabel}`}>{bottomLabel}</div>
      </label>
    </div>
  );
}

export default VerticalRockerSwitch;
