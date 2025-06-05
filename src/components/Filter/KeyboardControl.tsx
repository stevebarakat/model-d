import { HorizontalRockerSwitch } from "../RockerSwitch";
import Column from "../Column";

function KeyboardControl() {
  return (
    <Column>
      <HorizontalRockerSwitch
        theme="orange"
        checked={false}
        onCheckedChange={() => {}}
        label="Keyboard Control"
        leftLabel="1"
        topLabelRight="On"
        bottomLabel="Keyboard Control"
      />
      <HorizontalRockerSwitch
        theme="orange"
        checked={false}
        onCheckedChange={() => {}}
        label="Keyboard Control"
        leftLabel="2"
        bottomLabelRight="On"
      />
    </Column>
  );
}

export default KeyboardControl;
