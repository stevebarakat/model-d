import { cn, cssModule } from "@/utils/helpers";
import styles from "./LedIndicator.module.css";

type LedIndicatorProps = {
  isEnabled: boolean;
  volume: number;
  audioLevel: number;
  label?: string;
  style?: React.CSSProperties;
};

function LedIndicator({
  isEnabled,
  volume,
  audioLevel,
  label,
  style,
}: LedIndicatorProps) {
  // Determine if LED should be on based on enabled state and volume
  const isOn = isEnabled && volume > 0;

  // Calculate intensity based on audio level (0-1)
  // Make it more responsive by using audioLevel directly
  const intensity = Math.min(1, Math.max(0, audioLevel));

  // Using the cssModule utility for better conditional class handling
  const ledClasses = cssModule(
    styles,
    "vintageLed",
    "vintageLedYellow",
    "vintageLedLarge",
    isOn && "vintageLedOn"
  );

  // Using cn utility for combining with external style
  const containerClasses = cn(styles.container, style);

  return (
    <div className={containerClasses}>
      {label && <span className={styles.label}>{label}</span>}
      <div
        className={ledClasses}
        style={
          {
            "--led-intensity": intensity.toString(),
          } as React.CSSProperties
        }
      >
        <div className={styles.vintageLedInner}>
          <div className={styles.vintageLedGlow}></div>
          <div className={styles.vintageLedReflection}></div>
        </div>
      </div>
    </div>
  );
}

export default LedIndicator;
