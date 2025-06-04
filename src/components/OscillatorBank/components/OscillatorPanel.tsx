import React from "react";
import styles from "../OscillatorBank.module.css";
import { VerticalRockerSwitch } from "@/components/RockerSwitch";

export type OscillatorPanelProps = {
  showControlSwitch?: boolean;
  controlSwitchProps?: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: string;
    theme?: "black" | "orange" | "blue";
  };
  children: React.ReactNode;
  disabled?: boolean;
};

function OscillatorPanel({
  showControlSwitch = false,
  controlSwitchProps,
  children,
  disabled = false,
}: OscillatorPanelProps) {
  return (
    <div className={styles.row}>
      {showControlSwitch && controlSwitchProps && (
        <VerticalRockerSwitch
          {...controlSwitchProps}
          label="Osc. 3 Control"
          topLabel={
            <span>
              Osc. 3<br />
              Control
            </span>
          }
          disabled={disabled}
        />
      )}
      {children}
    </div>
  );
}

export default OscillatorPanel;
