# Knob Component

A versatile knob component with support for both linear and logarithmic scaling.

## Features

- **Linear and Logarithmic Scaling**: Choose between linear or logarithmic value scaling
- **Multiple Sizes**: Small, medium, and large knob sizes
- **Two Types**: Radial (full rotation) and arrow (limited rotation) knobs
- **Value Labels**: Custom labels for specific values
- **Tick Marks**: Visual indicators for value positions
- **Keyboard Support**: Arrow keys for precise control
- **Accessibility**: Full ARIA support for screen readers

## Logarithmic Scaling

The `logarithmic` prop enables exponential scaling of knob values, which is particularly useful for:

- **Frequency Controls**: Audio frequency ranges (20Hz-20kHz)
- **Volume Controls**: Human perception of loudness
- **Filter Cutoff**: Audio filter frequency controls
- **Any parameter where exponential scaling provides better user experience**

### How it Works

When `logarithmic={true}`, the knob uses logarithmic scaling:

- Values are mapped using `log(value)` instead of linear interpolation
- Provides finer control at lower values and coarser control at higher values
- Automatically falls back to linear scaling for non-positive ranges (min ≤ 0 or max ≤ 0)

### Example Usage

```tsx
// Linear scaling (default)
<Knob
  value={50}
  min={0}
  max={100}
  onChange={setValue}
  label="Linear Control"
/>

// Logarithmic scaling
<Knob
  value={1000}
  min={20}
  max={20000}
  onChange={setFrequency}
  label="Frequency"
  unit="Hz"
  logarithmic={true}
  valueLabels={{
    20: "20",
    100: "100",
    1000: "1k",
    10000: "10k",
    20000: "20k"
  }}
/>
```

## Props

| Prop           | Type                                     | Default    | Description                             |
| -------------- | ---------------------------------------- | ---------- | --------------------------------------- |
| `value`        | `number`                                 | -          | Current knob value                      |
| `min`          | `number`                                 | -          | Minimum value                           |
| `max`          | `number`                                 | -          | Maximum value                           |
| `step`         | `number`                                 | `1`        | Step size for value changes             |
| `label`        | `string`                                 | -          | Label displayed below the knob          |
| `title`        | `string \| ReactElement`                 | `""`       | Optional title displayed above the knob |
| `unit`         | `string`                                 | `""`       | Unit suffix for the value               |
| `onChange`     | `(value: number) => void`                | -          | Callback when value changes             |
| `valueLabels`  | `Record<number, string \| ReactElement>` | -          | Custom labels for specific values       |
| `size`         | `"small" \| "medium" \| "large"`         | `"medium"` | Knob size                               |
| `showMidTicks` | `boolean`                                | `true`     | Show tick marks between value labels    |
| `type`         | `"arrow" \| "radial"`                    | `"radial"` | Knob rotation type                      |
| `logarithmic`  | `boolean`                                | `false`    | Enable logarithmic scaling              |
| `style`        | `CSSProperties`                          | -          | Additional CSS styles                   |

## Demo

See `LogarithmicDemo` component for examples of linear vs logarithmic scaling.
