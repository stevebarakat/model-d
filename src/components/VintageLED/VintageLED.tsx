import { useState, useEffect } from "react";
import { cn } from "../../utils/helpers";
import styles from "./VintageLED.module.css";

export type LEDColor = "red" | "green" | "amber" | "blue";
export type LEDSize = "small" | "medium" | "large";

export interface VintageLEDProps {
  /** The color of the LED */
  color?: LEDColor;
  /** Whether the LED is on or off */
  isOn?: boolean;
  /** The size of the LED */
  size?: LEDSize;
  /** Whether to animate the warm-up effect when turning on */
  warmupEffect?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Label text for the LED (optional) */
  label?: string;
  /** Position of the label relative to the LED */
  labelPosition?: "top" | "right" | "bottom" | "left";
  /** Click handler for the LED */
  onCheckedChange: (e: React.FormEvent<HTMLInputElement>) => void;
}

/**
 * VintageLED component that simulates the appearance of old-school indicator lights
 */
export function VintageLED({
  color = "red",
  isOn = true,
  size = "medium",
  warmupEffect = true,
  className = "",
  label,
  onCheckedChange,
}: VintageLEDProps) {
  const [isWarmedUp, setIsWarmedUp] = useState(isOn && !warmupEffect);

  useEffect(() => {
    let warmupTimer: ReturnType<typeof setTimeout>;

    if (isOn && warmupEffect) {
      setIsWarmedUp(false);
      warmupTimer = setTimeout(() => {
        setIsWarmedUp(true);
      }, 150);
    } else if (!isOn) {
      setIsWarmedUp(false);
    }

    return () => {
      clearTimeout(warmupTimer);
    };
  }, [isOn, warmupEffect]);

  const ledClasses = cn(
    styles.vintageLed,
    styles[`vintageLed${color.charAt(0).toUpperCase() + color.slice(1)}`],
    styles[`vintageLed${size.charAt(0).toUpperCase() + size.slice(1)}`],
    isOn ? styles.vintageLedOn : "",
    isWarmedUp && styles.vintageLedWarmedUp,
    className
  );

  return (
    <div>
      <div className={ledClasses}>
        <input
          type="checkbox"
          className={styles.vintageLedInput}
          onChange={onCheckedChange}
        />
        <div className={styles.vintageLedInner}>
          <div className={styles.vintageLedGlow}></div>
          <div className={styles.vintageLedReflection}></div>
        </div>
      </div>
      {label && <span className={styles.vintageLedLabel}>{label}</span>}
    </div>
  );
}
