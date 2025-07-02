/*
 *  compilation directive
 *
 *  emcc -O3 -s WASM=1 filterKernel.c -o filterKernel.wasm --no-entry
 */

#include <emscripten.h>

#define WEBEAUDIO_FRAME_SIZE 128

static float inputBuffer[WEBEAUDIO_FRAME_SIZE];
static float outputBuffer[WEBEAUDIO_FRAME_SIZE];

static float cutoff = 0.5f;    // normalized 0.0–1.0
static float resonance = 0.0f; // normalized 0.0–1.0

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
    void filter() {
        //  just copy in to out !
        for (int i=0 ; i<128 ; i++) {
            outputBuffer[i] = inputBuffer[i];
        }
    }

