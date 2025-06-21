import { RockerSwitch } from "../RockerSwitches";
import Column from "../Column";
import { useSynthStore } from "@/store/synthStore";

function KeyboardControl({ disabled }: { disabled: boolean }) {
  const keyboardControl1 = useSynthStore((state) => state.keyboardControl1);
  const keyboardControl2 = useSynthStore((state) => state.keyboardControl2);
  const setKeyboardControl1 = useSynthStore(
    (state) => state.setKeyboardControl1
  );
  const setKeyboardControl2 = useSynthStore(
    (state) => state.setKeyboardControl2
  );
  return (
    <Column>
      <RockerSwitch
        theme="orange"
        checked={keyboardControl1}
        onCheckedChange={setKeyboardControl1}
        label="Keyboard Control 1"
        leftLabel="1"
        topLabelRight="On"
        bottomLabel="Keyboard Control"
        disabled={disabled}
      />
      <RockerSwitch
        theme="orange"
        checked={keyboardControl2}
        onCheckedChange={setKeyboardControl2}
        label="Keyboard Control 2"
        leftLabel="2"
        bottomLabelRight="On"
        disabled={disabled}
      />
    </Column>
  );
}

export default KeyboardControl;
