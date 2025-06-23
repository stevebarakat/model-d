export function getRotation(
  value: number,
  min: number,
  max: number,
  type: "arrow" | "radial" = "radial"
): number {
  const range = max - min;
  const percentage = (value - min) / range;

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
  step: number
): number {
  const range = max - min;
  let newValue = startValue + (deltaY * sensitivity * range) / 100;

  // Apply step snapping if step is defined
  if (step > 0) {
    newValue = Math.round(newValue / step) * step;
  }

  // Clamp to min/max
  return Math.min(max, Math.max(min, newValue));
}

export function calculateLabelPosition(
  tick: number,
  min: number,
  max: number,
  type: "arrow" | "radial"
): { x: number; y: number } {
  const arc = type === "arrow" ? 150 : 290;
  const startAngle = type === "arrow" ? -165 : 125;
  const angle = startAngle + ((tick - min) / (max - min)) * arc;
  const rad = (angle * Math.PI) / 180;
  const x = 50 + Math.cos(rad) * 80;
  const y = 50 + Math.sin(rad) * 80;

  return { x, y };
}

export function calculateTickAngle(
  tick: number,
  min: number,
  max: number,
  type: "arrow" | "radial"
): number {
  const arc = type === "arrow" ? 150 : 290;
  const startAngle = type === "arrow" ? -75 : -145;
  return startAngle + ((tick - min) / (max - min)) * arc;
}
