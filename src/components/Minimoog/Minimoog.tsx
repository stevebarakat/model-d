import Body from "@/components/Body";
import Side from "@/components/Side";
import Synth from "../Synth";
import PresetsDropdown from "../PresetsDropdown";
import { Top, Middle, Bottom } from "../Panels";
import { useAudioContext } from "@/hooks/useAudioContext";

function Minimoog() {
  const { isInitialized } = useAudioContext();
  return (
    <>
      <PresetsDropdown disabled={!isInitialized} />
      <Synth>
        <Side />
        <Body>
          <Top />
          <Middle />
          <Bottom />
        </Body>
        <Side />
      </Synth>
    </>
  );
}

export default Minimoog;
