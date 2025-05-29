import { useEffect, useRef, useState } from "react";

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initialize = async () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }

      if (audioContextRef.current.state === "suspended") {
        await audioContextRef.current.resume();
      }

      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing AudioContext:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
        setIsInitialized(false);
      }
    };
  }, []);

  return {
    audioContext: audioContextRef.current,
    isInitialized,
    initialize,
  };
}
