import OscillatorModulation from "./components/OscillatorModulation";
import Oscillator1 from "./components/Oscillator1";
import Oscillator2 from "./components/Oscillator2";
import Oscillator3 from "./components/Oscillator3";
import Title from "../Title";
import Section from "../Section";
import Column from "../Column";

interface OscillatorBankProps {
  disabled?: boolean;
}

function OscillatorBank({ disabled = false }: OscillatorBankProps) {
  return (
    <Section
      style={{
        paddingRight: "var(--spacing-xs)",
      }}
    >
      <Column>
        <OscillatorModulation disabled={disabled} />
        <Oscillator1 disabled={disabled} />
        <Oscillator2 disabled={disabled} />
        <Oscillator3 disabled={disabled} />
      </Column>
      <Title>Oscillator Bank</Title>
    </Section>
  );
}

export default OscillatorBank;
