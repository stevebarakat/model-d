import Logo from "@/components/Logo";
import Row from "@/components/Row";
import styles from "../Panels.module.css";

function Middle() {
  return (
    <Row
      justify="flex-end"
      style={{
        padding: "var(--spacing-md)",
      }}
      className={styles.middle}
    >
      <Logo />
    </Row>
  );
}

export default Middle;
