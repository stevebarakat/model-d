// Simple test script to verify the new logarithmic envelope mapping
import {
  knobPosToValue,
  valueToKnobPos,
} from "./src/components/Knob/utils/attackDecayMapping.ts";

console.log("Testing new logarithmic envelope mapping...\n");

// Test known positions
const testPositions = [0, 1000, 2000, 4000, 6000, 8000, 10000];
const expectedValues = [1, 10, 100, 500, 1000, 3000, 10000];

console.log("Position -> Value mapping:");
testPositions.forEach((pos, i) => {
  const value = knobPosToValue(pos);
  const expected = expectedValues[i];
  const diff = Math.abs(value - expected);
  console.log(
    `Position ${pos} -> ${value.toFixed(
      0
    )}ms (expected: ${expected}ms, diff: ${diff.toFixed(1)})`
  );
});

console.log("\nValue -> Position mapping:");
expectedValues.forEach((value, i) => {
  const pos = valueToKnobPos(value);
  const expected = testPositions[i];
  const diff = Math.abs(pos - expected);
  console.log(
    `Value ${value}ms -> Position ${pos.toFixed(
      0
    )} (expected: ${expected}, diff: ${diff.toFixed(1)})`
  );
});

console.log("\nTesting logarithmic behavior:");
const first20Percent = knobPosToValue(2000); // 20% of knob
const last20Percent = knobPosToValue(8000); // 80% of knob
console.log(`First 20% of knob: ${first20Percent.toFixed(0)}ms`);
console.log(`Last 20% of knob: ${last20Percent.toFixed(0)}ms`);
console.log(`Ratio: ${(last20Percent / first20Percent).toFixed(1)}x`);

console.log("\nTesting round-trip accuracy:");
testPositions.forEach((pos) => {
  const value = knobPosToValue(pos);
  const backToPos = valueToKnobPos(value);
  const error = Math.abs(backToPos - pos);
  console.log(
    `Position ${pos} -> Value ${value.toFixed(
      0
    )} -> Position ${backToPos.toFixed(0)} (error: ${error.toFixed(1)})`
  );
});
