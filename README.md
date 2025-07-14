# Minimoog Model D Emulator

A web-based emulation of the classic Minimoog Model D analog synthesizer, leveraging the Web Audio API for authentic sound synthesis and performance.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Development](#development)
- [Project Structure](#project-structure)
- [Resources](#resources)
- [Testing](#testing)
- [References](#references)
- [License](#license)

---

## Overview

This project aims to recreate the iconic Minimoog Model D synthesizer in the browser. It uses the Web Audio API for real-time audio synthesis and provides a user interface inspired by the original instrument.

---

## Features

- **Three-Oscillator Architecture**: Classic waveforms (sawtooth, triangle, square, reverse sawtooth, pulse)
- **Authentic Mixer**: Individual volume controls for oscillators, noise, and external input
- **Moog Ladder Filter**: Resonance and key tracking with envelope control
- **Dual Envelope Generators**: Filter and loudness contours with authentic response curves
- **Modulation Sources**: LFO, noise, oscillator 3, and filter envelope
- **MIDI Support**: Connect your MIDI keyboard for real-time control
- **Virtual Keyboard**: On-screen keyboard with mouse and touch support
- **Preset System**: Curated collection of classic Minimoog sounds
- **URL State Persistence**: Save and share your current settings via URL parameters
- **Responsive Design**: Works on desktop and mobile devices
- **Logarithmic Controls**: Natural-feeling frequency and filter controls

---

## Development

### Prerequisites

- Node.js (version 18.0.0 or higher)
- npm or yarn

### Setup

```bash
git clone "https://github.com/stevebarakat/minimoog"
cd minimoog
npm install
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test         # Run tests with Vitest
npm run test:ui      # Run tests with UI
npm run test:coverage # Run tests with coverage
npm run lint         # Run ESLint
npm run lint:css     # Run Stylelint and fix issues
npm run lint:css:check # Check CSS without fixing
```

---

## Project Structure

```
src/
  components/               # React UI components organized by feature
    OscillatorBank/         # Three-oscillator bank with modulation
    Mixer/                  # Audio mixer with individual controls
    Filter/                 # Moog ladder filter and envelope
    Envelopes/              # Filter and loudness envelope controls
    Controllers/            # Modulation and performance controls
    Keyboard/               # Virtual keyboard with MIDI support
    Knob/                   # Reusable knob component with linear/log scaling
    RockerSwitch/           # Authentic rocker switch component
    PresetsDropdown/        # Preset selection with URL sharing
    Output/                 # Main output and headphone controls
    Synth/                  # Main synthesizer container
    # ... other UI components
  hooks/                    # Custom React hooks
    useAudioContext.ts      # Web Audio API context management
    useURLSync.ts           # URL state synchronization
  store/                    # Zustand state management
    actions/                # State update actions
    state/                  # Initial state configuration
    types/                  # TypeScript type definitions
    synthStore.ts           # Main store implementation
  utils/                    # Utility functions
    presetConversion.ts     # Preset format conversion
    urlState.ts             # URL parameter handling
    noteToFrequency.ts      # Musical note utilities
  data/                     # Static data
    presets.ts              # Preset definitions
  styles/                   # Global CSS and design tokens
  test/                     # Test configuration
    setup.ts                # Vitest setup file

public/                     # Static assets
  images/                   # UI reference images
  *.js                      # Web Audio worklet processors

resources/                  # Documentation and reference materials
  minimoog-description.txt  # Detailed synthesizer documentation
  minimoog-signalflow.png   # Signal flow diagram
  web-audio-performance.txt # Performance optimization notes
```

### Architecture Principles

- **Colocation**: Related files (components, styles, tests, hooks, types) are placed together
- **Component Separation**: Each component has a single responsibility
- **Pure Functions**: Prefer immutable, side-effect-free functions
- **TypeScript First**: Comprehensive type safety throughout

---

## Resources

- **[Minimoog Description](resources/minimoog-description.txt)**: In-depth explanation of the synthesizer's architecture and controls
- **[Signal Flow Diagram](resources/minimoog-signalflow.png)**: Visual overview of the internal signal routing
- **[Web Audio Performance Notes](resources/web-audio-performance.txt)**: Best practices for Web Audio API optimization

---

## Testing

The project uses **Vitest** for testing with the following features:

- **Unit Tests**: Individual component and utility function testing
- **Integration Tests**: Component interaction testing
- **Test Coverage**: Comprehensive coverage reporting
- **UI Testing**: Visual test interface with `npm run test:ui`

### Running Tests

```bash
npm test                 # Run all tests
npm run test:ui         # Open test UI
npm run test:coverage   # Generate coverage report
```

### Test Structure

Tests are co-located with their corresponding components and utilities:

```
src/
  components/
    Controllers/
      __tests__/
        Controllers.integration.test.tsx
  utils/
    __tests__/
      presetConversion.test.ts
      presetToURL.test.ts
      urlState.test.ts
```

---

## URL State Persistence

The Minimoog emulator supports saving and sharing your current settings via URL parameters:

- **Save Settings**: Click the "Copy URL" button next to the preset dropdown
- **Share Settings**: Share URLs to let others load your exact configuration
- **Bookmark Configurations**: Bookmark URLs to quickly return to specific sounds
- **Auto-Load**: Settings automatically load when visiting URLs with parameters

### Supported Parameters

All synth parameters are encoded in the URL, including:

- Oscillator waveforms, frequencies, and ranges
- Mixer levels and noise settings
- Filter cutoff, emphasis, and envelope settings
- Modulation settings (LFO, modulation mix)
- Performance controls (glide, keyboard control)

---

## References

- [Web Audio API Performance and Debugging Notes](https://padenot.github.io/web-audio-perf/)
- [Minimoog Model D Manual](resources/minimoog-description.txt)
- [Web Audio API Documentation (MDN)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Project Preferences](dev-preferences.json)

---

## License

[MIT](LICENSE)
