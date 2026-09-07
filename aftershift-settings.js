(() => {
    const KEY = "aftershift_settings_v1";

    const defaults = {
        language: "en",
        theme: "northstar",
        masterVolume: 0.62,
        ambience: true,
        sfx: true,
        reducedMotion: false
    };

    function load() {
        try {
            return { ...defaults, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
        } catch {
            return { ...defaults };
        }
    }

    let settings = load();

    function save() {
        localStorage.setItem(KEY, JSON.stringify(settings));
    }

    function emit() {
        window.dispatchEvent(new CustomEvent("aftershift:settingschange", {
            detail: { ...settings }
        }));
    }

    function canUseNightwatchTheme() {
        return localStorage.getItem("aftershift_epilogue_unlocked") === "true";
    }

    function shiftNumber() {
        const match = location.pathname.toLowerCase().match(/shift([1-5])\.html/);
        return match ? Number(match[1]) : 0;
    }

    function adaptiveTheme() {
        const shift = shiftNumber();

        if (shift === 2) return "amber";
        if (shift === 3) return "ice";
        if (shift === 4) return "amber";
        if (shift === 5 && canUseNightwatchTheme()) return "nightwatch";
        if (shift === 5) return "ice";

        return "northstar";
    }

    function resolvedTheme() {
        return settings.theme === "adaptive" ? adaptiveTheme() : settings.theme;
    }

    function normalize() {
        if (!["en", "ar"].includes(settings.language)) settings.language = "en";

        if (!["northstar", "amber", "ice", "nightwatch", "adaptive"].includes(settings.theme)) {
            settings.theme = "northstar";
        }

        if (settings.theme === "nightwatch" && !canUseNightwatchTheme()) {
            settings.theme = "northstar";
        }

        const volume = Number(settings.masterVolume);
        settings.masterVolume = Number.isFinite(volume)
            ? Math.max(0, Math.min(1, volume))
            : defaults.masterVolume;

        settings.ambience = Boolean(settings.ambience);
        settings.sfx = Boolean(settings.sfx);
        settings.reducedMotion = Boolean(settings.reducedMotion);
    }

    function apply() {
        normalize();

        document.documentElement.dataset.aftershiftTheme = resolvedTheme();
        document.documentElement.dataset.aftershiftThemeChoice = settings.theme;
        document.documentElement.dataset.aftershiftReducedMotion = String(settings.reducedMotion);
        document.documentElement.lang = settings.language;
        document.documentElement.dir = settings.language === "ar" ? "rtl" : "ltr";

        if (window.AftershiftI18n) {
            window.AftershiftI18n.setLanguage(settings.language);
        }

        if (window.AftershiftAudio) {
            window.AftershiftAudio.configure(settings);
        }
    }

    function update(partial) {
        settings = { ...settings, ...partial };
        normalize();
        save();
        apply();
        render();
        emit();
    }

    function themeCard(value, label, color) {
        const locked = value === "nightwatch" && !canUseNightwatchTheme();

        return `
            <button
                type="button"
                class="as-theme-card"
                data-as-theme="${value}"
                aria-pressed="${settings.theme === value}"
                ${locked ? "disabled" : ""}
            >
                <span class="as-theme-preview" style="--preview-color:${color}">
                    <i></i><i></i><i></i>
                </span>
                <span>${label}</span>
            </button>
        `;
    }

    function injectPanel() {
        if (document.getElementById("as-settings-button")) return;

        const button = document.createElement("button");
        button.id = "as-settings-button";
        button.className = "as-settings-button";
        button.type = "button";
        button.setAttribute("aria-label", "Settings");
        button.textContent = "⚙";

        const panel = document.createElement("section");
        panel.id = "as-settings-panel";
        panel.className = "as-settings-panel";
        panel.hidden = true;

        panel.innerHTML = `
            <div class="as-settings-head">
                <strong data-as-setting-title>OPERATOR SETTINGS</strong>
                <button class="as-settings-close" type="button" aria-label="Close">×</button>
            </div>

            <div class="as-settings-body">
                <div class="as-setting">
                    <div class="as-setting-label">
                        <span data-as-label="language">LANGUAGE</span>
                    </div>
                    <select data-as-control="language">
                        <option value="en">English</option>
                        <option value="ar">العربية</option>
                    </select>
                </div>

                <div class="as-setting">
                    <div class="as-setting-label">
                        <span data-as-label="theme">INTERFACE THEME</span>
                    </div>
                    <div class="as-theme-grid" data-as-theme-grid></div>
                    <div class="as-theme-lock" data-as-nightwatch-note></div>
                </div>

                <div class="as-setting">
                    <div class="as-setting-label">
                        <span data-as-label="volume">MASTER VOLUME</span>
                        <span data-as-volume-value></span>
                    </div>
                    <input data-as-control="volume" type="range" min="0" max="100" step="1">
                </div>

                <div class="as-setting">
                    <div class="as-setting-label">
                        <span data-as-label="audio">AUDIO</span>
                    </div>

                    <div class="as-toggle-row">
                        <button class="as-toggle" type="button" data-as-toggle="ambience">AMBIENCE</button>
                        <button class="as-toggle" type="button" data-as-toggle="sfx">SFX</button>
                    </div>

                    <div class="as-audio-status" data-as-audio-status></div>
                </div>

                <div class="as-setting">
                    <div class="as-setting-label">
                        <span data-as-label="motion">ACCESSIBILITY</span>
                    </div>

                    <div class="as-toggle-row">
                        <button class="as-toggle" type="button" data-as-toggle="reducedMotion">REDUCED MOTION</button>
                    </div>
                </div>
            </div>
        `;

        document.body.append(button, panel);

        const close = panel.querySelector(".as-settings-close");
        const language = panel.querySelector('[data-as-control="language"]');
        const volume = panel.querySelector('[data-as-control="volume"]');

        button.addEventListener("click", async () => {
            panel.hidden = !panel.hidden;

            if (!panel.hidden && window.AftershiftAudio) {
                await window.AftershiftAudio.unlock();
            }

            render();
        });

        close.addEventListener("click", () => {
            panel.hidden = true;
        });

        language.addEventListener("change", () => update({ language: language.value }));
        volume.addEventListener("input", () => update({ masterVolume: Number(volume.value) / 100 }));

        panel.addEventListener("click", event => {
            const theme = event.target.closest("[data-as-theme]");

            if (theme && !theme.disabled) {
                update({ theme: theme.dataset.asTheme });
                return;
            }

            const toggle = event.target.closest("[data-as-toggle]");

            if (toggle) {
                const key = toggle.dataset.asToggle;
                update({ [key]: !settings[key] });
            }
        });

        window.addEventListener("aftershift:languagechange", render);
        window.addEventListener("aftershift:settingschange", render);
        window.addEventListener("aftershift:audioready", render);

        render();
    }

    function render() {
        const panel = document.getElementById("as-settings-panel");
        if (!panel) return;

        panel.querySelector('[data-as-control="language"]').value = settings.language;
        panel.querySelector('[data-as-control="volume"]').value = Math.round(settings.masterVolume * 100);
        panel.querySelector("[data-as-volume-value]").textContent = `${Math.round(settings.masterVolume * 100)}%`;

        const ar = settings.language === "ar";

        panel.querySelector("[data-as-setting-title]").textContent =
            ar ? "إعدادات المشغّل" : "OPERATOR SETTINGS";

        const labels = {
            language: ar ? "اللغة" : "LANGUAGE",
            theme: ar ? "ثيم الواجهة" : "INTERFACE THEME",
            volume: ar ? "مستوى الصوت" : "MASTER VOLUME",
            audio: ar ? "الصوت" : "AUDIO",
            motion: ar ? "إمكانية الوصول" : "ACCESSIBILITY"
        };

        Object.entries(labels).forEach(([key, value]) => {
            const node = panel.querySelector(`[data-as-label="${key}"]`);
            if (node) node.textContent = value;
        });

        panel.querySelector('[data-as-toggle="ambience"]').textContent =
            ar ? "الأجواء" : "AMBIENCE";

        panel.querySelector('[data-as-toggle="sfx"]').textContent =
            ar ? "المؤثرات" : "SFX";

        panel.querySelector('[data-as-toggle="reducedMotion"]').textContent =
            ar ? "تقليل الحركة" : "REDUCED MOTION";

        panel.querySelectorAll("[data-as-toggle]").forEach(toggle => {
            const key = toggle.dataset.asToggle;
            toggle.setAttribute("aria-pressed", String(Boolean(settings[key])));
        });

        const grid = panel.querySelector("[data-as-theme-grid]");

        grid.innerHTML = [
            themeCard("northstar", ar ? "Northstar الأخضر" : "Northstar Green", "#66efb2"),
            themeCard("ice", ar ? "SOC الجليدي" : "SOC Ice", "#71d8ff"),
            themeCard("amber", ar ? "عمليات Amber" : "Amber Ops", "#ffca66"),
            themeCard("adaptive", ar ? "متكيف مع الوردية" : "Adaptive Shift", "#a2d7b7"),
            themeCard("nightwatch", "NIGHTWATCH", "#c7a0ff")
        ].join("");

        const unlocked = canUseNightwatchTheme();
        const note = panel.querySelector("[data-as-nightwatch-note]");

        note.textContent = unlocked
            ? (ar ? "ثيم NIGHTWATCH متاح بعد فتح النهاية السرية." : "NIGHTWATCH theme unlocked.")
            : (ar ? "ثيم NIGHTWATCH يُفتح بعد النهاية السرية." : "NIGHTWATCH unlocks after the sealed epilogue.");

        const audioStatus = panel.querySelector("[data-as-audio-status]");
        const ready = Boolean(window.AftershiftAudio?.isReady());

        audioStatus.classList.toggle("ready", ready);
        audioStatus.textContent = ready
            ? (ar ? "الصوت جاهز // ACTIVE" : "AUDIO READY // ACTIVE")
            : (ar ? "اضغط داخل اللعبة مرة واحدة لتفعيل الصوت." : "Interact once with the game to enable browser audio.");
    }

    window.AftershiftSettings = {
        get: () => ({ ...settings }),
        update,
        apply,
        canUseNightwatchTheme,
        resolvedTheme
    };

    apply();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", injectPanel, { once: true });
    } else {
        injectPanel();
    }
})();
