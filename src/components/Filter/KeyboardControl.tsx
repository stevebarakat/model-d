import { styles } from "../Modifiers";
import { HorizontalRockerSwitch } from "../RockerSwitch";

function KeyboardControl() {
  return (
    <>
      <div className={styles.flexRow}>
        <HorizontalRockerSwitch
          theme="orange"
          checked={false}
          onCheckedChange={() => {}}
          label="Keyboard Control"
          leftLabel="1"
          topLabelRight="On"
          bottomLabel="Keyboard Control"
        />
      </div>
      <div className={styles.flexRow}>
        <HorizontalRockerSwitch
          theme="orange"
          checked={false}
          onCheckedChange={() => {}}
          label="Keyboard Control"
          leftLabel="2"
          bottomLabelRight="On"
        />
      </div>
    </>
  );
}

export default KeyboardControl;
