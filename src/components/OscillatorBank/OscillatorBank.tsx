import OscillatorModulation from "./components/OscillatorModulation";
import Oscillator1 from "./components/Oscillator1";
import Oscillator2 from "./components/Oscillator2";
import Oscillator3 from "./components/Oscillator3";
import Title from "../Title";
import Section from "../Section";
import Column from "../Column";
import { useSynthStore } from "@/store/synthStore";

function OscillatorBank() {
  const isDisabled = useSynthStore((s) => s.isDisabled);

  return (
    <Section className={isDisabled ? "disabled" : ""}>
      <Column>
        <OscillatorModulation />
        <Oscillator1 />
        <Oscillator2 />
        <Oscillator3 />
      </Column>
      <Title>Oscillator Bank</Title>
    </Section>
  );
}

export default OscillatorBank;
