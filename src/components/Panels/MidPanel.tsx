import Logo from "../Logo";
import Row from "../Row";
import styles from "./Panels.module.css";

const MidPanel = () => {
  return (
    <Row
      justify="flex-end"
      style={{
        padding: "var(--spacing-md)",
      }}
      className={styles.midPanel}
    >
      <Logo />
    </Row>
  );
};

export default MidPanel;
