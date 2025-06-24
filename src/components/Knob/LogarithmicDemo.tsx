import React, { useState } from "react";
import Knob from "./Knob";

/**
 * Demo component to showcase logarithmic vs linear scaling in knobs.
 * This demonstrates how logarithmic scaling provides better control
 * for parameters like frequency, volume, etc.
 */
export default function LogarithmicDemo() {
  const [linearValue, setLinearValue] = useState(50);
  const [logValue, setLogValue] = useState(50);

  return (
    <div
      style={{
        display: "flex",
        gap: "2rem",
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <h3>Linear Scaling (0-100)</h3>
        <Knob
          value={linearValue}
          min={0}
          max={100}
          step={1}
          label="Linear"
          onChange={setLinearValue}
          size="large"
          type="radial"
          logarithmic={false}
        />
        <p>Value: {linearValue}</p>
      </div>

      <div style={{ textAlign: "center" }}>
        <h3>Logarithmic Scaling (0-100)</h3>
        <Knob
          value={logValue}
          min={0}
          max={100}
          step={1}
          label="Logarithmic"
          onChange={setLogValue}
          size="large"
          type="radial"
          logarithmic={true}
        />
        <p>Value: {logValue}</p>
      </div>

      <div style={{ textAlign: "center" }}>
        <h3>Frequency Control (20Hz-20kHz)</h3>
        <Knob
          value={1000}
          min={20}
          max={20000}
          step={1}
          label="Frequency"
          unit="Hz"
          onChange={(value) => console.log("Frequency:", value)}
          size="large"
          type="radial"
          logarithmic={true}
          valueLabels={{
            20: "20",
            100: "100",
            1000: "1k",
            10000: "10k",
            20000: "20k",
          }}
        />
        <p>Logarithmic scaling is ideal for frequency controls</p>
      </div>

      <div style={{ textAlign: "center" }}>
        <h3>Volume Control (0-100%)</h3>
        <Knob
          value={50}
          min={0}
          max={100}
          step={1}
          label="Volume"
          unit="%"
          onChange={(value) => console.log("Volume:", value)}
          size="large"
          type="radial"
          logarithmic={true}
          valueLabels={{
            0: "0",
            25: "25",
            50: "50",
            75: "75",
            100: "100",
          }}
        />
        <p>Logarithmic scaling matches human perception</p>
      </div>
    </div>
  );
}
