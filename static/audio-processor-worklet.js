// source: https://github.com/Azure-Samples/aisearch-openai-rag-audio/blob/7f685a8969e3b63e8c3ef345326c21f5ab82b1c3/app/frontend/public/audio-processor-worklet.js
const MIN_INT16 = -0x8000;
const MAX_INT16 = 0x7fff;

class AudioProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.isRecording = false;
    }

    process(inputs, outputs, parameters) {
        if (!this.isRecording) return true;
        
        const input = inputs[0];
        if (input.length > 0) {
            const audioData = input[0];
            this.port.postMessage({
                eventType: 'audio',
                audioData: Array.from(audioData)
            });
        }
        
        return true;
    }
}

registerProcessor('audio-processor', AudioProcessor);
