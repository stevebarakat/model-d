class WorkletProcessor extends AudioWorkletProcessor {
  constructor() {
    super();
    this.WEBEAUDIO_FRAME_SIZE = 128;
    this.isWasmReady = false;
    this.setCutoff = null;
    this.setResonance = null;

    this.port.onmessage = (e) => {
      if (e.data instanceof ArrayBuffer) {
        // Instantiate WASM
        WebAssembly.instantiate(e.data).then((result) => {
          const exports = result.instance.exports;
          this.inputStart = exports.inputBufferPtr();
          this.outputStart = exports.outputBufferPtr();
          this.inputBuffer = new Float32Array(
            exports.memory.buffer,
            this.inputStart,
            this.WEBEAUDIO_FRAME_SIZE
          );
          this.outputBuffer = new Float32Array(
            exports.memory.buffer,
            this.outputStart,
            this.WEBEAUDIO_FRAME_SIZE
          );
          this.filter = exports.filter;
          this.setCutoff = exports.setCutoff;
          this.setResonance = exports.setResonance;
          this.isWasmReady = true;
        });
      } else if (typeof e.data === "object") {
        // Handle parameter updates
        if (this.setCutoff && typeof e.data.cutOff === "number") {
          this.setCutoff(e.data.cutOff);
        }
        if (this.setResonance && typeof e.data.resonance === "number") {
          this.setResonance(e.data.resonance);
        }
      }
    };
  }
  process(inputList, outputList, parameters) {
    if (!this.isWasmReady) return true;
    this.inputBuffer.set(inputList[0][0]);
    this.filter();
    outputList[0][0].set(this.outputBuffer);
    return true;
  }
}
registerProcessor("worklet-processor", WorkletProcessor);
