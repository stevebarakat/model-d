import styles from "./Flex.module.css";

interface FlexProps {
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

function Flex({
  children,
  align = "center",
  justify = "flex-start",
  gap = "0",
}: FlexProps) {
  return (
    <div
      className={styles.flex}
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

export default Flex;
