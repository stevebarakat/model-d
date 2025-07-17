import React from "react";
import styles from "./Synth.module.css";
import { cn } from "@/utils/helpers";

const Synth = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn(styles.container, className)}>{children}</div>;
};

export default Synth;
