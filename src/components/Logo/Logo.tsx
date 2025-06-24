import styles from "./Logo.module.css";

function Logo() {
  return (
    <div className={styles.logo}>
      <img src="/images/minimoog-logo.png" alt="Minimoog Logo" />
    </div>
  );
}

export default Logo;
