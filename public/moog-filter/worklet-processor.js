class WorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.WEBEAUDIO_FRAME_SIZE = 128;
    this.isWasmReady = false;
    this.setCutoff = null;
    this.setResonance = null;
    this.setModValue = null;
    this.setEnvelopeParams = null;
    this.setKeyTracking = null;
    this.triggerEnvelope = null;
    this.releaseEnvelope = null;
    this.exports = null;

    this.port.onmessage = (e) => {
      if (e.data instanceof ArrayBuffer) {
        // Instantiate WASM
        WebAssembly.instantiate(e.data)
          .then((result) => {
            this.exports = result.instance.exports;
            this.inputStart = this.exports.inputBufferPtr();
            this.outputStart = this.exports.outputBufferPtr();
            this.inputBuffer = new Float32Array(
              this.exports.memory.buffer,
              this.inputStart,
              this.WEBEAUDIO_FRAME_SIZE
            );
            this.outputBuffer = new Float32Array(
              this.exports.memory.buffer,
              this.outputStart,
              this.WEBEAUDIO_FRAME_SIZE
            );

            // Store function references
            this.setCutoff = this.exports.setCutoff;
            this.setResonance = this.exports.setResonance;
            this.setModValue = this.exports.setModValue;
            this.setEnvelopeParams = this.exports.setEnvelopeParams;
            this.setKeyTracking = this.exports.setKeyTracking;
            this.triggerEnvelope = this.exports.triggerEnvelope;
            this.releaseEnvelope = this.exports.releaseEnvelope;

            this.isWasmReady = true;
          })
          .catch((error) => {
            console.error(
              "WorkletProcessor: Failed to instantiate WASM:",
              error
            );
          });
      } else if (e.data && typeof e.data === "object") {
        // Handle parameter messages
        if (this.isWasmReady) {
          if (e.data.cutOff !== undefined && this.setCutoff) {
            this.setCutoff(e.data.cutOff);
          }
          if (e.data.resonance !== undefined && this.setResonance) {
            this.setResonance(e.data.resonance);
          }
          if (e.data.modValue !== undefined && this.setModValue) {
            this.setModValue(e.data.modValue);
          }
          if (e.data.envelopeParams && this.setEnvelopeParams) {
            const { attack, decay, sustain, release, contour } =
              e.data.envelopeParams;
            this.setEnvelopeParams(attack, decay, sustain, release, contour);
          }
          if (e.data.keyTracking && this.setKeyTracking) {
            const { base, tracking, note } = e.data.keyTracking;
            this.setKeyTracking(base, tracking, note);
          }
          if (e.data.triggerEnvelope && this.triggerEnvelope) {
            this.triggerEnvelope();
          }
          if (e.data.releaseEnvelope && this.releaseEnvelope) {
            this.releaseEnvelope();
          }
        }
      }
    };
  }
  process(inputs, outputs, parameters) {
    if (!this.isWasmReady) {
      return true;
    }

    const input = inputs[0];
    const output = outputs[0];

    if (input && input.length > 0 && output && output.length > 0) {
      const inputChannel = input[0];
      const outputChannel = output[0];

      // Copy input to WASM buffer
      for (let i = 0; i < this.WEBEAUDIO_FRAME_SIZE; i++) {
        this.inputBuffer[i] = inputChannel[i] || 0;
      }

      // Process through WASM filter
      if (this.exports && this.exports.filter) {
        this.exports.filter();
      }

      // Copy output from WASM buffer
      for (let i = 0; i < this.WEBEAUDIO_FRAME_SIZE; i++) {
        outputChannel[i] = this.outputBuffer[i];
      }
    }

    return true;
  }
}
registerProcessor("worklet-processor", WorkletProcessor);
