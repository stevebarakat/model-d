import styles from "./RockerSwitch.module.css";
import { slugify, cn } from "@/utils";

type RockerSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label: string;
  topLabelLeft?: string | React.ReactElement;
  topLabel?: string | React.ReactElement;
  topLabelRight?: string | React.ReactElement;
  leftLabel?: string | React.ReactElement;
  bottomLabelLeft?: string | React.ReactElement;
  bottomLabel?: string | React.ReactElement;
  bottomLabelRight?: string | React.ReactElement;
  theme?: "black" | "orange" | "blue" | "white";
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
  style,
  orientation = "horizontal",
}: RockerSwitchProps) {
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
        {topLabel && (
          <span
            className={styles.center}
            style={{
              background:
                orientation === "vertical" ? "none" : "var(--color-synth-bg)",
            }}
          >
            {topLabel}
          </span>
        )}
        {topLabelRight && <span className={styles.right}>{topLabelRight}</span>}
      </div>
    );
  }

  function LeftLabel({
    leftLabel,
  }: {
    leftLabel: string | React.ReactElement | undefined;
  }) {
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
        {bottomLabel && (
          <span className={styles.center + " " + styles[`${orientation}Label`]}>
            {bottomLabel}
          </span>
        )}
        {bottomLabelRight && (
          <span className={styles.right}>{bottomLabelRight}</span>
        )}
      </div>
    );
  }

  function Switch() {
    return (
      <label htmlFor={id}>
        <input
          id={id}
          className={styles.state}
          type="checkbox"
          onChange={(e) => onCheckedChange(e.target.checked)}
          checked={checked}
        />
        <div className={styles.switch}>
          <span className="sr-only">{label}</span>
        </div>
      </label>
    );
  }

  return (
    <div className={cn(styles[orientation], styles[theme])} style={style}>
      <TopLabels topLabels={topLabels} />

      <LeftLabel leftLabel={leftLabel} />

      <Switch />

      <BottomLabels bottomLabels={bottomLabels} />
    </div>
  );
}

export default RockerSwitch;
