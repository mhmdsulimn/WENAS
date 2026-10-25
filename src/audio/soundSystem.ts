/**
 * Procedural Web Audio API sound synthesizer
 * Zero external audio files (100% reliable, zero 404 dependencies)
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private heartbeatTimer: number | null = null;

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public playClick(type: 'subtle' | 'action' | 'reset' = 'subtle') {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      const now = this.ctx.currentTime;
      if (type === 'action') {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(440, now + 0.08);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (type === 'reset') {
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
        gain.gain.setValueAtTime(0.06, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.12);
      } else {
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.03, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio fallback silent
    }
  }

  /**
   * Heartbeat sound effect (lub-dub)
   */
  public playHeartbeatPulse() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Lub (First sound)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(65, now);
      osc1.frequency.exponentialRampToValueAtTime(40, now + 0.08);
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.08);

      // Dub (Second sound, slight delay)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(80, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(45, now + 0.22);
      gain2.gain.setValueAtTime(0.08, now + 0.12);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.12);
      osc2.stop(now + 0.22);
    } catch {
      // ignore
    }
  }

  /**
   * Soothing melodic voice synthesis & mint aroma hiss sound for Stress Intervention
   */
  public playSoothingVoiceAndMintAroma() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Gentle vocal harmonic chord (Acoustic comforting chime)
      const frequencies = [329.63, 392.00, 493.88, 587.33]; // E4, G4, B4, D5 (Warm Em7 chord)
      frequencies.forEach((freq, index) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + index * 0.15);
        gain.gain.setValueAtTime(0.001, now + index * 0.15);
        gain.gain.linearRampToValueAtTime(0.04, now + index * 0.15 + 0.2);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8 + index * 0.1);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + index * 0.15);
        osc.stop(now + 2.4);
      });

      // Procedural white noise burst filtered for mint scent micro-nebulizer spray
      const bufferSize = this.ctx.sampleRate * 0.8;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2800, now + 0.4);
      filter.Q.setValueAtTime(3.0, now + 0.4);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.001, now + 0.4);
      noiseGain.gain.linearRampToValueAtTime(0.03, now + 0.6);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);
      noise.start(now + 0.4);
      noise.stop(now + 1.2);
    } catch {
      // ignore
    }
  }

  /**
   * Critical NASA telemetry alarm siren
   */
  public playEmergencyAlarm() {
    if (this.isMuted) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      // Two-tone piercing tactical alarm
      for (let i = 0; i < 3; i++) {
        const toneStart = now + i * 0.28;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1046.5, toneStart); // C6
        osc.frequency.setValueAtTime(880.0, toneStart + 0.14); // A5

        gain.gain.setValueAtTime(0.08, toneStart);
        gain.gain.exponentialRampToValueAtTime(0.001, toneStart + 0.26);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(toneStart);
        osc.stop(toneStart + 0.27);
      }
    } catch {
      // ignore
    }
  }

  public destroy() {
    if (this.heartbeatTimer) {
      window.clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}

export const sound = new SoundSystem();
