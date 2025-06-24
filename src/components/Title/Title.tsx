import React from "react";
import styles from "./Title.module.css";

type TitleProps = {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
};

function Title({ children, size = "lg", style }: TitleProps) {
  const isSmall = size === "sm";
  const isMedium = size === "md";
  const isLarge = size === "lg";
  return (
    <div
      className={`${styles.title} ${isSmall && styles.small} ${
        isMedium && styles.medium
      } ${isLarge && styles.large}`}
      style={style}
    >
      {children}
    </div>
  );
}

export default Title;
