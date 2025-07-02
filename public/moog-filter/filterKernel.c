/*
 *  compilation directive
 *
 *  emcc -O3 -s WASM=1 filterKernel.c -o filterKernel.wasm --no-entry
 */

#include <emscripten.h>
#include <math.h>
#include <stdio.h>

#define WEBEAUDIO_FRAME_SIZE 128
#define SAMPLE_RATE 44100.0f

static float inputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

// Filter parameters
static float cutoff = 0.5f;    // normalized 0.0–1.0
static float resonance = 0.0f; // normalized 0.0–1.0
static float modValue = 0.0f;  // modulation input

// Envelope state
static float envelopeValue = 0.0f;
static float envelopeTarget = 0.0f;
static float envelopeRate = 0.0f;
static int envelopeStage = 0; // 0=idle, 1=attack, 2=decay, 3=sustain, 4=release

// Filter state (4-pole ladder)
static float stage1 = 0.0f;
static float stage2 = 0.0f;
static float stage3 = 0.0f;
static float stage4 = 0.0f;

// Envelope parameters
static float attackTime = 0.001f;
static float decayTime = 0.1f;
static float sustainLevel = 0.5f;
static float releaseTime = 0.1f;
static float contourAmount = 0.5f;

// Key tracking
static float baseCutoff = 0.5f;
static float keyTracking = 0.0f;
static int currentNote = 60; // C4

EMSCRIPTEN_KEEPALIVE
float* inputBufferPtr() {
    return inputBuffer;
}

EMSCRIPTEN_KEEPALIVE
float* outputBufferPtr() {
    return outputBuffer;
}

EMSCRIPTEN_KEEPALIVE
void setCutoff(float c) {
    cutoff = c;
}

EMSCRIPTEN_KEEPALIVE
void setResonance(float r) {
    resonance = r;
}

EMSCRIPTEN_KEEPALIVE
void setModValue(float m) {
    modValue = m;
}

EMSCRIPTEN_KEEPALIVE
void setEnvelopeParams(float attack, float decay, float sustain, float release, float contour) {
    attackTime = attack;
    decayTime = decay;
    sustainLevel = sustain;
    releaseTime = release;
    contourAmount = contour;
}

EMSCRIPTEN_KEEPALIVE
void setKeyTracking(float base, float tracking, int note) {
    baseCutoff = base;
    keyTracking = tracking;
    currentNote = note;
}

EMSCRIPTEN_KEEPALIVE
void triggerEnvelope() {
    envelopeStage = 1; // Attack
    envelopeValue = 0.0f;
    envelopeTarget = 1.0f;
    envelopeRate = 1.0f / (attackTime * SAMPLE_RATE);
}

EMSCRIPTEN_KEEPALIVE
void releaseEnvelope() {
    envelopeStage = 4; // Release
    envelopeTarget = 0.0f;
    envelopeRate = 1.0f / (releaseTime * SAMPLE_RATE);
}

EMSCRIPTEN_KEEPALIVE
float getCutoff() {
    return cutoff;
}

EMSCRIPTEN_KEEPALIVE
float getResonance() {
    return resonance;
}

// Moog ladder filter implementation
static float moogFilter(float input) {
    // Calculate current cutoff with envelope and modulation
    float currentCutoff = cutoff;

    // Apply key tracking
    if (keyTracking > 0.0f) {
        float noteOffset = (currentNote - 60) / 12.0f; // Semitones from C4
        currentCutoff *= powf(2.0f, noteOffset * keyTracking);
    }

    // Apply envelope
    if (envelopeStage > 0) {
        currentCutoff *= (1.0f + envelopeValue * contourAmount);
    }

    // Apply modulation
    currentCutoff *= (1.0f + modValue * 0.5f);

    // Clamp cutoff
    currentCutoff = fmaxf(0.001f, fminf(0.999f, currentCutoff));

    // Convert to filter coefficients
    float fc = currentCutoff;
    float res = resonance * 4.0f; // Scale resonance

    // Moog ladder filter coefficients
    float f = fc * 1.16f;
    float fb = res * (1.0f - 0.15f * f * f);

    // Process through 4-pole ladder
    float input1 = input - fb * stage4;
    stage1 = input1 * f + stage1 * (1.0f - f);
    stage2 = stage1 * f + stage2 * (1.0f - f);
    stage3 = stage2 * f + stage3 * (1.0f - f);
    stage4 = stage3 * f + stage4 * (1.0f - f);

    return stage4;
}

EMSCRIPTEN_KEEPALIVE
void filter() {
    // Update envelope
    if (envelopeStage > 0) {
        if (envelopeStage == 1) { // Attack
            envelopeValue += envelopeRate;
            if (envelopeValue >= 1.0f) {
                envelopeValue = 1.0f;
                envelopeStage = 2; // Decay
                envelopeTarget = sustainLevel;
                envelopeRate = 1.0f / (decayTime * SAMPLE_RATE);
            }
        } else if (envelopeStage == 2) { // Decay
            envelopeValue -= envelopeRate;
            if (envelopeValue <= sustainLevel) {
                envelopeValue = sustainLevel;
                envelopeStage = 3; // Sustain
            }
        } else if (envelopeStage == 4) { // Release
            envelopeValue -= envelopeRate;
            if (envelopeValue <= 0.0f) {
                envelopeValue = 0.0f;
                envelopeStage = 0; // Idle
            }
        }
    }

    // Process audio through filter
    for (int i = 0; i < WEBEAUDIO_FRAME_SIZE; i++) {
        outputBuffer[i] = moogFilter(inputBuffer[i]);
    }
}

