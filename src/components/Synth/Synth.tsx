import { useEffect } from "react";
import { useNoise } from "@/components/Noise/hooks";
import {
  useOscillator1,
  useOscillator2,
  useOscillator3,
} from "@/components/OscillatorBank/hooks";
import { useMidiHandling } from "@/components/Keyboard/hooks";
import Modifiers from "../Modifiers";
import Mixer from "../Mixer";
import OscillatorBank from "../OscillatorBank";
import Controllers from "../Controllers";
import Output from "../Output";
import Keyboard from "@/components/Keyboard";
import SidePanel from "@/components/SidePanel";
import Side from "@/components/Side";
import { useSynthStore } from "@/store/synthStore";
import { useAudioContext } from "@/hooks/useAudioContext";
import styles from "./Synth.module.css";
import PowerButton from "../PowerButton";
import { useAudioNodes, useModulation, useEnvelopes } from "./hooks";
import { mapCutoff, noteNameToMidi } from "./utils/synthUtils";
import Row from "../Row";
import Logo from "../Logo";
import Section from "../Section";
import PresetsDropdown from "../PresetsDropdown";
import { loadStateFromURL } from "@/utils/urlState";
import { useURLSync, setLoadingFromURL } from "@/hooks/useURLSync";

function Synth() {
  const { activeKeys, setActiveKeys, loadPreset } = useSynthStore();
  const { audioContext, isInitialized, initialize, dispose } =
    useAudioContext();

  // Load settings from URL parameters on mount - run immediately
  useEffect(() => {
    const urlState = loadStateFromURL();
    if (urlState) {
      setLoadingFromURL(true);
      loadPreset(urlState);
      // Reset the flag after a short delay to allow URL sync to resume
      setTimeout(() => setLoadingFromURL(false), 200);
    }
  }, []); // Empty dependency array to run only once on mount

  // Sync state changes with URL
  useURLSync();

  // Set up audio nodes
  const {
    mixerNode,
    filterNode: _filterNode,
    loudnessEnvelopeGain,
  } = useAudioNodes(audioContext);
  // Explicitly type filterNode as AudioWorkletNode | null
  const filterNode: AudioWorkletNode | null = _filterNode;

  // Set up oscillators
  const validCtx = audioContext && mixerNode ? audioContext : null;
  const validMixer =
    audioContext && mixerNode instanceof GainNode ? mixerNode : null;

  useNoise(validCtx, validMixer);

  const vibratoAmount = useSynthStore((state) =>
    state.oscillatorModulationOn && state.modWheel > 0
      ? state.modWheel / 100
      : 0
  );

  const osc1 = useOscillator1(validCtx, validMixer, vibratoAmount);
  const osc2 = useOscillator2(validCtx, validMixer, vibratoAmount);
  const osc3 = useOscillator3(validCtx, validMixer, vibratoAmount);

  // Set up modulation
  useModulation({
    audioContext,
    osc1,
    osc2,
    osc3,
    filterNode,
  });

  // Set up envelopes and get synth object
  const synthObj = useEnvelopes({
    audioContext,
    filterNode,
    loudnessEnvelopeGain,
    osc1,
    osc2,
    osc3,
  });

  // Set up MIDI handling with the synth object
  useMidiHandling(synthObj);

  // Update filter based on key tracking
  useEffect(() => {
    if (!filterNode || !audioContext) return;
    const { filterCutoff, keyboardControl1, keyboardControl2 } =
      useSynthStore.getState();

    // Key tracking for static cutoff
    let trackedCutoff = mapCutoff(filterCutoff);
    const keyTracking =
      (keyboardControl1 ? 1 / 3 : 0) + (keyboardControl2 ? 2 / 3 : 0);
    if (activeKeys) {
      const noteNumber = noteNameToMidi(activeKeys);
      const baseNoteNumber = 60;
      trackedCutoff =
        trackedCutoff *
        Math.pow(2, (keyTracking * (noteNumber - baseNoteNumber)) / 12);
    }

    // AudioWorkletNode case - send normalized cutoff to WASM
    const minFreq = 20;
    const maxFreq = 20000;
    let normCutoff =
      (Math.log(trackedCutoff) - Math.log(minFreq)) /
      (Math.log(maxFreq) - Math.log(minFreq));
    normCutoff = Math.max(0, Math.min(1, normCutoff));
    filterNode.port.postMessage({ cutOff: normCutoff });
  }, [filterNode, audioContext, activeKeys]);

  return (
    <>
      <PresetsDropdown disabled={!isInitialized} />
      <div className={styles.synthContainer}>
        <Side backgroundImage="/images/side-left.png" />
        <div className={styles.synth}>
          <div className={styles.backPanel}></div>
          <div className={styles.controlsPanel}>
            <Controllers />
            <OscillatorBank />
            <Mixer audioContext={audioContext!} mixerNode={mixerNode!} />
            <Modifiers />
            <Output />
            <Section style={{ borderRight: "none" }}>
              <PowerButton
                isOn={isInitialized}
                onPowerOn={initialize}
                onPowerOff={dispose}
              />
            </Section>
          </div>
          <Row
            justify="flex-end"
            style={{
              padding: "var(--spacing-md)",
              background: "url('/images/mid-panel-2.png') repeat-x ",
            }}
          >
            <Logo />
          </Row>
          <div className={styles.keyboardPanel}>
            <SidePanel />
            <Keyboard
              activeKeys={activeKeys}
              octaveRange={{ min: 3, max: 5 }}
              onKeyDown={setActiveKeys}
              onKeyUp={() => setActiveKeys(null)}
              synth={synthObj}
            />
          </div>
        </div>
        <Side backgroundImage="/images/side-right.png" />
      </div>
    </>
  );
}

export default Synth;
