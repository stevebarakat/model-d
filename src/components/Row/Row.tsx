import styles from "./Row.module.css";

interface RowProps {
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
}

function Row({
  children,
  align = "center",
  justify = "flex-start",
  gap = "0",
  style,
}: RowProps) {
  return (
    <div
      className={styles.row}
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
