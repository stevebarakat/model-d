import styles from "./Row.module.css";

function Row({ children }: { children: React.ReactNode }) {
  return <div className={styles.row}>{children}</div>;
}

export default Row;
