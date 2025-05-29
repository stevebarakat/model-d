import React from "react";
import styles from "./OscillatorBank.module.css";
import VerticalRockerSwitch from "@/components/VerticalRockerSwitch";

export type OscillatorPanelProps = {
  showControlSwitch?: boolean;
  controlSwitchProps?: {
    checked: boolean;
    onCheckedChange: (checked: boolean) => void;
    label: string;
    theme?: "black" | "orange" | "blue";
  };
  children: React.ReactNode;
};

function OscillatorPanel({
  showControlSwitch = false,
  controlSwitchProps,
  children,
}: OscillatorPanelProps) {
  return (
    <div className={styles.row}>
      {showControlSwitch && controlSwitchProps && (
        <VerticalRockerSwitch {...controlSwitchProps} />
      )}
      {children}
    </div>
  );
}

export default OscillatorPanel;
