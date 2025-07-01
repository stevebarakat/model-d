// Helper: Convert note name (e.g., 'C4') to MIDI number
export function noteNameToMidi(note: string): number {
  const noteMap: Record<string, number> = {
    C: 0,
    "C#": 1,
    D: 2,
    "D#": 3,
    E: 4,
    F: 5,
    "F#": 6,
    G: 7,
    "G#": 8,
    A: 9,
    "A#": 10,
    B: 11,
  };
  const match = note.match(/^([A-G]#?)(-?\d+)$/);
  if (!match) return 60; // default to C4
  const [, n, oct] = match;
  return 12 * (parseInt(oct, 10) + 1) + noteMap[n];
}

// Helper to map internal waveform names to Web Audio API types
export function mapOscillatorType(waveform: string): OscillatorType {
  switch (waveform) {
    case "triangle":
      return "triangle";
    case "sawtooth":
      return "sawtooth";
    case "pulse1":
    case "pulse2":
    case "pulse3":
      return "square";
    default:
      return "sine"; // fallback for custom or unsupported types
  }
}

// Helper to map knob values (0-10) to time values (5ms to 10s)
export function mapEnvelopeTime(value: number): number {
  // Map 0-10 to 0.005-10 seconds logarithmically
  const minTime = 0.005; // 5ms
  const maxTime = 10; // 10s
  return minTime * Math.pow(maxTime / minTime, value / 10);
}

// Helper to map 0-10 to 20 Hz - 20,000 Hz logarithmically
// Enhanced for fatter sound with slightly warmer default
export function mapCutoff(val: number): number {
  const minFreq = 20;
  const maxFreq = 20000;
  // Slightly boost the cutoff for a fatter, more present sound
  const boostedVal = Math.min(10, val + 0.5);
  return minFreq * Math.pow(maxFreq / minFreq, boostedVal / 10);
}

// Helper to map 0-10 to a modulation amount (octaves above base cutoff)
export function mapContourAmount(val: number): number {
  // 0 = no envelope, 10 = up to 4 octaves above base cutoff
  return val * 0.4; // 0-4 octaves
}
