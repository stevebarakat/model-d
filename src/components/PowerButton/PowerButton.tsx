import React from "react";
import { Power } from "lucide-react";
import styles from "./PowerButton.module.css";

interface PowerButtonProps {
  isOn: boolean;
  onPowerOn: () => void;
  onPowerOff: () => void;
  className?: string;
}

const PowerButton: React.FC<PowerButtonProps> = ({
  isOn,
  onPowerOn,
  onPowerOff,
  className,
}) => {
  const handleClick = React.useCallback(() => {
    if (isOn) {
      onPowerOff();
    } else {
      onPowerOn();
    }
  }, [isOn, onPowerOff, onPowerOn]);

  return (
    <button
      className={`${styles.powerButton} ${className || ""}`}
      aria-pressed={isOn}
      aria-label={isOn ? "Power Off" : "Power On"}
      onClick={handleClick}
    >
      <Power className={styles.icon} />
    </button>
  );
};

export default PowerButton;
