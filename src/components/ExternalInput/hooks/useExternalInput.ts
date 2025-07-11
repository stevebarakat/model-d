import { useCallback, useEffect, useRef, useState } from "react";
import { useSynthStore } from "@/store/synthStore";

export function useExternalInput(
  audioContext: AudioContext | null,
  mixerNode?: AudioNode
) {
  const { mixer } = useSynthStore();
  const gainRef = useRef<GainNode | null>(null);
  const inputRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const analyzerRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | undefined>(undefined);
  const [audioLevel, setAudioLevel] = useState(0);

  // Convert linear volume (0-10) to logarithmic gain (0-1)
  const linearToLogGain = (linearVolume: number) => {
    // Convert 0-10 to 0-1
    const normalizedVolume = linearVolume / 10;
    // Convert to logarithmic scale with more usable gain values
    // At volume 0.001: gain ≈ 0.001 (-60dB)
    // At volume 1: gain ≈ 0.1 (-20dB)
    // At volume 5: gain ≈ 0.5 (-6dB)
    // At volume 10: gain = 1.0 (0dB)
    return Math.pow(normalizedVolume, 1.5) * 0.9 + 0.1;
  };

  const updateAudioLevel = useCallback(() => {
    if (!analyzerRef.current) return;

    // Only calculate level if external input is enabled and volume is above 0
    if (mixer.external.enabled && mixer.external.volume > 0) {
      const dataArray = new Uint8Array(analyzerRef.current.frequencyBinCount);
      analyzerRef.current.getByteFrequencyData(dataArray);

      // Calculate average level
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length;

      // Convert to dB scale (assuming 0-255 maps to -60dB to 0dB)
      const dbLevel = 20 * Math.log10((average + 1) / 256);
      // Normalize to 0-1 range, where 0dB is 1 and -60dB is 0
      const normalizedLevel = Math.max(0, Math.min(1, (dbLevel + 60) / 60));

      // Adjust sensitivity based on volume setting
      const volumeFactor = linearToLogGain(mixer.external.volume);
      const adjustedLevel = normalizedLevel * (1 + volumeFactor);

      setAudioLevel(adjustedLevel);
    } else {
      setAudioLevel(0);
    }

    // Schedule next update
    animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
  }, [mixer.external.enabled, mixer.external.volume]);

  // Setup audio nodes and request microphone access only when enabled
  useEffect(() => {
    async function setup() {
      if (!audioContext || audioContext.state !== "running") {
        return;
      }

      // Only proceed if external input is enabled
      if (!mixer.external.enabled) {
        return;
      }

      try {
        // Create gain node if it doesn't exist
        if (!gainRef.current) {
          gainRef.current = audioContext.createGain();
          gainRef.current.gain.value = 0; // Start muted
        }

        // Create analyzer node
        if (!analyzerRef.current) {
          analyzerRef.current = audioContext.createAnalyser();
          analyzerRef.current.fftSize = 256;
        }

        // Only request microphone access if we don't already have it
        if (
          !inputRef.current &&
          navigator.mediaDevices &&
          navigator.mediaDevices.getUserMedia
        ) {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              audio: true,
            });

            // Create new source node
            inputRef.current = audioContext.createMediaStreamSource(stream);

            // Connect the nodes
            inputRef.current.connect(gainRef.current);
            inputRef.current.connect(analyzerRef.current); // Connect to analyzer
            if (mixerNode) {
              gainRef.current.connect(mixerNode);
            } else {
              gainRef.current.connect(audioContext.destination);
            }

            // Set initial gain based on mixer state
            const initialGain = mixer.external.enabled
              ? linearToLogGain(mixer.external.volume)
              : 0;
            gainRef.current.gain.setValueAtTime(
              initialGain,
              audioContext.currentTime
            );

            // Start the audio level animation
            updateAudioLevel();
          } catch (err) {
            console.error("ExternalInput: Error accessing microphone:", err);
          }
        } else if (inputRef.current) {
          // If we already have input, just connect and start animation
          if (mixerNode) {
            gainRef.current?.connect(mixerNode);
          } else {
            gainRef.current?.connect(audioContext.destination);
          }
          updateAudioLevel();
        }
      } catch (err) {
        console.error("ExternalInput: Error in setup:", err);
      }
    }

    setup();

    return () => {
      // Clean up connections
      if (gainRef.current) {
        gainRef.current.disconnect();
        gainRef.current = null;
      }
      if (inputRef.current) {
        inputRef.current.disconnect();
        inputRef.current = null;
      }
      if (analyzerRef.current) {
        analyzerRef.current.disconnect();
        analyzerRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [
    audioContext,
    mixer.external.enabled,
    mixer.external.volume,
    mixerNode,
    updateAudioLevel,
  ]);

  // Update gain when mixer settings change
  useEffect(() => {
    if (gainRef.current) {
      const newGain = mixer.external.enabled
        ? linearToLogGain(mixer.external.volume)
        : 0;
      // Guard against NaN and non-finite values
      if (isFinite(newGain)) {
        gainRef.current.gain.setValueAtTime(
          newGain,
          audioContext?.currentTime ?? 0
        );
      } else {
        gainRef.current.gain.setValueAtTime(0, audioContext?.currentTime ?? 0);
      }
    }
  }, [mixer.external.enabled, mixer.external.volume, audioContext]);

  return { audioLevel };
}
