// ===== ELSA Audio Manager =====
class AudioManager {
  constructor() {
    this.audioContext = null;
    this.noiseSource = null;
    this.noiseGain = null;
    this.currentNoiseType = null;
    this.volume = 0.3;
  }

  _init() {
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
  }

  // Generate and play background noise
  playNoise(type) {
    this._init();
    this.stopNoise();

    const sampleRate = this.audioContext.sampleRate;
    const bufferSize = 2 * sampleRate;
    const buffer = this.audioContext.createBuffer(1, bufferSize, sampleRate);
    const output = buffer.getChannelData(0);

    if (type === 'white') {
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }
    } else if (type === 'pink') {
      let b0=0,b1=0,b2=0,b3=0,b4=0,b5=0,b6=0;
      for (let i = 0; i < bufferSize; i++) {
        const w = Math.random() * 2 - 1;
        b0 = 0.99886*b0 + w*0.0555179;
        b1 = 0.99332*b1 + w*0.0750759;
        b2 = 0.96900*b2 + w*0.1538520;
        b3 = 0.86650*b3 + w*0.3104856;
        b4 = 0.55000*b4 + w*0.5329522;
        b5 = -0.7616*b5 - w*0.0168980;
        output[i] = (b0+b1+b2+b3+b4+b5+b6+w*0.5362) * 0.11;
        b6 = w * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0;
      for (let i = 0; i < bufferSize; i++) {
        const w = Math.random() * 2 - 1;
        output[i] = (lastOut + 0.02*w) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
      }
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    this.noiseGain = this.audioContext.createGain();
    this.noiseGain.gain.value = this.volume;

    source.connect(this.noiseGain);
    this.noiseGain.connect(this.audioContext.destination);
    source.start(0);

    this.noiseSource = source;
    this.currentNoiseType = type;
  }

  stopNoise() {
    if (this.noiseSource) {
      try { this.noiseSource.stop(); } catch(e) {}
      this.noiseSource = null;
    }
    this.currentNoiseType = null;
  }

  setVolume(vol) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.noiseGain) {
      this.noiseGain.gain.setTargetAtTime(this.volume, this.audioContext.currentTime, 0.1);
    }
  }

  isPlaying(type) {
    return this.currentNoiseType === type;
  }

  // Play beep when timer completes
  playBeep(frequency = 800, duration = 0.6) {
    this._init();
    const osc = this.audioContext.createOscillator();
    const gain = this.audioContext.createGain();
    osc.connect(gain);
    gain.connect(this.audioContext.destination);

    osc.frequency.value = frequency;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.5, this.audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + duration);

    osc.start(this.audioContext.currentTime);
    osc.stop(this.audioContext.currentTime + duration);
  }

  // Play success chime (3 notes)
  playChime() {
    this._init();
    const notes = [523, 659, 784]; // C5, E5, G5
    notes.forEach((freq, i) => {
      setTimeout(() => this.playBeep(freq, 0.4), i * 200);
    });
  }
}

window.audio = new AudioManager();
