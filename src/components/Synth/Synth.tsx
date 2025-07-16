import styles from "./Synth.module.css";

function Synth({ children }: { children: React.ReactNode }) {
  return <div className={styles.synth}>{children}</div>;
}

export default Synth;
