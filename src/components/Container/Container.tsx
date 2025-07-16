import React from "react";
import styles from "./Container.module.css";

const Container = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={`${styles.container} ${className}`}>{children}</div>;
};

export default Container;
