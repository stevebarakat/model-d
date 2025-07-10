import { valueToKnobPos } from "../Knob/utils/attackDecayMapping";

// Define label values and map to knob positions
export const attackDecayValueLabels = Object.fromEntries([
  [valueToKnobPos(0), "m-sec."],
  [valueToKnobPos(10), "10"],
  [valueToKnobPos(200), "200"],
  [valueToKnobPos(600), "600"],
  [valueToKnobPos(1000), "1"],
  [valueToKnobPos(5000), "5"],
  [valueToKnobPos(10000), "sec."],
]);
