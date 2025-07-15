import styles from "./Screw.module.css";

interface ScrewProps {
  size?: "small" | "medium" | "large";
  className?: string;
  color?: "light" | "dark";
}

function Screw({ size = "medium", className, color = "light" }: ScrewProps) {
  return (
    <div className={`${styles.screw} ${styles[size]} ${className || ""}`}>
      <div className={`${styles.screwHead} ${styles[color]}`}>
        <div className={styles.phillipsCross}>
          <div className={styles.crossLine}></div>
          <div className={styles.crossLine}></div>
        </div>
      </div>
      <div className={styles.screwBody}>
        <div className={styles.threads}>
          {Array.from({ length: 8 }, (_, i) => (
            <div key={i} className={styles.thread}></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Screw;
