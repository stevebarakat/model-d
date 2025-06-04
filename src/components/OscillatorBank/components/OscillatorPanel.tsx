import React from "react";
import { VerticalRockerSwitch } from "@/components/RockerSwitch";
import Row from "@/components/Row";

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
    <Row>
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
    </Row>
  );
}

export default OscillatorPanel;
