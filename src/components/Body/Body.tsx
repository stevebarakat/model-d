import styles from "./Body.module.css";

function Body({ children }: { children: React.ReactNode }) {
  return <div className={styles.synth}>{children}</div>;
}

export default Body;
