import styles from "./RockerSwitch.module.css";
import { slugify } from "@/utils";

type HorizontalRockerSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  topLabelLeft?: string;
  topLabel?: string | React.ReactElement;
  topLabelRight?: string;
  leftLabel?: string;
  bottomLabelLeft?: string;
  bottomLabel?: string | React.ReactElement;
  bottomLabelRight?: string;
  theme?: "black" | "orange" | "blue" | "white";
  disabled?: boolean;
  style?: React.CSSProperties;
  orientation?: "horizontal" | "vertical";
};

function RockerSwitch({
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
  orientation = "horizontal",
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

  function LeftLabel({ leftLabel }: { leftLabel: string | undefined }) {
    if (!leftLabel) return null;
    return <span className={styles.leftLabel}>{leftLabel}</span>;
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
        styles[orientation] +
        (styles[theme] ? " " + styles[theme] : "") +
        (disabled ? " disabled" : "")
      }
      style={style}
    >
      <TopLabels topLabels={topLabels} />

      <LeftLabel leftLabel={leftLabel} />

      <label htmlFor={id}>
        <input
          id={id}
          className={styles.state}
          type="checkbox"
          onChange={(e) => onCheckedChange(e.target.checked)}
          checked={checked}
          disabled={disabled}
        />
        {/* <div className={styles.gloss} /> */}
        <div className={styles.switch}>
          <span className="sr-only">{label}</span>
        </div>
      </label>

      <BottomLabels bottomLabels={bottomLabels} />
    </div>
  );
}

export default RockerSwitch;
