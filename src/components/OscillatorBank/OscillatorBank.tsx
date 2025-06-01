import SectionTitle from "../SectionTitle";
import Oscillator1 from "./components/Oscillator1";
import Oscillator2 from "./components/Oscillator2";
import Oscillator3 from "./components/Oscillator3";
import styles from "./OscillatorBank.module.css";
import OscillatorModulation from "./components/OscillatorModulation";

function OscillatorBank() {
  return (
    <section className="section">
      <div className={styles.column}>
        <OscillatorModulation />
        <Oscillator1 />
        <Oscillator2 />
        <Oscillator3 />
      </div>
      <SectionTitle>Oscillator Bank</SectionTitle>
    </section>
  );
}

export default OscillatorBank;
