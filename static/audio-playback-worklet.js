// source: https://github.com/Azure-Samples/aisearch-openai-rag-audio/blob/7f685a8969e3b63e8c3ef345326c21f5ab82b1c3/app/frontend/public/audio-playback-worklet.js
class AudioPlaybackProcessor extends AudioWorkletProcessor {
    constructor() {
        super();
        this.audioQueue = [];
        this.isPlaying = false;
        
        this.port.onmessage = (event) => {
            if (event.data.type === 'audio') {
                this.audioQueue.push(new Float32Array(event.data.audio));
            }
        };
    }

    process(inputs, outputs, parameters) {
        const output = outputs[0];
        if (output.length === 0) return true;
        
        if (this.audioQueue.length > 0) {
            const audioData = this.audioQueue.shift();
            for (let channel = 0; channel < output.length; channel++) {
                const outputChannel = output[channel];
                for (let i = 0; i < outputChannel.length; i++) {
                    outputChannel[i] = i < audioData.length ? audioData[i] : 0;
                }
            }
        }
        
        return true;
    }
}

registerProcessor('audio-playback', AudioPlaybackProcessor);
