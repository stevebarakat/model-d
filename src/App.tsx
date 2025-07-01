import Synth from "./components/Synth";
import PresetsDropdown from "./components/PresetsDropdown";

function App() {
  return (
    <div style={{ padding: "20px", minHeight: "100vh", background: "#0a0a0a" }}>
      <PresetsDropdown />
      <div style={{ marginTop: "20px" }}>
        <Synth />
      </div>
    </div>
  );
}

export default App;
