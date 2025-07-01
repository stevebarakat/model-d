import { useState, useEffect } from "react";
import { cn, cssModule } from "@/utils/helpers";
import styles from "./VintageLED.module.css";
import Title from "../Title";

export type LEDSize = "small" | "medium" | "large";

export type VintageLEDProps = {
  /** Whether the LED is on or off */
  isOn?: boolean;
  /** Whether to animate the warm-up effect when turning on */
  warmupEffect?: boolean;
  /** Additional CSS class names */
  className?: string;
  /** Label text for the LED (optional) */
  label?: string;
  /** Click handler for the LED */
  onCheckedChange: (e: React.FormEvent<HTMLInputElement>) => void;
};

/**
 * VintageLED component that simulates the appearance of old-school indicator lights
 */
function VintageLED({
  isOn = true,
  warmupEffect = true,
  className,
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

  // Using the new cssModule utility for better conditional class handling
  const ledClasses = cssModule(
    styles,
    "vintageLed",
    `vintageLedRed`,
    `vintageLedLarge`,
    isOn && "vintageLedOn",
    isWarmedUp && "vintageLedWarmedUp"
  );

  // Using cn utility for combining with external className
  const containerClasses = cn(ledClasses, className);

  return (
    <div className={styles.container}>
      <div className={containerClasses}>
        <input
          type="checkbox"
          className={styles.vintageLedInput}
          checked={isOn}
          onChange={onCheckedChange}
        />
        <div className={styles.vintageLedInner}>
          <div className={styles.vintageLedGlow}></div>
          <div className={styles.vintageLedReflection}></div>
        </div>
      </div>

      <Title size="sm" style={{ marginTop: "var(--spacing-xs)" }}>
        {label}
      </Title>
    </div>
  );
}

export default VintageLED;
