import React from "react";
import styles from "./Column.module.css";

function Column({ children }: { children: React.ReactNode }) {
  return <div className={styles.column}>{children}</div>;
}

export default Column;
