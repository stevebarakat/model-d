import React from "react";

type KnobProps = {
  value: number;
  min: number;
  max: number;
  step?: number;
  label: string;
  title?: string | React.ReactElement | null;
  unit?: string;
  onChange: (value: number) => void;
  valueLabels?: Record<number, string | React.ReactElement>;
  size?: "small" | "medium" | "large";
  showMidTicks?: boolean;
  type?: "arrow" | "radial";
  logarithmic?: boolean;
  style?: React.CSSProperties;
};

type KnobSize = "small" | "medium" | "large";
type KnobType = "arrow" | "radial";

export type { KnobProps, KnobSize, KnobType };
