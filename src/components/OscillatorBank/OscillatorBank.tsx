import styles from "./OscillatorBank.module.css";
import Oscillator1 from "./components/Oscillator1";
import Oscillator2 from "./components/Oscillator2";
import Oscillator3 from "./components/Oscillator3";
import SectionTitle from "../SectionTitle";
import OscillatorMod from "./components/OscillatorMod";

function OscillatorBank() {
  return (
    <section>
      <div className={styles.column}>
        <OscillatorMod />
        <Oscillator1 />
        <Oscillator2 />
        <Oscillator3 />
      </div>
      <SectionTitle>Oscillator Bank</SectionTitle>
    </section>
  );
}

export default OscillatorBank;
