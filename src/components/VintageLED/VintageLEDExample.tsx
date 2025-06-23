import { useState } from "react";
import { VintageLED } from "./VintageLED";
import { cn } from "@/utils/helpers";
import styles from "./VintageLEDExample.module.css";

/**
 * Example component demonstrating the optimized VintageLED usage
 */
export function VintageLEDExample() {
  const [ledStates, setLedStates] = useState({
    red: true,
    green: false,
    amber: true,
    blue: false,
  });

  const handleLEDChange =
    (color: keyof typeof ledStates) =>
    (e: React.FormEvent<HTMLInputElement>) => {
      setLedStates((prev) => ({
        ...prev,
        [color]: e.currentTarget.checked,
      }));
    };

  return (
    <div className={styles.exampleContainer}>
      <h3 className={styles.title}>Vintage LED Examples</h3>

      <div className={styles.ledGrid}>
        {/* Small LEDs */}
        <div className={styles.ledGroup}>
          <h4 className={styles.groupTitle}>Small LEDs</h4>
          <div className={styles.ledRow}>
            <VintageLED
              color="red"
              size="small"
              isOn={ledStates.red}
              onCheckedChange={handleLEDChange("red")}
              label="Red"
              labelPosition="bottom"
            />
            <VintageLED
              color="green"
              size="small"
              isOn={ledStates.green}
              onCheckedChange={handleLEDChange("green")}
              label="Green"
              labelPosition="bottom"
            />
            <VintageLED
              color="amber"
              size="small"
              isOn={ledStates.amber}
              onCheckedChange={handleLEDChange("amber")}
              label="Amber"
              labelPosition="bottom"
            />
            <VintageLED
              color="blue"
              size="small"
              isOn={ledStates.blue}
              onCheckedChange={handleLEDChange("blue")}
              label="Blue"
              labelPosition="bottom"
            />
          </div>
        </div>

        {/* Medium LEDs */}
        <div className={styles.ledGroup}>
          <h4 className={styles.groupTitle}>Medium LEDs</h4>
          <div className={styles.ledRow}>
            <VintageLED
              color="red"
              size="medium"
              isOn={ledStates.red}
              onCheckedChange={handleLEDChange("red")}
              label="Red"
              labelPosition="right"
            />
            <VintageLED
              color="green"
              size="medium"
              isOn={ledStates.green}
              onCheckedChange={handleLEDChange("green")}
              label="Green"
              labelPosition="left"
            />
          </div>
        </div>

        {/* Large LED */}
        <div className={styles.ledGroup}>
          <h4 className={styles.groupTitle}>Large LED</h4>
          <div className={styles.ledRow}>
            <VintageLED
              color="red"
              size="large"
              isOn={ledStates.red}
              onCheckedChange={handleLEDChange("red")}
              label="Power"
              labelPosition="top"
            />
          </div>
        </div>
      </div>

      {/* Status display */}
      <div className={styles.statusDisplay}>
        <h4 className={styles.statusTitle}>LED Status</h4>
        <div className={styles.statusGrid}>
          {Object.entries(ledStates).map(([color, isOn]) => (
            <div
              key={color}
              className={cn(styles.statusItem, isOn && styles.statusItemActive)}
            >
              <span className={styles.statusLabel}>
                {color.charAt(0).toUpperCase() + color.slice(1)}:
              </span>
              <span className={styles.statusValue}>{isOn ? "ON" : "OFF"}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
