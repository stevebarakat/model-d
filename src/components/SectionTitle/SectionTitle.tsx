import React from "react";
import styles from "./SectionTitle.module.css";

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <div className={styles.title}>{children}</div>;
}

export default SectionTitle;
