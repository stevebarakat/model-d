import styles from "./Row.module.css";

type RowProps = {
  children?: React.ReactNode;
  align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
  justify?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  gap?: string;
  style?: React.CSSProperties;
  className?: string;
};

function Row({
  children,
  align = "center",
  justify = "flex-start",
  gap = "0",
  style,
  className,
}: RowProps) {
  return (
    <div
      className={`${styles.row} ${className}`}
      style={{
        alignItems: align,
        justifyContent: justify,
        gap: gap,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default Row;
