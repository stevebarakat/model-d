import { useEffect } from "react";
import { useSynthStore } from "@/store/synthStore";
import { mapEnvelopeTime } from "../utils/synthUtils";

interface UseSynthEnvelopeProps {
  audioContext: AudioContext | null;
  loudnessEnvelopeGain: GainNode | null;
  filterNode: BiquadFilterNode | null;
  activeKeys: string | null;
}

export function useSynthEnvelope({
  audioContext,
  loudnessEnvelopeGain,
  filterNode,
  activeKeys,
}: UseSynthEnvelopeProps): void {
  const {
    loudnessAttack,
    loudnessDecay,
    loudnessSustain,
    decaySwitchOn,
    filterModulationOn,
    filterAttack,
    filterDecay,
    filterSustain,
    filterContourAmount,
    modWheel,
    filterCutoff,
  } = useSynthStore();

  // Precompute loudness envelope times
  const loudnessAttackTime = mapEnvelopeTime(loudnessAttack);
  const loudnessDecayTime = mapEnvelopeTime(loudnessDecay);
  const loudnessSustainLevel = loudnessSustain / 10;

  // Handle loudness envelope
  useEffect(() => {
    if (!audioContext || !loudnessEnvelopeGain || !activeKeys) return;

    const now = audioContext.currentTime;
    // Cancel any ongoing envelope
    loudnessEnvelopeGain.gain.cancelScheduledValues(now);
    // Start from 0
    loudnessEnvelopeGain.gain.setValueAtTime(0, now);
    // Ramp to full volume
    loudnessEnvelopeGain.gain.linearRampToValueAtTime(
      1,
      now + loudnessAttackTime
    );
    // Then to sustain level
    loudnessEnvelopeGain.gain.linearRampToValueAtTime(
      loudnessSustainLevel,
      now + loudnessAttackTime + loudnessDecayTime
    );
  }, [
    audioContext,
    loudnessEnvelopeGain,
    activeKeys,
    loudnessAttackTime,
    loudnessDecayTime,
    loudnessSustainLevel,
  ]);

  // Handle loudness envelope release
  useEffect(() => {
    if (!audioContext || !loudnessEnvelopeGain || !activeKeys) return;

    const now = audioContext.currentTime;
    if (decaySwitchOn) {
      loudnessEnvelopeGain.gain.cancelScheduledValues(now);
      const currentGain = loudnessEnvelopeGain.gain.value;
      loudnessEnvelopeGain.gain.setValueAtTime(currentGain, now);
      loudnessEnvelopeGain.gain.linearRampToValueAtTime(
        0,
        now + loudnessDecayTime
      );
    } else {
      loudnessEnvelopeGain.gain.cancelScheduledValues(now);
      loudnessEnvelopeGain.gain.setValueAtTime(0, now);
    }
  }, [
    audioContext,
    loudnessEnvelopeGain,
    activeKeys,
    decaySwitchOn,
    loudnessDecayTime,
  ]);

  // Handle filter envelope
  useEffect(() => {
    if (!audioContext || !filterNode || !activeKeys || !filterModulationOn)
      return;

    const now = audioContext.currentTime;
    const baseCutoff = filterCutoff;
    const contourOctaves = filterContourAmount * 0.4 * (modWheel / 100);
    const attackTime = mapEnvelopeTime(filterAttack);
    const decayTime = mapEnvelopeTime(filterDecay);
    const sustainLevel = filterSustain / 10;
    const envMax = baseCutoff * Math.pow(2, contourOctaves);
    const envSustain = baseCutoff + (envMax - baseCutoff) * sustainLevel;

    filterNode.frequency.cancelScheduledValues(now);
    filterNode.frequency.setValueAtTime(baseCutoff, now);
    filterNode.frequency.linearRampToValueAtTime(envMax, now + attackTime);
    filterNode.frequency.linearRampToValueAtTime(
      envSustain,
      now + attackTime + decayTime
    );
  }, [
    audioContext,
    filterNode,
    activeKeys,
    filterModulationOn,
    filterAttack,
    filterDecay,
    filterSustain,
    filterContourAmount,
    modWheel,
    filterCutoff,
  ]);

  // Handle filter envelope release
  useEffect(() => {
    if (!audioContext || !filterNode || !activeKeys || !filterModulationOn)
      return;

    const now = audioContext.currentTime;
    if (decaySwitchOn) {
      filterNode.frequency.cancelScheduledValues(now);
      const currentFreq = filterNode.frequency.value;
      filterNode.frequency.setValueAtTime(currentFreq, now);
      filterNode.frequency.linearRampToValueAtTime(
        filterCutoff,
        now + mapEnvelopeTime(filterDecay)
      );
    } else {
      filterNode.frequency.setValueAtTime(filterCutoff, now);
    }
  }, [
    audioContext,
    filterNode,
    activeKeys,
    filterModulationOn,
    decaySwitchOn,
    filterDecay,
    filterCutoff,
  ]);
}
