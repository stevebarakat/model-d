// Vitest setup file
import "@testing-library/jest-dom";

// Extend Window interface for webkit prefix
declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

// Mock window.AudioContext if not available
if (!window.AudioContext) {
  window.AudioContext = window.AudioContext || window.webkitAudioContext;
}
