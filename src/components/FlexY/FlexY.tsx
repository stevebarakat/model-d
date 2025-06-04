import styles from "./FlexY.module.css";

interface FlexYProps {
  children: React.ReactNode;
  align?: "center" | "flex-start" | "flex-end" | "stretch" | "baseline";
  justify?:
    | "center"
    | "flex-start"
    | "flex-end"
    | "space-between"
    | "space-around"
    | "space-evenly";
  gap?: string;
}

function FlexY({
  children,
  align = "center",
  justify = "flex-start",
  gap = "0",
}: FlexYProps) {
  return (
    <div
      className={styles.flexY}
      style={{
        display: "flex",
        alignItems: align,
        justifyContent: justify,
        gap: gap,
      }}
    >
      {children}
    </div>
  );
}

export default FlexY;
