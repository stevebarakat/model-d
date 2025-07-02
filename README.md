# Minimoog Model D Emulator

A web-based emulation of the classic Minimoog Model D analog synthesizer, leveraging the Web Audio API for authentic sound synthesis and performance.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Project Structure](#project-structure)
- [Resources](#resources)
- [Development](#development)
- [References](#references)
- [License](#license)

---

## Overview

This project aims to recreate the iconic Minimoog Model D synthesizer in the browser. It uses the Web Audio API for real-time audio synthesis and provides a user interface inspired by the original instrument.

---

## Features

- Three-oscillator architecture with classic waveforms
- Mixer, noise generator, and external input
- Moog ladder filter with resonance and key tracking
- Envelope generators for filter and loudness contours
- Modulation sources: LFO, noise, oscillator 3, filter EG
- MIDI and keyboard input support
- Visual signal flow diagram
- **Authentic Minimoog Interface**: Faithful recreation of the original hardware interface
- **Real-time Audio Synthesis**: Full Web Audio API implementation
- **MIDI Support**: Connect your MIDI keyboard for real-time control
- **Responsive Design**: Works on desktop and mobile devices
- **Logarithmic Knob Controls**: Natural-feeling frequency and filter controls
- **URL State Persistence**: Save and share your current settings via URL parameters

---

## Resources

- **[Minimoog Description](resources/minimoog-description.txt):** In-depth explanation of the synthesizer's architecture and controls.
- **[Signal Flow Diagram](resources/minimoog-signalflow.png):** Visual overview of the internal signal routing.

---

## Development

### Prerequisites

- Node.js (version X.X.X or higher)
- npm or yarn

### Setup

```bash
git clone "https://github.com/stevebarakat/minimoog"
cd minimoog
npm install
npm start
```

## Project Structure

```
resources/
  minimoog-description.txt   # Detailed description of the Minimoog Model D
  minimoog-signalflow.png    # Signal flow diagram
  ui/                       # UI reference images or assets

src/
  components/               # All React UI components, organized by feature
    OscillatorBank/         # Oscillator bank UI and logic
    Mixer/                  # Mixer section UI
    Modifiers/              # Filter and envelope controls
    Controllers/            # Modulation and control panel
    Output/                 # Output section
    Keyboard/               # Virtual keyboard
    Knob/                   # Knob UI component
    ArrowKnob/              # Arrow knob UI component
    RockerSwitch/           # Rocker switch UI
    Title/           # Section title UI
    SidePanel/              # Side panel UI
    Wheel/                  # Wheel Input UI for Modulation and Pitch
    Switch/                 # Switch UI
    Synth/                  # Synth engine or wrapper
    SynthControls/          # Synth control panel
  hooks/                    # Custom React hooks (e.g., MIDI, keyboard handling)
  store/                    # Zustand store, actions, state, and types
    actions/
    state/
    types/
    synthStore.ts
  styles/                   # Global and shared CSS (variables, reset, fonts)
  utils/                    # Utility functions
  types.ts                  # Shared TypeScript types
  App.tsx                   # Main app component
  main.tsx                  # React entry point
  vite-env.d.ts             # Vite/TypeScript environment types

public/                     # Static assets
dist/                       # Build output
node_modules/              # Dependencies
index.html                 # Entry HTML file
package.json               # Project dependencies and scripts
package-lock.json          # Dependency lock file
tsconfig.json              # Base TypeScript configuration
tsconfig.app.json          # App-specific TypeScript config
tsconfig.node.json         # Node-specific TypeScript config
vite.config.ts             # Vite configuration
postcss.config.js          # PostCSS configuration
eslint.config.js           # ESLint configuration
.stylelintrc.json          # Stylelint configuration
.gitignore                 # Git ignore rules
dev-preferences.json       # Project configuration and preferences
```

- **Colocation:** Whenever possible, related files (component, styles, tests, hooks, types, audio, store, utils, etc.) are placed in the same directory to improve discoverability and maintainability, as described in `dev-preferences.json`.

---

### Project Preferences

- See [`dev-preferences.json`](dev-preferences.json) for code style, tooling, and architectural guidelines.
- See [`Web Audio API Performance and Debugging Notes`](resources/web-audio-performance.txt) for best practices.

---

## References

- [Web Audio API Performance and Debugging Notes](https://padenot.github.io/web-audio-perf/)
- [Minimoog Model D Manual](resources/minimoog-description.txt)
- [Web Audio API Documentation (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Project Preferences](dev-preferences.json)

---

## License

[MIT](LICENSE)

## Knob Component

The Knob component supports both linear and logarithmic scaling for different types of controls:

### Linear Knobs (Default)

Use for controls like volume, mix levels, and other linear parameters:

```tsx
<Knob value={volume} min={0} max={10} label="Volume" onChange={setVolume} />
```

### Logarithmic Knobs

Use for frequency controls, filter cutoff, and other parameters that benefit from exponential scaling:

```tsx
<Knob
  value={frequency}
  min={20}
  max={20000}
  label="Frequency"
  onChange={setFrequency}
  logarithmic={true}
/>
```

The logarithmic prop provides natural-feeling control for frequency ranges and other exponential parameters while maintaining linear visual representation of labels and tick marks.

## URL State Persistence

The Minimoog emulator supports saving and sharing your current settings via URL parameters. This feature allows you to:

- **Save Settings**: Click the "Save to URL" button next to the preset dropdown to copy the current URL with all your settings
- **Share Settings**: Share the URL with others to let them load your exact configuration
- **Bookmark Configurations**: Bookmark URLs to quickly return to specific sounds
- **Auto-Load**: When you visit a URL with parameters, the settings will automatically load

### How It Works

All synth parameters are encoded in the URL as query parameters, including:

- Oscillator waveforms, frequencies, and ranges
- Mixer levels and noise settings
- Filter cutoff, emphasis, and envelope settings
- Modulation settings (LFO, modulation mix)
- Glide and other performance controls

The URL will update automatically as you adjust settings, and you can copy the current URL at any time using the "Save to URL" button.
