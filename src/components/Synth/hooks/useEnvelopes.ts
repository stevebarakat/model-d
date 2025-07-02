import { useMemo } from "react";
import { useSynthStore } from "@/store/synthStore";
import {
  mapEnvelopeTime,
  mapContourAmount,
  mapCutoff,
  noteNameToMidi,
} from "../utils/synthUtils";
import type { EnvelopeProps } from "../types/synthTypes";

function useEnvelopes({
  audioContext,
  filterNode,
  loudnessEnvelopeGain,
  osc1,
  osc2,
  osc3,
}: EnvelopeProps) {
  const {
    filterCutoff,
    filterModulationOn,
    filterContourAmount,
    filterAttack,
    filterDecay,
    filterSustain,
    keyboardControl1,
    keyboardControl2,
    modWheel,
    decaySwitchOn,
    loudnessAttack,
    loudnessDecay,
    loudnessSustain,
  } = useSynthStore();

  // Precompute envelope times
  const loudnessAttackTime = mapEnvelopeTime(loudnessAttack);
  const loudnessDecayTime = mapEnvelopeTime(loudnessDecay);
  const loudnessSustainLevel = loudnessSustain / 10;

  const synthObj = useMemo(() => {
    return {
      triggerAttack: (note: string) => {
        console.log("useEnvelopes: triggerAttack called with note:", note);
        console.log("useEnvelopes: osc1 =", osc1);
        console.log("useEnvelopes: osc2 =", osc2);
        console.log("useEnvelopes: osc3 =", osc3);
        if (!audioContext || !loudnessEnvelopeGain) {
          console.log(
            "useEnvelopes: Missing audioContext or loudnessEnvelopeGain"
          );
          return;
        }
        console.log("useEnvelopes: Calling oscillator triggerAttack functions");
        osc1?.triggerAttack?.(note);
        osc2?.triggerAttack?.(note);
        osc3?.triggerAttack?.(note);

        // Apply filter envelope and key tracking
        if (filterNode) {
          const keyTracking =
            (keyboardControl1 ? 1 / 3 : 0) + (keyboardControl2 ? 2 / 3 : 0);
          const noteNumber = noteNameToMidi(note);
          const baseNoteNumber = 60; // C4
          const baseCutoff = mapCutoff(filterCutoff);
          const trackedCutoff =
            baseCutoff *
            Math.pow(2, (keyTracking * (noteNumber - baseNoteNumber)) / 12);

          if (
            typeof AudioWorkletNode !== "undefined" &&
            filterNode instanceof AudioWorkletNode
          ) {
            // For AudioWorkletNode, send all parameters to WASM
            const minFreq = 20;
            const maxFreq = 20000;
            let normCutoff =
              (Math.log(trackedCutoff) - Math.log(minFreq)) /
              (Math.log(maxFreq) - Math.log(minFreq));
            normCutoff = Math.max(0, Math.min(1, normCutoff));

            // Send cutoff and key tracking
            filterNode.port.postMessage({ cutOff: normCutoff });
            filterNode.port.postMessage({
              keyTracking: {
                base: normCutoff,
                tracking: keyTracking,
                note: noteNumber,
              },
            });

            // Send envelope parameters if modulation is on
            if (filterModulationOn) {
              const attackTime = mapEnvelopeTime(filterAttack);
              const decayTime = mapEnvelopeTime(filterDecay);
              const sustainLevel = filterSustain / 10;
              const releaseTime = mapEnvelopeTime(filterDecay); // Use decay time for release
              const contourAmount =
                mapContourAmount(filterContourAmount) * (modWheel / 100);

              filterNode.port.postMessage({
                envelopeParams: {
                  attack: attackTime,
                  decay: decayTime,
                  sustain: sustainLevel,
                  release: releaseTime,
                  contour: contourAmount,
                },
              });

              // Trigger envelope
              filterNode.port.postMessage({ triggerEnvelope: true });
            }
          } else if (
            typeof filterNode.frequency !== "undefined" &&
            typeof filterNode.context !== "undefined"
          ) {
            if (filterModulationOn) {
              // Filter envelope modulation
              const contourOctaves =
                mapContourAmount(filterContourAmount) * (modWheel / 100);
              const attackTime = mapEnvelopeTime(filterAttack);
              const decayTime = mapEnvelopeTime(filterDecay);
              const sustainLevel = filterSustain / 10;
              const envMax = trackedCutoff * Math.pow(2, contourOctaves);
              const envSustain =
                trackedCutoff + (envMax - trackedCutoff) * sustainLevel;
              const now = audioContext.currentTime;

              filterNode.frequency.cancelScheduledValues(now);

              // For smooth note transitions, start from current frequency if it's close
              const currentFreq = filterNode.frequency.value;
              const freqDiff =
                Math.abs(currentFreq - trackedCutoff) / trackedCutoff;
              const startFreq = freqDiff < 0.5 ? currentFreq : trackedCutoff; // Smooth transition if close

              filterNode.frequency.setValueAtTime(startFreq, now);
              filterNode.frequency.linearRampToValueAtTime(
                envMax,
                now + attackTime
              );
              filterNode.frequency.linearRampToValueAtTime(
                envSustain,
                now + attackTime + decayTime
              );
            } else {
              // Just set cutoff with key tracking
              filterNode.frequency.setValueAtTime(
                trackedCutoff,
                audioContext.currentTime
              );
            }
          }
        }

        // Apply loudness envelope
        const now = audioContext.currentTime;
        if (loudnessEnvelopeGain) {
          loudnessEnvelopeGain.gain.cancelScheduledValues(now);

          // For smooth note transitions, start from current gain if it's not zero
          const currentGain = loudnessEnvelopeGain.gain.value;
          const startGain = currentGain > 0.01 ? currentGain * 0.3 : 0; // Smooth transition

          loudnessEnvelopeGain.gain.setValueAtTime(startGain, now);
          loudnessEnvelopeGain.gain.linearRampToValueAtTime(
            1,
            now + loudnessAttackTime
          );
          loudnessEnvelopeGain.gain.linearRampToValueAtTime(
            loudnessSustainLevel,
            now + loudnessAttackTime + loudnessDecayTime
          );
        }
      },
      triggerRelease: () => {
        if (!audioContext || !loudnessEnvelopeGain) {
          return;
        }
        osc1?.triggerRelease?.();
        osc2?.triggerRelease?.();
        osc3?.triggerRelease?.();

        const now = audioContext.currentTime;

        // Handle filter envelope release
        if (filterNode && filterModulationOn) {
          if (
            typeof AudioWorkletNode !== "undefined" &&
            filterNode instanceof AudioWorkletNode
          ) {
            // Send release command to WASM
            filterNode.port.postMessage({ releaseEnvelope: true });
          } else if (
            typeof filterNode.frequency !== "undefined" &&
            typeof filterNode.context !== "undefined"
          ) {
            if (decaySwitchOn) {
              filterNode.frequency.cancelScheduledValues(now);
              const currentFreq = filterNode.frequency.value;
              filterNode.frequency.setValueAtTime(currentFreq, now);
              filterNode.frequency.linearRampToValueAtTime(
                mapCutoff(filterCutoff),
                now + mapEnvelopeTime(filterDecay)
              );
            } else {
              filterNode.frequency.setValueAtTime(mapCutoff(filterCutoff), now);
            }
          }
        }

        // Handle loudness envelope release
        if (decaySwitchOn) {
          if (loudnessEnvelopeGain) {
            loudnessEnvelopeGain.gain.cancelScheduledValues(now);
            const currentGain = loudnessEnvelopeGain.gain.value;
            loudnessEnvelopeGain.gain.setValueAtTime(currentGain, now);
            loudnessEnvelopeGain.gain.linearRampToValueAtTime(
              0,
              now + loudnessDecayTime
            );
          }
        } else {
          if (loudnessEnvelopeGain) {
            loudnessEnvelopeGain.gain.cancelScheduledValues(now);
            const currentGain = loudnessEnvelopeGain.gain.value;
            loudnessEnvelopeGain.gain.setValueAtTime(currentGain, now);
            // Add a small release time to prevent popping
            const releaseTime = Math.max(0.01, loudnessDecayTime * 0.1); // At least 10ms
            loudnessEnvelopeGain.gain.linearRampToValueAtTime(
              0,
              now + releaseTime
            );
          }
        }
      },
    };
  }, [
    audioContext,
    filterNode,
    loudnessEnvelopeGain,
    osc1,
    osc2,
    osc3,
    filterCutoff,
    filterModulationOn,
    filterContourAmount,
    filterAttack,
    filterDecay,
    filterSustain,
    keyboardControl1,
    keyboardControl2,
    modWheel,
    decaySwitchOn,
    loudnessAttackTime,
    loudnessDecayTime,
    loudnessSustainLevel,
  ]);

  return synthObj;
}
export default useEnvelopes;
