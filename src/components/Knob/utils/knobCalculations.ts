// Logarithmic scaling utility functions
export function toLogarithmic(value: number, min: number, max: number): number {
  if (min <= 0 || max <= 0) {
    // Fallback to linear scaling for non-positive ranges
    return value;
  }
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  const logValue = Math.log(value);
  return (logValue - logMin) / (logMax - logMin);
}

export function fromLogarithmic(
  normalizedValue: number,
  min: number,
  max: number
): number {
  if (min <= 0 || max <= 0) {
    // Fallback to linear scaling for non-positive ranges
    return min + normalizedValue * (max - min);
  }
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  const logValue = logMin + normalizedValue * (logMax - logMin);
  return Math.exp(logValue);
}

export function getRotation(
  value: number,
  min: number,
  max: number,
  type: "arrow" | "radial" = "radial",
  logarithmic: boolean = false
): number {
  let percentage: number;

  if (logarithmic) {
    percentage = toLogarithmic(value, min, max);
  } else {
    const range = max - min;
    percentage = (value - min) / range;
  }

  if (type === "arrow") {
    return percentage * 150 - 75; // -75 to +75 degrees (9:30 to 2:30)
  } else {
    return percentage * 300 - 150; // -150 to +150 degrees (7:15 to 4:45)
  }
}

export function getDisplayValue(
  value: number,
  step: number,
  unit: string,
  valueLabels?: Record<number, string | React.ReactElement>
): string | React.ReactElement {
  if (valueLabels?.[Math.round(value)]) {
    return valueLabels[Math.round(value)];
  }
  return value.toFixed(step >= 1 ? 0 : 2) + (unit ? ` ${unit}` : "");
}

export function getSensitivity(
  max: number,
  min: number,
  size: "small" | "medium" | "large"
): number {
  const range = max - min;
  const knobSize = size === "small" ? 32 : size === "medium" ? 40 : 48;
  return (range / 100) * (196 / knobSize);
}

export function calculateValueFromDelta(
  deltaY: number,
  startValue: number,
  sensitivity: number,
  min: number,
  max: number,
  step: number,
  type: "radial" | "arrow" = "radial",
  logarithmic: boolean = false
): number {
  let newValue: number;

  if (logarithmic) {
    // For logarithmic scaling, we need to work with the normalized value
    const normalizedStart = toLogarithmic(startValue, min, max);
    const range = 1; // Normalized range is always 0-1
    const normalizedDelta = (deltaY * sensitivity * range) / 200;
    const normalizedNew = Math.max(
      0,
      Math.min(1, normalizedStart + normalizedDelta)
    );
    newValue = fromLogarithmic(normalizedNew, min, max);
  } else {
    const range = max - min;
    newValue = startValue + (deltaY * sensitivity * range) / 200;
  }

  // Apply step snapping only for arrow knobs
  if (type === "arrow" && step > 0) {
    // Use a more precise method to avoid floating-point errors
    const steps = Math.round(newValue / step);
    newValue = steps * step;

    // Fix floating-point precision issues by rounding to appropriate decimal places
    const decimalPlaces = step < 1 ? Math.abs(Math.floor(Math.log10(step))) : 0;
    newValue =
      Math.round(newValue * Math.pow(10, decimalPlaces)) /
      Math.pow(10, decimalPlaces);
  }

  // Clamp to min/max
  return Math.min(max, Math.max(min, newValue));
}

export function calculateLabelPosition(
  tick: number,
  min: number,
  max: number,
  type: "arrow" | "radial",
  logarithmic: boolean = false
): { x: number; y: number } {
  let percentage: number;

  if (logarithmic) {
    percentage = toLogarithmic(tick, min, max);
  } else {
    percentage = (tick - min) / (max - min);
  }

  const arc = type === "arrow" ? 150 : 290;
  const startAngle = type === "arrow" ? -165 : 125;
  const angle = startAngle + percentage * arc;
  const rad = (angle * Math.PI) / 180;
  const x = 50 + Math.cos(rad) * 80;
  const y = 50 + Math.sin(rad) * 80;

  return { x, y };
}

export function calculateTickAngle(
  tick: number,
  min: number,
  max: number,
  type: "arrow" | "radial",
  logarithmic: boolean = false
): number {
  let percentage: number;

  if (logarithmic) {
    percentage = toLogarithmic(tick, min, max);
  } else {
    percentage = (tick - min) / (max - min);
  }

  const arc = type === "arrow" ? 150 : 290;
  const startAngle = type === "arrow" ? -75 : -145;
  return startAngle + percentage * arc;
}
