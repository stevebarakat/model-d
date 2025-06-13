import { HorizontalRockerSwitch } from "../RockerSwitch";
import Column from "../Column";

function KeyboardControl({ disabled }: { disabled: boolean }) {
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
        disabled={disabled}
      />
      <HorizontalRockerSwitch
        theme="orange"
        checked={false}
        onCheckedChange={() => {}}
        label="Keyboard Control"
        leftLabel="2"
        bottomLabelRight="On"
        disabled={disabled}
      />
    </Column>
  );
}

export default KeyboardControl;
