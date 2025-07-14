// Test script to demonstrate the fix for attackDecay knob rotation
// This shows the rotation values before and after the fix

// Simulate the old behavior (before fix)
function getRotationOld(value, min, max, type, logarithmic) {
  let percentage;

  if (logarithmic) {
    // Logarithmic scaling
    const logMin = Math.log(min);
    const logMax = Math.log(max);
    const logValue = Math.log(value);
    percentage = (logValue - logMin) / (logMax - logMin);
  } else {
    // Linear scaling (this was the problem for attackDecay)
    const range = max - min;
    percentage = (value - min) / range;
  }

  if (type === "arrow") {
    return percentage * 150 - 75;
  } else {
    return percentage * 290 - 145;
  }
}

// Simulate the new behavior (after fix)
function getRotationNew(value, min, max, type, logarithmic) {
  let percentage;

  if (type === "attackDecay") {
    // For attackDecay, the value is already a knob position (0-10000)
    // Convert it to a percentage based on the position range
    percentage = (value - min) / (max - min);
  } else if (logarithmic) {
    // Use logarithmic scaling for visual rotation to match the control behavior
    const logMin = Math.log(min);
    const logMax = Math.log(max);
    const logValue = Math.log(value);
    percentage = (logValue - logMin) / (logMax - logMin);
  } else {
    // Linear scaling (original behavior)
    const range = max - min;
    percentage = (value - min) / range;
  }

  if (type === "arrow") {
    return percentage * 150 - 75;
  } else {
    return percentage * 290 - 145;
  }
}

// Test values from attackDecayStops
const testValues = [
  { pos: 0, value: 0 },
  { pos: 1000, value: 10 },
  { pos: 2000, value: 200 },
  { pos: 4000, value: 600 },
  { pos: 6000, value: 1000 },
  { pos: 8000, value: 5000 },
  { pos: 10000, value: 10000 },
];

console.log("AttackDecay Knob Rotation Fix Demonstration");
console.log("===========================================");
console.log();

console.log("Test Values (Position -> Actual Value):");
testValues.forEach(({ pos, value }) => {
  console.log(`  Position ${pos} -> Value ${value}`);
});
console.log();

console.log("Rotation Values Comparison:");
console.log("Position | Old Rotation | New Rotation | Difference");
console.log("---------|--------------|--------------|------------");

testValues.forEach(({ pos, value }) => {
  // Old behavior: used actual value (0-10000) with linear scaling
  const oldRotation = getRotationOld(value, 0, 10000, "radial", false);

  // New behavior: uses knob position (0-10000) with linear scaling
  const newRotation = getRotationNew(pos, 0, 10000, "radial", false);

  const difference = newRotation - oldRotation;

  console.log(
    `${pos.toString().padStart(7)} | ${oldRotation
      .toString()
      .padStart(11)} | ${newRotation.toString().padStart(11)} | ${difference
      .toString()
      .padStart(10)}`
  );
});

console.log();
console.log(
  "The fix ensures that knob rotation is linear with respect to knob position,"
);
console.log(
  "making the control feel smooth and consistent throughout its range."
);
