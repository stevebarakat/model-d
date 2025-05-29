import SectionTitle from "../../SectionTitle";
import Oscillator1 from "./Oscillator1";
import Oscillator2 from "./Oscillator2";
import Oscillator3 from "./Oscillator3";
import styles from "./OscillatorBank.module.css";

function OscillatorBank() {
  return (
    <section className={styles.section}>
      <div className={styles.column}>
        <Oscillator1 />
        <Oscillator2 />
        <Oscillator3 />
      </div>
      <SectionTitle>Oscillator Bank</SectionTitle>
    </section>
  );
}

export default OscillatorBank;
