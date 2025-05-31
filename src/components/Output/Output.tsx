import SectionTitle from "../SectionTitle";
import styles from "./Output.module.css";

function Output() {
  return (
    <section className="section">
      <div className={styles.column}>
        <div className={styles.row}></div>
      </div>
      <SectionTitle>Output</SectionTitle>
    </section>
  );
}

export default Output;
