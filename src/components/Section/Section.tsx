import React from "react";
import styles from "./Section.module.css";

type SectionProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
  justify?: "flex-start" | "center" | "flex-end" | "space-between";
  align?: "flex-start" | "center" | "flex-end" | "space-between";
  className?: string;
};

function Section({
  children,
  style,
  justify = "flex-end",
  align = "center",
  className,
}: SectionProps) {
  return (
    <>
      <div className={styles.blur} />
      <div
        className={`${styles.section} ${className}`}
        style={{
          ...style,
          justifyContent: justify,
          alignItems: align,
        }}
      >
        {children}
      </div>
    </>
  );
}

export default Section;
