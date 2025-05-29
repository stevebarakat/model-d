import Modifiers from "../Modifiers";
import Mixer from "../Mixer";
import OscillatorBank from "../OscillatorBank";
import Controllers from "../Controllers";
import Output from "../Output";

function SynthControls() {
  return (
    <>
      <Controllers />
      <OscillatorBank />
      <Mixer />
      <Modifiers />
      <Output />
    </>
  );
}

export default SynthControls;
