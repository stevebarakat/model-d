import React from "react";
import styles from "./Section.module.css";

function Section({ children }: { children: React.ReactNode }) {
  return <div className={styles.section}>{children}</div>;
}

export default Section;
