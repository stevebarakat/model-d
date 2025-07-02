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

    console.log("WorkletProcessor: Constructor called");

    this.port.onmessage = (e) => {
      if (e.data instanceof ArrayBuffer) {
        console.log(
          "WorkletProcessor: Received WASM binary, size:",
          e.data.byteLength
        );
        // Instantiate WASM
        WebAssembly.instantiate(e.data)
          .then((result) => {
            console.log("WorkletProcessor: WASM instantiated successfully");
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
            console.log("WorkletProcessor: WASM ready, functions stored");
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
          console.log("WorkletProcessor: Received parameter message:", e.data);
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
        } else {
          console.warn(
            "WorkletProcessor: Received parameter message but WASM not ready"
          );
        }
      }
    };
  }
  process(inputs, outputs, parameters) {
    if (!this.isWasmReady) {
      console.warn("WorkletProcessor: WASM not ready, skipping processing");
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
        // Debug: Check input values
        let hasInput = false;
        for (let i = 0; i < this.WEBEAUDIO_FRAME_SIZE; i++) {
          if (Math.abs(this.inputBuffer[i]) > 0.001) {
            hasInput = true;
            break;
          }
        }
        if (!hasInput) {
          console.warn("WorkletProcessor: No input signal detected");
        } else {
          console.log("WorkletProcessor: Input signal detected, processing...");
        }

        this.exports.filter();

        // Debug: Check if we're getting output
        let hasOutput = false;
        let maxOutput = 0;
        for (let i = 0; i < this.WEBEAUDIO_FRAME_SIZE; i++) {
          if (Math.abs(this.outputBuffer[i]) > 0.001) {
            hasOutput = true;
            maxOutput = Math.max(maxOutput, Math.abs(this.outputBuffer[i]));
          }
        }
        if (!hasOutput) {
          console.warn("WorkletProcessor: No output from filter");
        } else {
          console.log(
            "WorkletProcessor: Filter output detected, max amplitude:",
            maxOutput
          );
        }
      } else {
        console.error("WorkletProcessor: Filter function not available");
        console.log(
          "WorkletProcessor: Available exports:",
          Object.keys(this.exports || {})
        );
      }

      // Copy output from WASM buffer
      for (let i = 0; i < this.WEBEAUDIO_FRAME_SIZE; i++) {
        outputChannel[i] = this.outputBuffer[i];
      }
    } else {
      console.warn("WorkletProcessor: No input or output channels");
    }

    return true;
  }
}
registerProcessor("worklet-processor", WorkletProcessor);
