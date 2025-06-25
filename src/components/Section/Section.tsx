import React from "react";

type SectionProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  align?: "flex-start" | "center" | "flex-end" | "space-between";
};

const defaultStyle: React.CSSProperties = {
  position: "relative",
  display: "flex",
  flexDirection: "column",
  paddingBottom: "1.75rem",
  borderRight: "2px solid var(--color-white-50)",
};

function Section({
  children,
  style,
  justify = "flex-end",
  align = "center",
}: SectionProps) {
  return (
    <div
      style={{
        ...defaultStyle,
        ...style,
        justifyContent: justify,
        alignItems: align,
      }}
    >
      {children}
    </div>
  );
}

export default Section;
