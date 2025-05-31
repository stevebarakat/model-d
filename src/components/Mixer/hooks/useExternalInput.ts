import { useEffect, useRef, useState } from "react";
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
    // Convert to logarithmic scale, with a minimum gain of 0.001 (-60dB)
    return Math.pow(normalizedVolume, 2) * 0.999 + 0.001;
  };

  const updateAudioLevel = () => {
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
  };

  useEffect(() => {
    async function setup() {
      if (!audioContext) return;

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

        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
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
            gainRef.current.gain.value = mixer.external.enabled
              ? linearToLogGain(mixer.external.volume)
              : 0;

            // Start the audio level animation
            updateAudioLevel();
          } catch (err) {
            console.error("Error accessing microphone:", err);
          }
        }
      } catch (err) {
        console.error("Error in setup:", err);
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
  }, [audioContext, mixer.external.enabled, mixer.external.volume, mixerNode]);

  // Update gain when mixer settings change
  useEffect(() => {
    if (gainRef.current) {
      const newGain = mixer.external.enabled
        ? linearToLogGain(mixer.external.volume)
        : 0;
      gainRef.current.gain.setValueAtTime(
        newGain,
        audioContext?.currentTime ?? 0
      );
    }
  }, [mixer.external.enabled, mixer.external.volume, audioContext]);

  return { audioLevel };
}
