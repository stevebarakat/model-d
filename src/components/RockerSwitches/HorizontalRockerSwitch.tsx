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
  const topLabels = [topLabelLeft, topLabel, topLabelRight].filter(
    (label) => label !== undefined
  ) as string[];
  const bottomLabels = [bottomLabelLeft, bottomLabel, bottomLabelRight].filter(
    (label) => label !== undefined
  ) as string[];

  function TopLabels({ topLabels }: { topLabels: string[] }) {
    if (topLabels.length === 0) return null;

    return (
      <div className={styles.topLabel}>
        {topLabelLeft && <span className={styles.left}>{topLabelLeft}</span>}
        {topLabel && <span className={styles.center}>{topLabel}</span>}
        {topLabelRight && <span className={styles.right}>{topLabelRight}</span>}
      </div>
    );
  }

  function BottomLabels({ bottomLabels }: { bottomLabels: string[] }) {
    if (bottomLabels.length === 0) return null;

    return (
      <div className={styles.bottomLabel}>
        {bottomLabelLeft && (
          <span className={styles.left}>{bottomLabelLeft}</span>
        )}
        {bottomLabel && <span className={styles.center}>{bottomLabel}</span>}
        {bottomLabelRight && (
          <span className={styles.right}>{bottomLabelRight}</span>
        )}
      </div>
    );
  }

  return (
    <div
      className={
        styles.horizontalRockerSwitch +
        (styles[theme] ? " " + styles[theme] : "") +
        (disabled ? " disabled" : "")
      }
      style={style}
    >
      <TopLabels topLabels={topLabels} />

      {leftLabel && <span className={styles.leftLabel}>{leftLabel}</span>}

      <label htmlFor={id}>
        <input
          id={id}
          className={styles.state}
          type="checkbox"
          onChange={(e) => onCheckedChange(e.target.checked)}
          checked={checked}
          disabled={disabled}
        />
        <div className={styles.switchContainer}>
          <div className={styles.gloss} />
          <div className={styles.switch}>
            <span className="sr-only">{label}</span>
          </div>
        </div>
      </label>

      <BottomLabels bottomLabels={bottomLabels} />
    </div>
  );
}

export default HorizontalRockerSwitch;
