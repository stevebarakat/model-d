import { useCallback, useEffect } from "react";
import { RockerSwitch } from "../RockerSwitch";
import { VintageLED } from "../VintageLED";
import Title from "../Title";
import { useAudioContext } from "@/hooks/useAudioContext";
import Row from "../Row";
import Column from "../Column";

type PowerButtonProps = {
  isOn: boolean;
  onPowerOn: () => void;
  onPowerOff: () => void;
};

function PowerButton({ isOn, onPowerOn, onPowerOff }: PowerButtonProps) {
  const { isInitialized, initialize, dispose } = useAudioContext();

  useEffect(() => {
    if (isInitialized) {
      initialize();
    }

    return () => {
      if (isInitialized) {
        dispose();
      }
    };
  }, [isInitialized, initialize, dispose]);

  const handleCheckedChange = useCallback(
    (checked: boolean) => {
      if (checked) {
        onPowerOn();
      } else {
        onPowerOff();
      }
    },
    [onPowerOn, onPowerOff]
  );

  return (
    <Column gap="var(--spacing-xl)" style={{ height: "fit-content" }}>
      <Column gap="var(--spacing-xs)">
        <VintageLED
          label="Power"
          isOn={isOn}
          size="large"
          onCheckedChange={() => handleCheckedChange(!isOn)}
        />
        {/* <Title size="sm" style={{ marginTop: "var(--spacing-xs)" }}>
          Power
        </Title> */}
      </Column>
      <RockerSwitch
        orientation="vertical"
        checked={isOn}
        onCheckedChange={handleCheckedChange}
        label="Power"
        theme="black"
        topLabel="On"
      />
    </Column>
  );
}

export default PowerButton;
