import React from "react";
import styles from "./Section.module.css";

function Section({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div className={styles.section} style={style}>
      {children}
    </div>
  );
}

export default Section;
