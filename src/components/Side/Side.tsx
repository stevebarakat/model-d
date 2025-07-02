import styles from "./Side.module.css";

function Side({ backgroundImage }: { backgroundImage: string }) {
  return (
    <div
      className={styles.side}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    ></div>
  );
}

export default Side;
