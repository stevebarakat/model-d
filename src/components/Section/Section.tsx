import React from "react";

type SectionProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

const defaultStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  gap: 0,
  padding: "2rem 0 1rem",
  borderRight: "2px solid var(--color-white-50)",
  height: "100%",
};

function Section({ children, style }: SectionProps) {
  return <div style={{ ...defaultStyle, ...style }}>{children}</div>;
}

export default Section;
