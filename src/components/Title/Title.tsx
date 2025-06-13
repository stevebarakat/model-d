import React from "react";
import styles from "./Title.module.css";

type TitleProps = {
  children: React.ReactNode;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
};

function Title({ children, size = "lg", disabled = false }: TitleProps) {
  const isSmall = size === "sm";
  const isMedium = size === "md";
  const isLarge = size === "lg";
  return (
    <div
      className={`${styles.title} ${isSmall && styles.small} ${
        isMedium && styles.medium
      } ${isLarge && styles.large}`}
      style={{ opacity: disabled ? 0.5 : 1 }}
    >
      {children}
    </div>
  );
}

export default Title;
