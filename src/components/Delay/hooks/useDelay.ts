import { useEffect, useRef } from "react";
import { useSynthStore } from "@/store/synthStore";

export function useDelay(
  audioContext: AudioContext | null,
  inputNode?: AudioNode | null,
  outputNode?: AudioNode | null
) {
  const { delayEnabled, delayTime, delayFeedback, delayMix, activeKeys } =
    useSynthStore();
  const delayNodeRef = useRef<AudioWorkletNode | null>(null);
  const dryGainRef = useRef<GainNode | null>(null);
  const wetGainRef = useRef<GainNode | null>(null);

  useEffect(() => {
    if (!audioContext || !inputNode || !outputNode) {
      delayNodeRef.current = null;
      dryGainRef.current = null;
      wetGainRef.current = null;
      return;
    }
    let cancelled = false;

    async function setup() {
      if (!audioContext || !activeKeys) return;

      // Only enable delay when explicitly turned on
      const shouldEnableDelay = delayEnabled;
      if (!shouldEnableDelay) {
        // When delay is disabled, connect input directly to output
        if (inputNode && outputNode) {
          inputNode.connect(outputNode);
        }
        return;
      }

      // Disconnect any existing direct connection when enabling delay
      if (inputNode && outputNode) {
        inputNode.disconnect(outputNode);
      }

      try {
        await audioContext.audioWorklet.addModule("/delay-processor.js");
        if (cancelled) return;

        // Create delay node
        delayNodeRef.current = new AudioWorkletNode(
          audioContext,
          "delay-processor"
        );

        // Create gain nodes for dry/wet mixing
        dryGainRef.current = audioContext.createGain();
        wetGainRef.current = audioContext.createGain();

        // Set initial parameter values
        const delayTimeSeconds = (delayTime / 10) * 1.0; // Map 0-10 to 0-1 second
        const feedbackValue = (delayFeedback / 10) * 0.9; // Map 0-10 to 0-0.9
        const mixValue = delayMix / 10; // Map 0-10 to 0-1

        delayNodeRef.current.parameters
          .get("delayTime")
          ?.setValueAtTime(delayTimeSeconds, audioContext.currentTime);
        delayNodeRef.current.parameters
          .get("feedback")
          ?.setValueAtTime(feedbackValue, audioContext.currentTime);
        delayNodeRef.current.parameters
          .get("mix")
          ?.setValueAtTime(mixValue, audioContext.currentTime);

        // Set gain values
        dryGainRef.current.gain.value = 1 - mixValue;
        wetGainRef.current.gain.value = mixValue;

        // Connect the audio graph
        if (
          inputNode &&
          dryGainRef.current &&
          delayNodeRef.current &&
          wetGainRef.current &&
          outputNode
        ) {
          inputNode.connect(dryGainRef.current);
          inputNode.connect(delayNodeRef.current);
          delayNodeRef.current.connect(wetGainRef.current);

          dryGainRef.current.connect(outputNode);
          wetGainRef.current.connect(outputNode);
        }
      } catch (error) {
        console.error("Failed to setup delay:", error);
      }
    }

    setup();

    return () => {
      cancelled = true;
      delayNodeRef.current?.disconnect();
      dryGainRef.current?.disconnect();
      wetGainRef.current?.disconnect();
      delayNodeRef.current = null;
      dryGainRef.current = null;
      wetGainRef.current = null;
    };
  }, [audioContext, inputNode, outputNode, delayEnabled, activeKeys]);

  // Update delay parameters when they change
  useEffect(() => {
    if (!delayNodeRef.current || !audioContext || !delayEnabled) return;

    const delayTimeSeconds = (delayTime / 10) * 1.0;
    const feedbackValue = (delayFeedback / 10) * 0.9;
    const mixValue = delayMix / 10;

    delayNodeRef.current.parameters
      .get("delayTime")
      ?.setValueAtTime(delayTimeSeconds, audioContext.currentTime);
    delayNodeRef.current.parameters
      .get("feedback")
      ?.setValueAtTime(feedbackValue, audioContext.currentTime);
    delayNodeRef.current.parameters
      .get("mix")
      ?.setValueAtTime(mixValue, audioContext.currentTime);

    if (dryGainRef.current && wetGainRef.current) {
      dryGainRef.current.gain.value = 1 - mixValue;
      wetGainRef.current.gain.value = mixValue;
    }
  }, [delayTime, delayFeedback, delayMix, audioContext, delayEnabled]);
}
