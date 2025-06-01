import { LoudnessEnvelope, FilterEnvelope } from "@/components/Envelopes";
import SectionTitle from "@/components/SectionTitle";
import ModulationSwitch from "@/components/Filter/ModulationSwitch";
import KeyboardControl from "@/components/Filter/KeyboardControl";
import Filter from "@/components/Filter";
import styles from "./Modifiers.module.css";

function Modifiers() {
  return (
    <section>
      <div className={styles.column}>
        <div className={styles.modSwitches}>
          <ModulationSwitch />
          <KeyboardControl />
        </div>
        <Filter />
        <FilterEnvelope />
        <LoudnessEnvelope />
      </div>
      <SectionTitle>Modifiers</SectionTitle>
    </section>
  );
}

export default Modifiers;
