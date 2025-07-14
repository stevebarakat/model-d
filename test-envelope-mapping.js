// Simple test script to verify the new logarithmic envelope mapping
import {
  knobPosToValue,
  valueToKnobPos,
} from "./src/components/Knob/utils/attackDecayMapping.ts";

// Test known positions
const testPositions = [0, 1000, 2000, 4000, 6000, 8000, 10000];
const expectedValues = [1, 10, 100, 500, 1000, 3000, 10000];

// Test position to value mapping
testPositions.forEach((pos, i) => {
  const value = knobPosToValue(pos);
  const expected = expectedValues[i];
  const diff = Math.abs(value - expected);
  // Position ${pos} -> ${value.toFixed(0)}ms (expected: ${expected}ms, diff: ${diff.toFixed(1)})
});

// Test value to position mapping
expectedValues.forEach((value, i) => {
  const pos = valueToKnobPos(value);
  const expected = testPositions[i];
  const diff = Math.abs(pos - expected);
  // Value ${value}ms -> Position ${pos.toFixed(0)} (expected: ${expected}, diff: ${diff.toFixed(1)})
});

// Test logarithmic behavior
const first20Percent = knobPosToValue(2000); // 20% of knob
const last20Percent = knobPosToValue(8000); // 80% of knob
// First 20% of knob: ${first20Percent.toFixed(0)}ms
// Last 20% of knob: ${last20Percent.toFixed(0)}ms
// Ratio: ${(last20Percent / first20Percent).toFixed(1)}x

// Test round-trip accuracy
testPositions.forEach((pos) => {
  const value = knobPosToValue(pos);
  const backToPos = valueToKnobPos(value);
  const error = Math.abs(backToPos - pos);
  // Position ${pos} -> Value ${value.toFixed(0)} -> Position ${backToPos.toFixed(0)} (error: ${error.toFixed(1)})
});
