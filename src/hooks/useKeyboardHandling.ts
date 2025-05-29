import { type RefObject, useCallback, useEffect } from "react";

type Note = string;

// Temporary synth type with triggerAttack/triggerRelease methods
interface Synth {
  triggerAttack: (note: string) => void;
  triggerRelease: (note: string) => void;
}

interface KeyboardHandlingProps {
  keyboardRef: RefObject<{
    synth: Synth | null;
  }>;
  activeKeys: Note | null;
  setActiveKeys: (
    key: Note | null | ((prev: Note | null) => Note | null)
  ) => void;
}

interface KeyboardHandlingResult {
  handleKeyDown: (note: Note) => void;
  handleKeyUp: (note: Note) => void;
  handleMouseUp: () => void;
  handleMouseDown: () => void;
  keyboardRef: RefObject<{ synth: Synth | null }>;
}

export function useKeyboardHandling({
  keyboardRef,
  activeKeys,
  setActiveKeys,
}: KeyboardHandlingProps): KeyboardHandlingResult {
  const FIXED_OCTAVE = 4;

  const handleKeyDown = useCallback(
    function (note: Note) {
      if (keyboardRef.current.synth) {
        keyboardRef.current.synth.triggerAttack(note);
      }
      setActiveKeys(note);
    },
    [setActiveKeys, keyboardRef]
  );

  const handleKeyUp = useCallback(
    function (note: Note) {
      if (note === activeKeys) {
        setActiveKeys(null);
        keyboardRef.current.synth?.triggerRelease(note);
      }
    },
    [setActiveKeys, keyboardRef, activeKeys]
  );

  const handleMouseDown = useCallback(function () {}, []);

  const handleMouseUp = useCallback(
    function () {
      if (activeKeys) {
        keyboardRef.current.synth?.triggerRelease(activeKeys);
        setActiveKeys(null);
      }
    },
    [activeKeys, keyboardRef, setActiveKeys]
  );

  useEffect(() => {
    const baseKeyboardMap: { [key: string]: string } = {
      a: "C",
      w: "C#",
      s: "D",
      e: "D#",
      d: "E",
      f: "F",
      t: "F#",
      g: "G",
      y: "G#",
      h: "A",
      u: "A#",
      j: "B",
      k: "C+1",
    };

    function handleKeyboardDown(e: KeyboardEvent) {
      if (!e.key) return;
      const baseNote = baseKeyboardMap[e.key.toLowerCase()];
      if (baseNote && !e.repeat) {
        const note =
          baseNote === "C+1"
            ? `C${FIXED_OCTAVE + 1}`
            : `${baseNote}${FIXED_OCTAVE}`;
        handleKeyDown(note);
      }
    }

    function handleKeyboardUp(e: KeyboardEvent) {
      if (!e.key) return;
      const baseNote = baseKeyboardMap[e.key.toLowerCase()];
      if (baseNote) {
        const note =
          baseNote === "C+1"
            ? `C${FIXED_OCTAVE + 1}`
            : `${baseNote}${FIXED_OCTAVE}`;
        handleKeyUp(note);
      }
    }

    window.addEventListener("keydown", handleKeyboardDown);
    window.addEventListener("keyup", handleKeyboardUp);

    return function () {
      window.removeEventListener("keydown", handleKeyboardDown);
      window.removeEventListener("keyup", handleKeyboardUp);
    };
  }, [activeKeys, handleKeyUp, handleKeyDown]);

  return {
    handleKeyDown,
    handleKeyUp,
    handleMouseUp,
    handleMouseDown,
    keyboardRef,
  };
}
