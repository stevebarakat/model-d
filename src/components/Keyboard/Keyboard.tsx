import { useState, useCallback, useEffect } from "react";
import styles from "./Keyboard.module.css";
import type { KeyboardProps } from "./types";
import WhiteKey from "./WhiteKey";
import BlackKey from "./BlackKey";
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
  const keys = generateKeyboardKeys(octaveRange);

  const handleKeyPress = useCallback(
    (note: string): void => {
      if (isReleasing) return;

      if (activeKeys && activeKeys !== note) {
        synth.triggerRelease(activeKeys);
      }

      synth.triggerAttack(note);
      onKeyDown(note);
    },
    [onKeyDown, synth, isReleasing, activeKeys]
  );

  const handleKeyRelease = useCallback(
    (note: string): void => {
      if (isReleasing || note !== activeKeys) return;
      setIsReleasing(true);
      synth.triggerRelease(note);
      onKeyUp(note);
      setIsReleasing(false);
    },
    [onKeyUp, synth, activeKeys, isReleasing]
  );

  const handleMouseDown = useCallback((): void => {
    if (isReleasing) return;
    setIsMouseDown(true);
    onMouseDown();
  }, [onMouseDown, isReleasing]);

  const handleMouseUp = useCallback((): void => {
    if (isReleasing) return;
    setIsMouseDown(false);
    if (activeKeys) {
      setIsReleasing(true);
      synth.triggerRelease(activeKeys);
      onKeyUp(activeKeys);
      setIsReleasing(false);
    }
    onMouseUp();
  }, [activeKeys, onKeyUp, onMouseUp, synth, isReleasing]);

  const handleMouseLeave = useCallback((): void => {
    if (isReleasing) return;
    if (isMouseDown) {
      setIsMouseDown(false);
      if (activeKeys) {
        setIsReleasing(true);
        synth.triggerRelease(activeKeys);
        onKeyUp(activeKeys);
        setIsReleasing(false);
      }
      onMouseUp();
    }
  }, [isMouseDown, activeKeys, onKeyUp, onMouseUp, synth, isReleasing]);

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
