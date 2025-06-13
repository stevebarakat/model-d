import { useEffect, useRef, useState } from "react";

export function useAudioContext() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const initialize = async () => {
    try {
      console.log("Initializing AudioContext...");
      if (!audioContextRef.current) {
        console.log("Creating new AudioContext");
        audioContextRef.current = new AudioContext();
      }

      console.log("AudioContext state:", audioContextRef.current.state);
      if (audioContextRef.current.state === "suspended") {
        console.log("Resuming suspended AudioContext");
        await audioContextRef.current.resume();
        console.log(
          "AudioContext state after resume:",
          audioContextRef.current.state
        );
      }

      setIsInitialized(true);
      console.log("AudioContext initialization complete");
    } catch (error) {
      console.error("Error initializing AudioContext:", error);
    }
  };

  const dispose = async () => {
    console.log("Disposing AudioContext...");
    if (audioContextRef.current) {
      console.log(
        "AudioContext state before close:",
        audioContextRef.current.state
      );
      await audioContextRef.current.close();
      console.log("AudioContext closed");
      audioContextRef.current = null;
      setIsInitialized(false);
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
    dispose,
  };
}
