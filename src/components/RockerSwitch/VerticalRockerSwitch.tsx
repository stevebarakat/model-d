import styles from "./VerticalRockerSwitch.module.css";

type RockerSwitchProps = {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  label?: string;
  theme?: "black" | "orange" | "blue";
  orientation?: "horizontal" | "vertical";
};

function VerticalRockerSwitch({
  checked,
  onCheckedChange,
  label,
  theme = "black",
}: RockerSwitchProps) {
  return (
    <div className={`${styles.switch} ${styles[theme]}`}>
      <label>
        {label && <span className={styles.label}>{label}</span>}
        <input
          className={styles.state}
          type="checkbox"
          name="switch"
          onChange={() => onCheckedChange(!checked)}
          checked={checked}
        />
        <span className={styles.control}></span>
      </label>
    </div>
  );
}

export default VerticalRockerSwitch;
