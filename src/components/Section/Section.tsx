import React from "react";
import styles from "./Section.module.css";

type SectionProps = {
  children: React.ReactNode;
  style?: React.CSSProperties;
};

function Section({ children, style }: SectionProps) {
  return (
    <div className={styles.section} style={style}>
      {children}
    </div>
  );
}

export default Section;
