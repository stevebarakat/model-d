import Synth from "./components/Synth";
import * as Tooltip from "@radix-ui/react-tooltip";

function App() {
  return (
    <Tooltip.Provider>
      <Synth />
    </Tooltip.Provider>
  );
}

export default App;
