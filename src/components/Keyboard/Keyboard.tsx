import { useState, useCallback, useEffect } from "react";
import styles from "./Keyboard.module.css";
import React from "react";
import { SynthObject } from "@/store/types/synth";

type Note = {
  note: string;
  isSharp: boolean;
};

type Synth = SynthObject;

type KeyboardProps = {
  activeKeys?: string | null;
  octaveRange?: { min: number; max: number };
  onKeyDown?: (note: string) => void;
  onKeyUp?: (note: string) => void;
  onMouseDown?: () => void;
  onMouseUp?: () => void;
  synth: Synth;
  disabled?: boolean;
};

const OCTAVE_NOTES: Note[] = [
  { note: "F", isSharp: false },
  { note: "F#", isSharp: true },
  { note: "G", isSharp: false },
  { note: "G#", isSharp: true },
  { note: "A", isSharp: false },
  { note: "A#", isSharp: true },
  { note: "B", isSharp: false },
  { note: "C", isSharp: false },
  { note: "C#", isSharp: true },
  { note: "D", isSharp: false },
  { note: "D#", isSharp: true },
  { note: "E", isSharp: false },
];

const generateKeyboardKeys = (octaveRange: {
  min: number;
  max: number;
}): Note[] => {
  const keys = Array.from(
    { length: octaveRange.max - octaveRange.min + 1 },
    (_, i) => octaveRange.min + i
  ).flatMap((octave) =>
    OCTAVE_NOTES.map((key, index) => {
      // For notes after F (index >= 7), we need to use the next octave
      const adjustedOctave = index >= 7 ? octave + 1 : octave;
      return {
        note: `${key.note}${adjustedOctave}`,
        isSharp: key.isSharp,
      };
    })
  );

  // Add 8 more keys at the end to complete the octave up to C
  const lastOctave = octaveRange.max + 1;
  const extraNotes = OCTAVE_NOTES.slice(0, 7).map((key) => ({
    note: `${key.note}${lastOctave}`,
    isSharp: key.isSharp,
  }));

  // Add the final C one octave higher
  return [
    ...keys,
    ...extraNotes,
    { note: `C${lastOctave + 1}`, isSharp: false },
  ];
};

const WhiteKey = React.memo(
  ({
    isActive,
    onPointerDown,
    onPointerUp,
    onPointerEnter,
    onPointerLeave,
  }: {
    isActive: boolean;
    onPointerDown: () => void;
    onPointerUp: () => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
  }) => (
    <div
      className={`${styles.whiteKey} ${isActive ? styles.whiteKeyActive : ""}`}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  )
);

const BlackKey = React.memo(
  ({
    isActive,
    position,
    width,
    onPointerDown,
    onPointerUp,
    onPointerEnter,
    onPointerLeave,
  }: {
    isActive: boolean;
    position: number;
    width: number;
    onPointerDown: () => void;
    onPointerUp: () => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
  }) => (
    <div
      className={`${styles.blackKey} ${isActive ? styles.blackKeyActive : ""}`}
      style={{ left: `${position}%`, width: `${width}%` }}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
      onPointerEnter={onPointerEnter}
      onPointerLeave={onPointerLeave}
    />
  )
);

function Keyboard({
  activeKeys = null,
  octaveRange = { min: 1, max: 4 },
  onKeyDown = () => {},
  onKeyUp = () => {},
  onMouseDown = () => {},
  onMouseUp = () => {},
  synth,
  disabled = false,
}: KeyboardProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const FIXED_OCTAVE = 4;

  const keys = generateKeyboardKeys(octaveRange);

  const handleKeyPress = useCallback(
    (note: string): void => {
      if (disabled || isReleasing) return;
      console.log("Keyboard handleKeyPress:", note);
      synth.triggerAttack(note);
      onKeyDown(note);
    },
    [onKeyDown, synth, disabled, isReleasing]
  );

  const handleKeyRelease = useCallback(
    (note: string): void => {
      if (disabled || isReleasing || note !== activeKeys) return;
      console.log("Keyboard handleKeyRelease:", note);
      setIsReleasing(true);
      synth.triggerRelease();
      onKeyUp(note);
      setIsReleasing(false);
    },
    [onKeyUp, synth, activeKeys, disabled, isReleasing]
  );

  const handleMouseDown = useCallback((): void => {
    if (disabled || isReleasing) return;
    console.log("Keyboard handleMouseDown");
    setIsMouseDown(true);
    onMouseDown();
  }, [onMouseDown, disabled, isReleasing]);

  const handleMouseUp = useCallback((): void => {
    if (disabled || isReleasing) return;
    console.log("Keyboard handleMouseUp");
    setIsMouseDown(false);
    if (activeKeys) {
      setIsReleasing(true);
      synth.triggerRelease();
      onKeyUp(activeKeys);
      setIsReleasing(false);
    }
    onMouseUp();
  }, [activeKeys, onKeyUp, onMouseUp, synth, disabled, isReleasing]);

  const handleMouseLeave = useCallback((): void => {
    if (disabled || isReleasing) return;
    console.log("Keyboard handleMouseLeave");
    if (isMouseDown) {
      setIsMouseDown(false);
      if (activeKeys) {
        setIsReleasing(true);
        synth.triggerRelease();
        onKeyUp(activeKeys);
        setIsReleasing(false);
      }
      onMouseUp();
    }
  }, [
    isMouseDown,
    activeKeys,
    onKeyUp,
    onMouseUp,
    synth,
    disabled,
    isReleasing,
  ]);

  const handleKeyInteraction = useCallback(
    (note: string): void => {
      if (disabled) return;
      if (isMouseDown) {
        handleKeyPress(note);
      }
    },
    [isMouseDown, handleKeyPress, disabled]
  );

  const handleKeyLeave = useCallback(
    (note: string): void => {
      if (disabled) return;
      if (isMouseDown) {
        handleKeyRelease(note);
      }
    },
    [isMouseDown, handleKeyRelease, disabled]
  );

  useEffect(() => {
    const baseKeyboardMap: { [key: string]: string } = {
      a: "F",
      w: "F#",
      s: "G",
      e: "G#",
      d: "A",
      r: "A#",
      f: "B",
      g: "C",
      y: "C#",
      h: "D",
      u: "D#",
      j: "E",
      k: "F+1",
    };

    function handleKeyboardDown(e: KeyboardEvent) {
      if (!e.key) return;
      const baseNote = baseKeyboardMap[e.key.toLowerCase()];
      if (baseNote && !e.repeat) {
        const note =
          baseNote === "F+1"
            ? `F${FIXED_OCTAVE + 1}`
            : baseNote === "C" ||
              baseNote === "C#" ||
              baseNote === "D" ||
              baseNote === "D#" ||
              baseNote === "E"
            ? `${baseNote}${FIXED_OCTAVE + 1}`
            : `${baseNote}${FIXED_OCTAVE}`;
        handleKeyPress(note);
      }
    }

    function handleKeyboardUp(e: KeyboardEvent) {
      if (!e.key) return;
      const baseNote = baseKeyboardMap[e.key.toLowerCase()];
      if (baseNote) {
        const note =
          baseNote === "F+1"
            ? `F${FIXED_OCTAVE + 1}`
            : baseNote === "C" ||
              baseNote === "C#" ||
              baseNote === "D" ||
              baseNote === "D#" ||
              baseNote === "E"
            ? `${baseNote}${FIXED_OCTAVE + 1}`
            : `${baseNote}${FIXED_OCTAVE}`;
        handleKeyRelease(note);
      }
    }

    window.addEventListener("keydown", handleKeyboardDown);
    window.addEventListener("keyup", handleKeyboardUp);

    return function () {
      window.removeEventListener("keydown", handleKeyboardDown);
      window.removeEventListener("keyup", handleKeyboardUp);
    };
  }, [handleKeyPress, handleKeyRelease]);

  const renderWhiteKeys = useCallback(() => {
    return keys
      .filter((key) => !key.isSharp)
      .map((key, index) => {
        const isActive = activeKeys === key.note;
        return (
          <WhiteKey
            key={`white-${key.note}-${index}`}
            isActive={isActive}
            onPointerDown={() => {
              handleMouseDown();
              handleKeyPress(key.note);
            }}
            onPointerUp={() => handleKeyRelease(key.note)}
            onPointerEnter={() => handleKeyInteraction(key.note)}
            onPointerLeave={() => handleKeyLeave(key.note)}
          />
        );
      });
  }, [
    keys,
    activeKeys,
    handleMouseDown,
    handleKeyPress,
    handleKeyRelease,
    handleKeyInteraction,
    handleKeyLeave,
  ]);

  const renderBlackKeys = useCallback(() => {
    const whiteKeyWidth = 100 / keys.filter((key) => !key.isSharp).length;

    return keys
      .filter((key) => key.isSharp)
      .map((key, index) => {
        const isActive = activeKeys === key.note;
        const keyIndex = keys.findIndex((k) => k.note === key.note);
        const whiteKeysBefore = keys
          .slice(0, keyIndex)
          .filter((k) => !k.isSharp).length;
        const position = (whiteKeysBefore - 0.3) * whiteKeyWidth;

        return (
          <BlackKey
            key={`black-${key.note}-${index}`}
            isActive={isActive}
            position={position}
            width={whiteKeyWidth * 0.7}
            onPointerDown={() => {
              handleMouseDown();
              handleKeyPress(key.note);
            }}
            onPointerUp={() => handleKeyRelease(key.note)}
            onPointerEnter={() => handleKeyInteraction(key.note)}
            onPointerLeave={() => handleKeyLeave(key.note)}
          />
        );
      });
  }, [
    keys,
    activeKeys,
    handleMouseDown,
    handleKeyPress,
    handleKeyRelease,
    handleKeyInteraction,
    handleKeyLeave,
  ]);

  return (
    <div
      className={
        styles.keyboardContainer + (disabled ? " " + styles.disabled : "")
      }
      onPointerUp={handleMouseUp}
      onPointerLeave={handleMouseLeave}
    >
      <div className={styles.keyboard}>
        <div className={styles.pianoKeys}>
          <div className={styles.leftShadow} />
          {renderWhiteKeys()}
          <div className={styles.rightShadow} />
          {renderBlackKeys()}
        </div>
      </div>
    </div>
  );
}

export default Keyboard;
