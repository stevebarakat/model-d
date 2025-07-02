import { useEffect, useRef, useState } from "react";
import { useSynthStore } from "@/store/synthStore";

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const setIsDisabled = useSynthStore((state) => state.setIsDisabled);

  const initialize = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      // Register the worklet processor (await to ensure it's loaded)
      await audioContextRef.current.audioWorklet.addModule(
        "/moog-filter/worklet-processor.js"
      );

      setIsInitialized(true);
      setIsDisabled(false);
    } catch (error) {
      console.error("Error initializing AudioContext:", error);
    }
  };

  const dispose = async () => {
    if (audioContextRef.current) {
      await audioContextRef.current.close();
      audioContextRef.current = null;
      setIsInitialized(false);
      setIsDisabled(true);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        setIsInitialized(false);
        setIsDisabled(true);
      }
    };
  }, [setIsDisabled]);

  return {
    audioContext: audioContextRef.current,
    isInitialized,
    initialize,
    dispose,
  };
}
