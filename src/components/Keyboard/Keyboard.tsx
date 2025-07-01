import { useState, useCallback, useEffect } from "react";
import styles from "./Keyboard.module.css";
import type { KeyboardProps } from "./types";
import { WhiteKey, BlackKey } from "./components";
import {
  generateKeyboardKeys,
  getNoteFromKeyEvent,
  calculateBlackKeyPosition,
  FIXED_OCTAVE,
} from "./utils";

export function Keyboard({
  activeKeys = null,
  octaveRange = { min: 1, max: 4 },
  onKeyDown = () => {},
  onKeyUp = () => {},
  onMouseDown = () => {},
  onMouseUp = () => {},
  synth,
}: KeyboardProps) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isReleasing, setIsReleasing] = useState(false);
  const [pressedKeys, setPressedKeys] = useState<string[]>([]); // Track all pressed keys
  const keys = generateKeyboardKeys(octaveRange);

  const handleKeyPress = useCallback(
    (note: string): void => {
      if (isReleasing) return;

      // Add the new key to pressed keys
      setPressedKeys((prev) => {
        const newPressedKeys = prev.includes(note) ? prev : [...prev, note];
        return newPressedKeys;
      });

      if (activeKeys && activeKeys !== note) {
        // Legato mode: change pitch of current note instead of creating new note
        synth.triggerAttack(note);
        onKeyDown(note);
      } else if (!activeKeys) {
        // First key press: start a new note
        synth.triggerAttack(note);
        onKeyDown(note);
      }
    },
    [onKeyDown, synth, isReleasing, activeKeys]
  );

  const handleKeyRelease = useCallback(
    (note: string): void => {
      if (isReleasing) return;

      // Remove the released key from pressed keys
      setPressedKeys((prev) => {
        const newPressedKeys = prev.filter((key) => key !== note);
        return newPressedKeys;
      });

      if (note === activeKeys) {
        // If releasing the currently active key, check if there are other pressed keys
        const remainingKeys = pressedKeys.filter((key) => key !== note);

        if (remainingKeys.length > 0) {
          // Switch to the most recently pressed remaining key (last in array)
          const nextKey = remainingKeys[remainingKeys.length - 1];
          synth.triggerAttack(nextKey);
          onKeyDown(nextKey);
        } else {
          // No more keys pressed, release the note
          setIsReleasing(true);
          synth.triggerRelease(note);
          onKeyUp(note);
          setIsReleasing(false);
        }
      }
    },
    [onKeyUp, synth, activeKeys, isReleasing, pressedKeys]
  );

  const handleMouseDown = useCallback((): void => {
    if (isReleasing) return;
    setIsMouseDown(true);
    onMouseDown();
  }, [onMouseDown, isReleasing]);

  const handleMouseUp = useCallback((): void => {
    if (isReleasing) return;
    setIsMouseDown(false);
    if (activeKeys && pressedKeys.length === 0) {
      // Only release if no keys are pressed
      setIsReleasing(true);
      synth.triggerRelease(activeKeys);
      onKeyUp(activeKeys);
      setIsReleasing(false);
    }
    onMouseUp();
  }, [activeKeys, onKeyUp, onMouseUp, synth, isReleasing, pressedKeys]);

  const handleMouseLeave = useCallback((): void => {
    if (isReleasing) return;
    if (isMouseDown) {
      setIsMouseDown(false);
      if (activeKeys && pressedKeys.length === 0) {
        // Only release if no keys are pressed
        setIsReleasing(true);
        synth.triggerRelease(activeKeys);
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
    isReleasing,
    pressedKeys,
  ]);

  const handleKeyInteraction = useCallback(
    (note: string): void => {
      if (isMouseDown) {
        handleKeyPress(note);
      }
    },
    [isMouseDown, handleKeyPress]
  );

  const handleKeyLeave = useCallback(
    (note: string): void => {
      if (isMouseDown) {
        handleKeyRelease(note);
      }
    },
    [isMouseDown, handleKeyRelease]
  );

  useEffect(() => {
    function handleKeyboardDown(e: KeyboardEvent) {
      if (!e.key) return;
      const note = getNoteFromKeyEvent(e.key, FIXED_OCTAVE);
      if (note && !e.repeat) {
        handleKeyPress(note);
      }
    }

    function handleKeyboardUp(e: KeyboardEvent) {
      if (!e.key) return;
      const note = getNoteFromKeyEvent(e.key, FIXED_OCTAVE);
      if (note) {
        handleKeyRelease(note);
      }
    }

    window.addEventListener("keydown", handleKeyboardDown);
    window.addEventListener("keyup", handleKeyboardUp);

    return () => {
      window.removeEventListener("keydown", handleKeyboardDown);
      window.removeEventListener("keyup", handleKeyboardUp);
    };
  }, [handleKeyPress, handleKeyRelease]);

  const renderWhiteKeys = useCallback(() => {
    return keys
      .filter((key) => !key.isSharp)
      .map((key, index) => (
        <WhiteKey
          key={`white-${key.note}-${index}`}
          isActive={activeKeys === key.note}
          onPointerDown={() => {
            handleMouseDown();
            handleKeyPress(key.note);
          }}
          onPointerUp={() => handleKeyRelease(key.note)}
          onPointerEnter={() => handleKeyInteraction(key.note)}
          onPointerLeave={() => handleKeyLeave(key.note)}
        />
      ));
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
    const whiteKeys = keys.filter((key) => !key.isSharp);
    const whiteKeyWidth = 100 / whiteKeys.length;

    return keys
      .map((key, idx) => ({ ...key, idx }))
      .filter((key) => key.isSharp)
      .map((blackKey, bIdx) => {
        const positionData = calculateBlackKeyPosition(
          blackKey.idx,
          keys,
          whiteKeyWidth
        );
        if (!positionData) return null;

        return (
          <BlackKey
            key={`black-${blackKey.note}-${bIdx}`}
            isActive={activeKeys === blackKey.note}
            position={positionData.position}
            width={positionData.width}
            onPointerDown={() => {
              handleMouseDown();
              handleKeyPress(blackKey.note);
            }}
            onPointerUp={() => handleKeyRelease(blackKey.note)}
            onPointerEnter={() => handleKeyInteraction(blackKey.note)}
            onPointerLeave={() => handleKeyLeave(blackKey.note)}
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
      className={styles.keyboardContainer}
      onPointerUp={handleMouseUp}
      onPointerLeave={handleMouseLeave}
    >
      <div className={styles.keyboard}>
        <div className={styles.pianoKeys}>
          {renderWhiteKeys()}
          {renderBlackKeys()}
          <div className={styles.leftShadow} />
          <div className={styles.rightShadow} />
        </div>
      </div>
    </div>
  );
}

export default Keyboard;
