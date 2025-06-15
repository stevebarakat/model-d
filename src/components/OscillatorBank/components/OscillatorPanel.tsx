import React from "react";
import { VerticalRockerSwitch } from "@/components/RockerSwitches";
import Row from "@/components/Row";

export type OscillatorPanelProps = {
  showControlSwitch?: boolean;
  position?: number | null;
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
  position = null,
  controlSwitchProps,
  children,
  disabled = false,
}: OscillatorPanelProps) {
  return (
    <Row style={{ paddingBottom: position === 1 ? "10px" : "0px" }}>
      {showControlSwitch && controlSwitchProps && (
        <VerticalRockerSwitch
          {...controlSwitchProps}
          label={controlSwitchProps.label}
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
