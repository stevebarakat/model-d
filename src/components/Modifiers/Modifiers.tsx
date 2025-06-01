import { LoudnessEnvelope, FilterEnvelope } from "@/components/Envelopes";
import SectionTitle from "@/components/SectionTitle";
import Filter from "@/components/Filter";
import styles from "./Modifiers.module.css";

function Modifiers() {
  return (
    <section>
      <div className={styles.column}>
        <Filter />
        <FilterEnvelope />
        <LoudnessEnvelope />
      </div>
      <SectionTitle>Modifiers</SectionTitle>
    </section>
  );
}

export default Modifiers;
