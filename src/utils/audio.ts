class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private bgMusicNode: AudioBufferSourceNode | null = null;
  private bgGainNode: GainNode | null = null;
  private isBgMusicPlaying: boolean = false;
  private activeReactionNodes: { [key: string]: { stop: () => void } } = {};

  constructor() {
    // Lazy AudioContext initialization
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      if (this.bgGainNode) {
        this.bgGainNode.gain.setTargetAtTime(0, this.ctx?.currentTime || 0, 0.1);
      }
    } else {
      if (this.bgGainNode) {
        this.bgGainNode.gain.setTargetAtTime(0.15, this.ctx?.currentTime || 0, 0.1);
      }
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public getIsBgMusicPlaying(): boolean {
    return this.isBgMusicPlaying;
  }

  // Water pouring sound
  public playPourWater() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const duration = 0.8;
    const bufferSize = this.ctx.sampleRate * duration;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(600, this.ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(1200, this.ctx.currentTime + duration);
    filter.Q.value = 3;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.15, this.ctx.currentTime + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
  }

  // Dropper drop drip sound
  public playDrip() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.12);
  }

  // Sizzle / Fizzing sound for metals in water
  public startSizzle(metalId: string, durationSec: number = 3) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    this.stopSizzle(metalId);

    const bufferSize = this.ctx.sampleRate * durationSec;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(2000, this.ctx.currentTime);

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.1, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.2, this.ctx.currentTime + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + durationSec);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    noise.start();

    this.activeReactionNodes[metalId] = {
      stop: () => {
        try {
          noise.stop();
        } catch {
          // ignore
        }
      },
    };
  }

  public stopSizzle(metalId: string) {
    if (this.activeReactionNodes[metalId]) {
      this.activeReactionNodes[metalId].stop();
      delete this.activeReactionNodes[metalId];
    }
  }

  // Flame crackle and pops for K, Na
  public playFlamePop() {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150 + Math.random() * 200, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(40, this.ctx.currentTime + 0.1);

    gain.gain.setValueAtTime(0.25, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.1);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.1);
  }

  // Loud explosion sound for Rb, Cs
  public playExplosion(isCesium: boolean = false) {
    if (this.isMuted) return;
    this.initCtx();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;

    // Sub-bass boom oscillator
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(isCesium ? 180 : 150, now);
    osc.frequency.exponentialRampToValueAtTime(20, now + 0.6);

    oscGain.gain.setValueAtTime(isCesium ? 0.6 : 0.45, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

    osc.connect(oscGain);
    oscGain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.6);

    // Noise blast
    const bufferSize = this.ctx.sampleRate * 0.7;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);
    filter.frequency.exponentialRampToValueAtTime(100, now + 0.7);

    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(isCesium ? 0.7 : 0.5, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);

    noise.start(now);
  }

  // Background Synth Music Generator (Relaxing Science Laboratory Ambient)
  public toggleBackgroundMusic(): boolean {
    this.initCtx();
    if (!this.ctx) return false;

    if (this.isBgMusicPlaying) {
      this.stopBackgroundMusic();
      return false;
    } else {
      this.startBackgroundMusic();
      return true;
    }
  }

  public startBackgroundMusic() {
    this.initCtx();
    if (!this.ctx) return;

    this.stopBackgroundMusic();

    this.bgGainNode = this.ctx.createGain();
    this.bgGainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.ctx.currentTime);
    this.bgGainNode.connect(this.ctx.destination);

    // Create a 8-bar soothing ambient synth arpeggio buffer
    const duration = 8.0;
    const sampleRate = this.ctx.sampleRate;
    const buffer = this.ctx.createBuffer(2, sampleRate * duration, sampleRate);
    const left = buffer.getChannelData(0);
    const right = buffer.getChannelData(1);

    // Chord notes in Hz (Pentatonic C major: C4, E4, G4, A4, C5, D5, E5)
    const freqs = [261.63, 329.63, 392.0, 440.0, 523.25, 587.33, 659.25];
    const sequence = [0, 2, 4, 3, 1, 4, 6, 2, 0, 3, 5, 2, 1, 4, 2, 0];

    const noteTime = duration / sequence.length;

    for (let i = 0; i < buffer.length; i++) {
      const t = i / sampleRate;
      const stepIndex = Math.floor(t / noteTime) % sequence.length;
      const freq = freqs[sequence[stepIndex]];
      const noteLocalTime = t % noteTime;

      // Soft envelope
      const env = Math.exp(-4 * noteLocalTime) * Math.sin(Math.PI * (noteLocalTime / noteTime));
      const val = Math.sin(2 * Math.PI * freq * t) * env * 0.2;

      left[i] = val + Math.sin(2 * Math.PI * (freq * 1.002) * t) * env * 0.1;
      right[i] = val + Math.sin(2 * Math.PI * (freq * 0.998) * t) * env * 0.1;
    }

    const source = this.ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;
    source.connect(this.bgGainNode);
    source.start();

    this.bgMusicNode = source;
    this.isBgMusicPlaying = true;
  }

  public stopBackgroundMusic() {
    if (this.bgMusicNode) {
      try {
        this.bgMusicNode.stop();
      } catch {
        // ignore
      }
      this.bgMusicNode = null;
    }
    this.isBgMusicPlaying = false;
  }
}

export const soundEngine = new SoundEngine();
