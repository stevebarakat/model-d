class MoogZDFProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      {
        name: "cutoff",
        defaultValue: 1000,
        minValue: 20,
        maxValue: 20000,
        automationRate: "k-rate",
      },
      {
        name: "resonance",
        defaultValue: 0.5,
        minValue: 0,
        maxValue: 4,
        automationRate: "k-rate",
      },
    ];
  }

  constructor() {
    super();
    // Filter states for the 4-pole ladder filter
    this.stage = [0, 0, 0, 0];
    this.sampleRate = sampleRate;

    // Parameter smoothing to prevent zipper noise
    this.smoothedCutoff = 1000;
    this.smoothedResonance = 0.5;
    this.smoothingCoeff = 0.99; // Adjust for faster/slower smoothing

    // Pre-compute constants
    this.T = 1 / this.sampleRate;
    this.T2 = this.T / 2;

    // Oversampling factor
    this.oversampleFactor = 2;

    // Safety limits
    this.maxResonance = 3.99; // Prevent self-oscillation at max
  }

  // Improved saturation function - more musical than tanh
  saturate(x) {
    // Soft clipping with better harmonic content
    const absX = Math.abs(x);
    if (absX < 0.5) {
      return x;
    } else if (absX < 1.0) {
      const sign = x >= 0 ? 1 : -1;
      const t = absX - 0.5;
      return sign * (0.5 + t * (1.0 - 0.5 * t));
    } else {
      return x >= 0 ? 0.875 : -0.875;
    }
  }

  // Optimized frequency warping for bilinear transform
  prewarpFrequency(fc) {
    const wd = 2 * Math.PI * fc;
    const wa = (2 / this.T) * Math.tan(wd * this.T2);
    return (wa * this.T2) / (1.0 + wa * this.T2);
  }

  // Smooth parameter changes to prevent audio artifacts
  smoothParameter(current, target, coeff) {
    return current * coeff + target * (1 - coeff);
  }

  process(inputs, outputs, parameters) {
    const input = inputs[0][0] || [];
    const output = outputs[0][0] || [];

    // Optimize parameter access - only check length once per buffer
    const cutoffValues = parameters.cutoff;
    const resonanceValues = parameters.resonance;
    const isCutoffConstant = cutoffValues.length === 1;
    const isResonanceConstant = resonanceValues.length === 1;

    // Get initial values with validation
    const initialCutoff = isCutoffConstant ? cutoffValues[0] : cutoffValues[0];
    const initialResonance = isResonanceConstant
      ? resonanceValues[0]
      : resonanceValues[0];

    // Validate and smooth parameters
    const targetCutoff = Math.max(20, Math.min(20000, initialCutoff));
    const targetResonance = Math.max(
      0,
      Math.min(this.maxResonance, initialResonance)
    );

    this.smoothedCutoff = this.smoothParameter(
      this.smoothedCutoff,
      targetCutoff,
      this.smoothingCoeff
    );
    this.smoothedResonance = this.smoothParameter(
      this.smoothedResonance,
      targetResonance,
      this.smoothingCoeff
    );

    // Pre-compute filter coefficient if parameters are constant
    let G = null;
    if (isCutoffConstant && isResonanceConstant) {
      G = this.prewarpFrequency(this.smoothedCutoff);
    }

    for (let i = 0; i < output.length; i++) {
      const inputSample = input[i] || 0;

      // Get current parameter values (handle both constant and variable rates)
      let fc, res;
      if (isCutoffConstant && isResonanceConstant) {
        fc = this.smoothedCutoff;
        res = this.smoothedResonance;
      } else {
        const rawCutoff = isCutoffConstant
          ? targetCutoff
          : Math.max(20, Math.min(20000, cutoffValues[i]));
        const rawResonance = isResonanceConstant
          ? targetResonance
          : Math.max(0, Math.min(this.maxResonance, resonanceValues[i]));

        // Apply smoothing for variable rate parameters
        fc = this.smoothParameter(
          this.smoothedCutoff,
          rawCutoff,
          this.smoothingCoeff
        );
        res = this.smoothParameter(
          this.smoothedResonance,
          rawResonance,
          this.smoothingCoeff
        );

        // Update smoothed values for next iteration
        this.smoothedCutoff = fc;
        this.smoothedResonance = res;
      }

      // Compute filter coefficient if needed
      const currentG = G !== null ? G : this.prewarpFrequency(fc);

      // Feedback from last stage with resonance
      const feedback = res * this.stage[3];

      // Apply oversampling for better audio quality
      let oversampledInput = inputSample - feedback;

      for (
        let oversample = 0;
        oversample < this.oversampleFactor;
        oversample++
      ) {
        // Apply saturation to input
        const x = this.saturate(oversampledInput);

        // Four cascaded one-pole filters (Topology-Preserving Transform)
        // This implements the classic Moog ladder filter structure
        this.stage[0] += currentG * (x - this.stage[0]);
        this.stage[1] +=
          currentG * (this.saturate(this.stage[0]) - this.stage[1]);
        this.stage[2] +=
          currentG * (this.saturate(this.stage[1]) - this.stage[2]);
        this.stage[3] +=
          currentG * (this.saturate(this.stage[2]) - this.stage[3]);

        // Update input for next oversample iteration
        if (oversample < this.oversampleFactor - 1) {
          oversampledInput = inputSample - res * this.stage[3];
        }
      }

      // Output is the last stage with final saturation
      output[i] = this.saturate(this.stage[3]);
    }

    return true;
  }
}

registerProcessor("moog-zdf-processor", MoogZDFProcessor);
