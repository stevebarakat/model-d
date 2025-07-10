import React from "react";
import { cn } from "@/utils/helpers";
import styles from "./Title.module.css";

type TitleProps = {
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
  style?: React.CSSProperties;
};

function Title({ children, size = "lg", style }: TitleProps) {
  return (
    <div
      className={cn(
        styles.title,
        size === "sm" && styles.small,
        size === "md" && styles.medium,
        size === "lg" && styles.large
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export default Title;
