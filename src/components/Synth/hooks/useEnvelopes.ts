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
        if (!audioContext || !loudnessEnvelopeGain) return;

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
            filterNode.frequency.setValueAtTime(trackedCutoff, now);
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

        // Apply loudness envelope
        const now = audioContext.currentTime;
        if (loudnessEnvelopeGain) {
          loudnessEnvelopeGain.gain.cancelScheduledValues(now);
          loudnessEnvelopeGain.gain.setValueAtTime(0, now);
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
        if (!audioContext || !loudnessEnvelopeGain) return;

        osc1?.triggerRelease?.();
        osc2?.triggerRelease?.();
        osc3?.triggerRelease?.();

        const now = audioContext.currentTime;

        // Handle filter envelope release
        if (filterNode && filterModulationOn) {
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
            loudnessEnvelopeGain.gain.setValueAtTime(0, now);
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
