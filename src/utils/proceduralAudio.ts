/**
 * Zero-404 Procedural Web Audio API sound generator for Arab Taxi Simulator.
 * Synthesizes engine RPM, authentic Arab taxi horn, turn signals, taximeter beeps,
 * coin drops, and authentic Arabic radio stations with oriental scales (Bayati, Rast, Hijaz).
 */

class ProceduralAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  // Engine sound nodes
  private engineMasterGain: GainNode | null = null;
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private subOsc: OscillatorNode | null = null;
  private filter: BiquadFilterNode | null = null;
  private engineRunning: boolean = false;

  // Radio nodes
  private radioMasterGain: GainNode | null = null;
  private radioInterval: number | null = null;
  private currentStationIndex: number = 0;
  private radioPlaying: boolean = false;

  // Arabic Maqam Frequencies (in Hz, approx tuned for oriental synth)
  // Rast & Bayati flavor notes in 4th octave:
  // C4, D4, E4-half-flat (~311), F4, G4, A4-half-flat (~415), Bb4, C5
  private readonly maqamBayati = [261.63, 293.66, 311.13, 349.23, 392.00, 415.30, 466.16, 523.25];
  private readonly maqamHijaz = [261.63, 277.18, 329.63, 349.23, 392.00, 415.30, 466.16, 523.25];
  private readonly maqamRast = [261.63, 293.66, 320.00, 349.23, 392.00, 440.00, 493.88, 523.25];

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public init() {
    this.getContext();
  }

  public startEngine() {
    if (this.engineRunning) return;
    const ctx = this.getContext();

    this.engineMasterGain = ctx.createGain();
    this.engineMasterGain.gain.setValueAtTime(this.isMuted ? 0 : 0.18, ctx.currentTime);

    this.filter = ctx.createBiquadFilter();
    this.filter.type = 'lowpass';
    this.filter.frequency.setValueAtTime(320, ctx.currentTime);
    this.filter.Q.setValueAtTime(2.5, ctx.currentTime);

    // Fundamental cylinder rumble
    this.osc1 = ctx.createOscillator();
    this.osc1.type = 'sawtooth';
    this.osc1.frequency.setValueAtTime(35, ctx.currentTime);

    // 2nd harmonic
    this.osc2 = ctx.createOscillator();
    this.osc2.type = 'triangle';
    this.osc2.frequency.setValueAtTime(70, ctx.currentTime);

    // Deep sub bass
    this.subOsc = ctx.createOscillator();
    this.subOsc.type = 'sine';
    this.subOsc.frequency.setValueAtTime(28, ctx.currentTime);

    this.osc1.connect(this.filter);
    this.osc2.connect(this.filter);
    this.subOsc.connect(this.filter);
    this.filter.connect(this.engineMasterGain);
    this.engineMasterGain.connect(ctx.destination);

    this.osc1.start();
    this.osc2.start();
    this.subOsc.start();
    this.engineRunning = true;
  }

  public updateEngine(speedKmh: number, isAccelerating: boolean) {
    if (!this.engineRunning || !this.ctx || !this.osc1 || !this.osc2 || !this.subOsc || !this.filter) return;

    const baseRpmFreq = 30 + Math.abs(speedKmh) * 1.8 + (isAccelerating ? 22 : 0);
    const now = this.ctx.currentTime;

    this.osc1.frequency.setTargetAtTime(Math.min(baseRpmFreq, 180), now, 0.08);
    this.osc2.frequency.setTargetAtTime(Math.min(baseRpmFreq * 1.8, 320), now, 0.08);
    this.subOsc.frequency.setTargetAtTime(Math.min(baseRpmFreq * 0.7, 90), now, 0.08);

    const filterFreq = 280 + Math.abs(speedKmh) * 18 + (isAccelerating ? 450 : 0);
    this.filter.frequency.setTargetAtTime(Math.min(filterFreq, 2200), now, 0.08);
  }

  /**
   * Classic Arab Taxi double-honk ("طط! طط!") or single honk
   */
  public playHorn(doubleHonk: boolean = true) {
    if (this.isMuted) return;
    const ctx = this.getContext();

    const triggerHonk = (delay: number, duration: number) => {
      const oscHigh = ctx.createOscillator();
      const oscLow = ctx.createOscillator();
      const gain = ctx.createGain();

      oscHigh.type = 'sawtooth';
      oscLow.type = 'sawtooth';

      // Classic European/Arab cab dual frequency
      oscHigh.frequency.setValueAtTime(440, ctx.currentTime + delay);
      oscLow.frequency.setValueAtTime(349, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.25, ctx.currentTime + delay + 0.02);
      gain.gain.setValueAtTime(0.25, ctx.currentTime + delay + duration - 0.02);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + duration);

      oscHigh.connect(gain);
      oscLow.connect(gain);
      gain.connect(ctx.destination);

      oscHigh.start(ctx.currentTime + delay);
      oscLow.start(ctx.currentTime + delay);
      oscHigh.stop(ctx.currentTime + delay + duration + 0.05);
      oscLow.stop(ctx.currentTime + delay + duration + 0.05);
    };

    if (doubleHonk) {
      triggerHonk(0, 0.12);
      triggerHonk(0.18, 0.16);
    } else {
      triggerHonk(0, 0.28);
    }
  }

  /**
   * Turn signal click-clack
   */
  public playBlinkerClick() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1400, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.03);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.035);
  }

  /**
   * Taximeter beep
   */
  public playMeterBeep() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1800, ctx.currentTime);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.1);
  }

  /**
   * Cash / coins drop on passenger payment
   */
  public playPaymentSound() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const pitches = [1800, 2400, 3200, 2800, 3600];

    pitches.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = idx * 0.06;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.18);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.2);
    });
  }

  /**
   * Sound when passenger is startled or gasps on hard braking/reckless swerving
   */
  public playPassengerGasp() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    // Sharp vocal formant pitch sweep
    osc.frequency.setValueAtTime(320, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(750, ctx.currentTime + 0.12);
    osc.frequency.exponentialRampToValueAtTime(420, ctx.currentTime + 0.28);

    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(3.5, ctx.currentTime);

    gain.gain.setValueAtTime(0.01, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.32);
  }

  /**
   * Pleasant approval chime when passenger is pleased with driving or polite reply
   */
  public playPassengerHappy() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 major triad

    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = i * 0.07;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.09, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.25);
    });
  }

  /**
   * Sound effect for speech bubble / dialogue message pop
   */
  public playDialoguePop() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(1320, ctx.currentTime + 0.06);

    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.09);
  }

  /**
   * Sound effect for successfully fulfilling a passenger's request (AC, radio, speed)
   */
  public playRequestFulfilled() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const delay = idx * 0.05;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + delay);

      gain.gain.setValueAtTime(0, ctx.currentTime + delay);
      gain.gain.linearRampToValueAtTime(0.12, ctx.currentTime + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + delay);
      osc.stop(ctx.currentTime + delay + 0.22);
    });
  }

  /**
   * In-cab AC compressor hum & click sound
   */
  public playAcToggleSound(turnOn: boolean) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = turnOn ? 'triangle' : 'sine';
    osc.frequency.setValueAtTime(turnOn ? 450 : 250, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(turnOn ? 120 : 80, ctx.currentTime + 0.15);

    gain.gain.setValueAtTime(0.09, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.16);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.18);
  }

  /**
   * Arabic Taxi Radio: Procedural Oriental synth melodies (Oud & Kanun style)
   */
  public toggleRadio(): boolean {
    if (this.radioPlaying) {
      this.stopRadio();
      return false;
    } else {
      this.startRadio();
      return true;
    }
  }

  public setStation(index: number) {
    this.currentStationIndex = index;
    this.playRadioTuningHiss();
  }

  private playRadioTuningHiss() {
    if (this.isMuted) return;
    const ctx = this.getContext();
    // Short burst of white noise for realistic radio frequency scan
    const bufferSize = ctx.sampleRate * 0.15;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.12;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(1200, ctx.currentTime);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start();
  }

  public startRadio() {
    const ctx = this.getContext();
    this.radioPlaying = true;
    this.playRadioTuningHiss();

    let step = 0;
    this.radioInterval = window.setInterval(() => {
      if (!this.radioPlaying || this.isMuted) return;

      const scales = [this.maqamBayati, this.maqamHijaz, this.maqamRast];
      const activeScale = scales[this.currentStationIndex % scales.length];

      // Procedural melodic phrase generator
      const noteIdx = Math.floor(Math.sin(step * 0.4) * 3 + 3.5) % activeScale.length;
      const freq = activeScale[noteIdx];
      step++;

      // Synth Oud/Kanun plucked note
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.35);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.45);

      // Percussion darbuka / doff tap on odd beats
      if (step % 2 === 0) {
        const percussionOsc = ctx.createOscillator();
        const percGain = ctx.createGain();
        percussionOsc.type = 'sine';
        percussionOsc.frequency.setValueAtTime(110, ctx.currentTime);
        percussionOsc.frequency.exponentialRampToValueAtTime(30, ctx.currentTime + 0.08);

        percGain.gain.setValueAtTime(0.07, ctx.currentTime);
        percGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);

        percussionOsc.connect(percGain);
        percGain.connect(ctx.destination);
        percussionOsc.start();
        percussionOsc.stop(ctx.currentTime + 0.1);
      }
    }, 280);
  }

  public stopRadio() {
    this.radioPlaying = false;
    if (this.radioInterval !== null) {
      clearInterval(this.radioInterval);
      this.radioInterval = null;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.engineMasterGain && this.ctx) {
      this.engineMasterGain.gain.setValueAtTime(muted ? 0 : 0.18, this.ctx.currentTime);
    }
  }

  public isAudioMuted(): boolean {
    return this.isMuted;
  }

  public isRadioOn(): boolean {
    return this.radioPlaying;
  }

  public dispose() {
    this.stopRadio();
    if (this.osc1) this.osc1.stop();
    if (this.osc2) this.osc2.stop();
    if (this.subOsc) this.subOsc.stop();
    this.engineRunning = false;
    if (this.ctx) {
      this.ctx.close();
      this.ctx = null;
    }
  }
}

export const proceduralAudio = new ProceduralAudioEngine();
