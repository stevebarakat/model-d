import type { Note } from "./types";

export const OCTAVE_NOTES: Note[] = [
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

export const FIXED_OCTAVE = 4;

export const BASE_KEYBOARD_MAP: { [key: string]: string } = {
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

export function generateKeyboardKeys(octaveRange: {
  min: number;
  max: number;
}): Note[] {
  const keys = Array.from(
    { length: octaveRange.max - octaveRange.min + 1 },
    (_, i) => octaveRange.min + i
  ).flatMap((octave) =>
    OCTAVE_NOTES.map((key, index) => {
      const adjustedOctave = index >= 7 ? octave + 1 : octave;
      return {
        note: `${key.note}${adjustedOctave}`,
        isSharp: key.isSharp,
      };
    })
  );

  const lastOctave = octaveRange.max + 1;
  const extraNotes = OCTAVE_NOTES.slice(0, 7).map((key) => ({
    note: `${key.note}${lastOctave}`,
    isSharp: key.isSharp,
  }));

  return [
    ...keys,
    ...extraNotes,
    { note: `C${lastOctave + 1}`, isSharp: false },
  ];
}

export function getNoteFromKeyEvent(
  key: string,
  fixedOctave: number
): string | null {
  const baseNote = BASE_KEYBOARD_MAP[key.toLowerCase()];
  if (!baseNote) return null;

  if (baseNote === "F+1") {
    return `F${fixedOctave + 1}`;
  }

  const isHigherOctave = ["C", "C#", "D", "D#", "E"].includes(baseNote);
  return `${baseNote}${isHigherOctave ? fixedOctave + 1 : fixedOctave}`;
}

export function calculateBlackKeyPosition(
  blackKeyIndex: number,
  keys: Note[],
  whiteKeyWidth: number
): { position: number; width: number } | null {
  const keyIndexToWhiteIndex: { [index: number]: number } = {};
  let whiteIdx = 0;

  keys.forEach((key, idx) => {
    if (!key.isSharp) {
      keyIndexToWhiteIndex[idx] = whiteIdx;
      whiteIdx++;
    }
  });

  let prevWhiteIdx = blackKeyIndex - 1;
  while (prevWhiteIdx >= 0 && keys[prevWhiteIdx].isSharp) {
    prevWhiteIdx--;
  }

  let nextWhiteIdx = blackKeyIndex + 1;
  while (nextWhiteIdx < keys.length && keys[nextWhiteIdx].isSharp) {
    nextWhiteIdx++;
  }

  const leftWhiteIndex = keyIndexToWhiteIndex[prevWhiteIdx];
  const rightWhiteIndex = keyIndexToWhiteIndex[nextWhiteIdx];

  if (leftWhiteIndex === undefined || rightWhiteIndex === undefined) {
    return null;
  }

  const position =
    ((leftWhiteIndex + rightWhiteIndex + 1) / 2) * whiteKeyWidth -
    whiteKeyWidth * 0.35;
  return {
    position,
    width: whiteKeyWidth * 0.7,
  };
}
