import Screw from "@/components/Screw";
import styles from "../Panels.module.css";
import Hinge from "@/components/Hinge";
import Controls from "@/components/Controls";

function Top() {
  return (
    <>
      <div className={styles.backPanel}>
        <Screw />
        <Screw />
        <Screw />
        <Screw />
      </div>
      <Controls />
      <Hinge />
    </>
  );
}

export default Top;
