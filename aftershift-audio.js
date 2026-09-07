(() => {
    let context;
    let masterGain;
    let ambienceGain;
    let sfxGain;
    let ambienceNodes = [];
    let ambienceTimer = null;
    let unlocked = false;

    let config = {
        masterVolume: 0.62,
        ambience: true,
        sfx: true
    };

    function pageProfile() {
        const path = location.pathname.toLowerCase();

        if (path.includes("shift5")) {
            return { root: 41, overtone: 61, noise: 0.010, pulse: 0.008, pingMin: 15000, pingMax: 26000, mood: "nightwatch" };
        }

        if (path.includes("shift4")) {
            return { root: 36, overtone: 54, noise: 0.014, pulse: 0.011, pingMin: 11000, pingMax: 19000, mood: "blackout" };
        }

        if (path.includes("shift3")) {
            return { root: 43, overtone: 64.5, noise: 0.011, pulse: 0.007, pingMin: 13000, pingMax: 22000, mood: "relay" };
        }

        if (path.includes("shift2")) {
            return { root: 48, overtone: 72, noise: 0.009, pulse: 0.006, pingMin: 16000, pingMax: 27000, mood: "identity" };
        }

        if (path.includes("shift1")) {
            return { root: 54, overtone: 81, noise: 0.008, pulse: 0.005, pingMin: 18000, pingMax: 30000, mood: "workstation" };
        }

        return { root: 50, overtone: 75, noise: 0.007, pulse: 0.004, pingMin: 21000, pingMax: 34000, mood: "campaign" };
    }

    function ensureContext() {
        if (context) return context;

        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return null;

        context = new AudioContext();

        masterGain = context.createGain();
        ambienceGain = context.createGain();
        sfxGain = context.createGain();

        ambienceGain.connect(masterGain);
        sfxGain.connect(masterGain);
        masterGain.connect(context.destination);

        applyConfig();
        return context;
    }

    function applyConfig() {
        if (!context || !masterGain || !ambienceGain || !sfxGain) return;

        const now = context.currentTime;
        masterGain.gain.setTargetAtTime(config.masterVolume, now, 0.04);
        ambienceGain.gain.setTargetAtTime(config.ambience ? 1 : 0, now, 0.12);
        sfxGain.gain.setTargetAtTime(config.sfx ? 1 : 0, now, 0.04);
    }

    async function unlock() {
        const ctx = ensureContext();
        if (!ctx) return false;

        if (ctx.state === "suspended") {
            try {
                await ctx.resume();
            } catch {
                return false;
            }
        }

        if (!unlocked) {
            unlocked = true;
            startAmbience();

            window.dispatchEvent(new CustomEvent("aftershift:audioready"));
        }

        return true;
    }

    function stopAmbience() {
        ambienceNodes.forEach(node => {
            try { node.stop?.(); } catch {}
            try { node.disconnect?.(); } catch {}
        });

        ambienceNodes = [];

        if (ambienceTimer) {
            clearTimeout(ambienceTimer);
            ambienceTimer = null;
        }
    }

    function startAmbience() {
        if (!context || ambienceNodes.length) return;

        const profile = pageProfile();

        const osc1 = context.createOscillator();
        const osc2 = context.createOscillator();
        const lowGain = context.createGain();
        const highGain = context.createGain();
        const filter = context.createBiquadFilter();

        osc1.type = "sine";
        osc2.type = "triangle";
        osc1.frequency.value = profile.root;
        osc2.frequency.value = profile.overtone;

        filter.type = "lowpass";
        filter.frequency.value = 190;
        filter.Q.value = 0.7;

        lowGain.gain.value = 0.012;
        highGain.gain.value = 0.0036;

        osc1.connect(lowGain).connect(filter);
        osc2.connect(highGain).connect(filter);
        filter.connect(ambienceGain);

        const lfo = context.createOscillator();
        const lfoGain = context.createGain();
        lfo.type = "sine";
        lfo.frequency.value = profile.mood === "blackout" ? 0.42 : 0.11;
        lfoGain.gain.value = profile.pulse;
        lfo.connect(lfoGain).connect(lowGain.gain);

        const bufferLength = context.sampleRate * 2;
        const buffer = context.createBuffer(1, bufferLength, context.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferLength; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.22;
        }

        const noise = context.createBufferSource();
        const noiseFilter = context.createBiquadFilter();
        const noiseGain = context.createGain();

        noise.buffer = buffer;
        noise.loop = true;
        noiseFilter.type = "bandpass";
        noiseFilter.frequency.value = profile.mood === "blackout" ? 170 : 235;
        noiseFilter.Q.value = 0.7;
        noiseGain.gain.value = profile.noise;

        noise.connect(noiseFilter).connect(noiseGain).connect(ambienceGain);

        osc1.start();
        osc2.start();
        lfo.start();
        noise.start();

        ambienceNodes.push(
            osc1,
            osc2,
            lfo,
            noise,
            lowGain,
            highGain,
            filter,
            lfoGain,
            noiseFilter,
            noiseGain
        );

        scheduleAmbientSignal();
    }

    function scheduleAmbientSignal() {
        if (!unlocked || !context) return;

        const profile = pageProfile();
        const delay = profile.pingMin + Math.random() * (profile.pingMax - profile.pingMin);

        ambienceTimer = setTimeout(() => {
            if (config.ambience && document.visibilityState === "visible") {
                ambientSignal(profile.mood);
            }

            scheduleAmbientSignal();
        }, delay);
    }

    function ambientSignal(mood) {
        if (!context || !config.ambience) return;

        if (mood === "blackout") {
            ambientTone(138, 0.07, 0.008, "square", 111);
            ambientTone(92, 0.18, 0.006, "sine", 73, 0.08);
            return;
        }

        if (mood === "nightwatch") {
            ambientTone(432, 0.08, 0.006, "sine", 648);
            ambientTone(216, 0.14, 0.004, "triangle", 170, 0.06);
            return;
        }

        if (mood === "relay") {
            ambientTone(720, 0.035, 0.004, "square", 580);
            ambientTone(890, 0.028, 0.003, "square", 760, 0.07);
            return;
        }

        ambientTone(640, 0.045, 0.003, "sine", 690);
    }

    function ambientTone(frequency, duration, gain, type, slideTo, when = 0) {
        if (!context || !config.ambience) return;

        const start = context.currentTime + when;
        const osc = context.createOscillator();
        const envelope = context.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, start);

        if (slideTo) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), start + duration);
        }

        envelope.gain.setValueAtTime(0.0001, start);
        envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), start + 0.008);
        envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(envelope).connect(ambienceGain);
        osc.start(start);
        osc.stop(start + duration + 0.02);
    }

    function tone({
        frequency = 440,
        duration = 0.08,
        gain = 0.05,
        type = "sine",
        slideTo = null,
        when = 0
    }) {
        if (!context || !config.sfx) return;

        const start = context.currentTime + when;
        const osc = context.createOscillator();
        const envelope = context.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(frequency, start);

        if (slideTo) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(1, slideTo), start + duration);
        }

        envelope.gain.setValueAtTime(0.0001, start);
        envelope.gain.exponentialRampToValueAtTime(Math.max(0.0002, gain), start + 0.008);
        envelope.gain.exponentialRampToValueAtTime(0.0001, start + duration);

        osc.connect(envelope).connect(sfxGain);
        osc.start(start);
        osc.stop(start + duration + 0.02);
    }

    function sfx(name) {
        if (!unlocked || !context || !config.sfx) return;

        switch (name) {
            case "click":
                tone({ frequency: 690, duration: 0.035, gain: 0.018, type: "square", slideTo: 520 });
                break;

            case "command":
                tone({ frequency: 820, duration: 0.045, gain: 0.026, type: "square", slideTo: 620 });
                tone({ frequency: 420, duration: 0.06, gain: 0.012, type: "sine", when: 0.035 });
                break;

            case "evidence":
                tone({ frequency: 620, duration: 0.09, gain: 0.035, type: "sine", slideTo: 920 });
                tone({ frequency: 920, duration: 0.12, gain: 0.027, type: "sine", when: 0.07, slideTo: 1240 });
                break;

            case "alert":
                tone({ frequency: 520, duration: 0.11, gain: 0.045, type: "square", slideTo: 400 });
                tone({ frequency: 520, duration: 0.11, gain: 0.045, type: "square", when: 0.16, slideTo: 400 });
                break;

            case "success":
                [523.25, 659.25, 783.99].forEach((frequency, index) => {
                    tone({
                        frequency,
                        duration: 0.22,
                        gain: 0.032,
                        type: "sine",
                        when: index * 0.09,
                        slideTo: frequency * 1.03
                    });
                });
                break;

            case "failure":
                tone({ frequency: 180, duration: 0.32, gain: 0.052, type: "sawtooth", slideTo: 74 });
                tone({ frequency: 119, duration: 0.38, gain: 0.026, type: "square", when: 0.08, slideTo: 61 });
                break;

            case "blackout":
                tone({ frequency: 88, duration: 0.55, gain: 0.06, type: "sawtooth", slideTo: 31 });
                tone({ frequency: 47, duration: 0.72, gain: 0.04, type: "sine", when: 0.04, slideTo: 24 });
                break;

            case "nightwatch":
                tone({ frequency: 260, duration: 0.14, gain: 0.025, type: "triangle", slideTo: 390 });
                tone({ frequency: 520, duration: 0.20, gain: 0.018, type: "sine", when: 0.08, slideTo: 410 });
                break;

            case "type":
                tone({
                    frequency: 780 + Math.random() * 180,
                    duration: 0.018,
                    gain: 0.007,
                    type: "square"
                });
                break;
        }
    }

    function configure(next) {
        config = {
            ...config,
            masterVolume: Number.isFinite(Number(next.masterVolume))
                ? Math.max(0, Math.min(1, Number(next.masterVolume)))
                : config.masterVolume,
            ambience: next.ambience !== undefined ? Boolean(next.ambience) : config.ambience,
            sfx: next.sfx !== undefined ? Boolean(next.sfx) : config.sfx
        };

        applyConfig();
    }

    function hookInteractions() {
        const unlockOnce = () => {
            unlock();
            window.removeEventListener("pointerdown", unlockOnce, true);
            window.removeEventListener("keydown", unlockOnce, true);
        };

        window.addEventListener("pointerdown", unlockOnce, true);
        window.addEventListener("keydown", unlockOnce, true);

        document.addEventListener("click", event => {
            const button = event.target.closest(
                "button, [role='button'], .menu-button, .nav, .quick-action, .inspect-button, .decision-button"
            );

            if (!button) return;

            unlock().then(() => sfx("click"));
        }, true);

        document.addEventListener("keydown", event => {
            const target = event.target;
            if (!target) return;

            if (target.matches("#terminal-input, .terminal input, input[data-terminal], input[type='text']")) {
                if (event.key === "Enter") {
                    unlock().then(() => sfx("command"));
                } else if (event.key.length === 1 && Math.random() < 0.32) {
                    sfx("type");
                }
            }
        }, true);
    }

    window.AftershiftAudio = {
        unlock,
        configure,
        sfx,
        stopAmbience,
        isReady: () => unlocked
    };

    hookInteractions();
})();
