import styles from "../Knob.module.css";

export default function KnobRing({ type }: { type: "radial" | "arrow" }) {
  return (
    <div
      className={styles.knobRing}
      style={{
        background:
          type === "radial"
            ? `linear-gradient(
    to bottom,
    #595959 0%,
    #333 35%,
    #111 35%,
    #000 100%
  )`
            : `linear-gradient(
    to bottom,
    #595959 0%,
    #444 35%,
    #222 35%,
    #111 100%
  )`,
      }}
    />
  );
}
