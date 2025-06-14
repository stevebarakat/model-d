import { useEffect } from "react";
import { useSynthStore } from "@/store/synthStore";
import { noteNameToMidi } from "../utils/synthUtils";

interface UseSynthFilterProps {
  filterNode: BiquadFilterNode | null;
  audioContext: AudioContext | null;
  activeKeys: string | null;
}

// Helper to map 0-10 to 20 Hz - 20,000 Hz logarithmically
function mapCutoff(val: number): number {
  const minFreq = 20;
  const maxFreq = 20000;
  return minFreq * Math.pow(maxFreq / minFreq, val / 10);
}

export function useSynthFilter({
  filterNode,
  audioContext,
  activeKeys,
}: UseSynthFilterProps): void {
  const {
    filterCutoff,
    filterEmphasis,
    keyboardControl1,
    keyboardControl2,
    filterModulationOn,
    filterContourAmount,
    modWheel,
    filterAttack,
    filterDecay,
    filterSustain,
    decaySwitchOn,
  } = useSynthStore();

  // Helper to map 0-10 to a modulation amount (octaves above base cutoff)
  function mapContourAmount(val: number): number {
    return val * 0.4; // 0-4 octaves
  }

  // Helper to map knob values (0-10) to time values (5ms to 10s)
  function mapEnvelopeTime(value: number): number {
    const minTime = 0.005; // 5ms
    const maxTime = 10; // 10s
    return minTime * Math.pow(maxTime / minTime, value / 10);
  }

  // Update filter parameters
  useEffect(() => {
    if (!filterNode || !audioContext) return;

    // Key tracking for static cutoff
    let trackedCutoff = mapCutoff(filterCutoff);
    const keyTracking =
      (keyboardControl1 ? 1 / 3 : 0) + (keyboardControl2 ? 2 / 3 : 0);

    if (activeKeys) {
      const noteNumber = noteNameToMidi(activeKeys);
      const baseNoteNumber = 60; // C4
      trackedCutoff =
        trackedCutoff *
        Math.pow(2, (keyTracking * (noteNumber - baseNoteNumber)) / 12);
    }

    filterNode.frequency.setValueAtTime(
      trackedCutoff,
      filterNode.context.currentTime
    );

    // Map 0-10 to Q: 0.7 (no resonance) to 15 (classic Minimoog max resonance)
    const minQ = 0.7;
    const maxQ = 15;
    const q = minQ + (maxQ - minQ) * (filterEmphasis / 10);
    filterNode.Q.setValueAtTime(q, filterNode.context.currentTime);
  }, [
    filterNode,
    audioContext,
    filterCutoff,
    filterEmphasis,
    activeKeys,
    keyboardControl1,
    keyboardControl2,
  ]);

  // Handle filter envelope and modulation
  useEffect(() => {
    if (!filterNode || !audioContext || !activeKeys) return;

    const now = audioContext.currentTime;
    const keyTracking =
      (keyboardControl1 ? 1 / 3 : 0) + (keyboardControl2 ? 2 / 3 : 0);
    const noteNumber = noteNameToMidi(activeKeys);
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

      filterNode.frequency.cancelScheduledValues(now);
      filterNode.frequency.setValueAtTime(trackedCutoff, now);
      filterNode.frequency.linearRampToValueAtTime(envMax, now + attackTime);
      filterNode.frequency.linearRampToValueAtTime(
        envSustain,
        now + attackTime + decayTime
      );
    } else {
      // Just set cutoff with key tracking
      filterNode.frequency.setValueAtTime(trackedCutoff, now);
    }
  }, [
    filterNode,
    audioContext,
    activeKeys,
    filterModulationOn,
    filterContourAmount,
    modWheel,
    filterAttack,
    filterDecay,
    filterSustain,
    filterCutoff,
    keyboardControl1,
    keyboardControl2,
  ]);

  // Handle filter release
  useEffect(() => {
    if (!filterNode || !audioContext || !activeKeys) return;

    const now = audioContext.currentTime;
    if (filterModulationOn) {
      if (decaySwitchOn) {
        // If decay switch is on, use decay time for filter release
        filterNode.frequency.cancelScheduledValues(now);
        const currentFreq = filterNode.frequency.value;
        filterNode.frequency.setValueAtTime(currentFreq, now);
        filterNode.frequency.linearRampToValueAtTime(
          mapCutoff(filterCutoff), // Return to base cutoff
          now + mapEnvelopeTime(filterDecay)
        );
      } else {
        // If decay switch is off, return to base cutoff immediately
        filterNode.frequency.setValueAtTime(mapCutoff(filterCutoff), now);
      }
    }
  }, [
    filterNode,
    audioContext,
    activeKeys,
    filterModulationOn,
    decaySwitchOn,
    filterCutoff,
    filterDecay,
  ]);
}
