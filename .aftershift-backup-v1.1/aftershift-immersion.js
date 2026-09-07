(() => {
    let lastEvidenceCount = null;
    let lastEnding = "";
    let blackoutSounded = false;
    let nightwatchSounded = false;

    function toast(message) {
        let node = document.getElementById("as-toast");

        if (!node) {
            node = document.createElement("div");
            node.id = "as-toast";
            node.className = "as-toast";
            document.body.appendChild(node);
        }

        node.textContent = message;
        node.classList.remove("show");

        requestAnimationFrame(() => {
            node.classList.add("show");
        });

        clearTimeout(toast.timer);

        toast.timer = setTimeout(() => {
            node.classList.remove("show");
        }, 2200);
    }

    function detectShift() {
        const path = location.pathname.toLowerCase();
        let shift = "campaign";

        for (let i = 1; i <= 5; i++) {
            if (path.includes(`shift${i}`)) shift = String(i);
        }

        document.documentElement.dataset.aftershiftShift = shift;
    }

    function numericEvidence() {
        const candidates = [
            document.getElementById("evidence-count"),
            document.getElementById("evidence-stat"),
            document.getElementById("case-progress"),
            document.getElementById("ending-evidence"),
            ...document.querySelectorAll("[class*='evidence-count'], [class*='evidence-stat']")
        ].filter(Boolean);

        for (const node of candidates) {
            const text = node.textContent || "";
            const match = text.match(/(\d+)\s*(?:\/\s*(\d+))?/);

            if (match) {
                return {
                    current: Number(match[1]),
                    total: match[2] ? Number(match[2]) : null
                };
            }
        }

        return null;
    }

    function fixShift1EvidenceDisplay() {
        if (!location.pathname.toLowerCase().includes("shift1")) return;

        const nodes = document.querySelectorAll(
            "#ending-evidence, [class*='ending'] [class*='evidence'], " +
            "[class*='evidence-stat'], [id*='evidence-stat'], [id*='evidence-count']"
        );

        nodes.forEach(node => {
            const text = node.textContent || "";

            if (/12\s*\/\s*10/.test(text)) {
                node.textContent = text.replace(/12\s*\/\s*10/g, "12 / 12");
            }
        });
    }

    function detectEvidenceChange() {
        const info = numericEvidence();

        if (!info) return;

        if (lastEvidenceCount !== null && info.current > lastEvidenceCount) {
            window.AftershiftAudio?.sfx("evidence");

            const lang = window.AftershiftSettings?.get().language || "en";

            toast(
                lang === "ar"
                    ? `تم اكتشاف دليل جديد // ${info.current}`
                    : `NEW EVIDENCE DISCOVERED // ${info.current}`
            );

            document.body.classList.remove("as-evidence-flash");
            requestAnimationFrame(() => document.body.classList.add("as-evidence-flash"));
        }

        lastEvidenceCount = info.current;
    }

    function detectEnding() {
        const text = document.body?.innerText || "";
        const match = text.match(/ENDING:\s*[A-Z][A-Z\s-]+/);

        if (!match) return;

        const ending = match[0].trim();
        if (ending === lastEnding) return;

        lastEnding = ending;

        const positive =
            /FIRST LIGHT|LIGHTS ON|FULL ATTRIBUTION|INSIDE ACCESS|DEAD CHANNEL|ROOT CAUSE/i.test(ending);

        window.AftershiftAudio?.sfx(positive ? "success" : "failure");
    }

    function specialThemeHint() {
        if (localStorage.getItem("aftershift_epilogue_unlocked") !== "true") return;
        if (localStorage.getItem("aftershift_nightwatch_theme_notified") === "true") return;

        const lang = window.AftershiftSettings?.get().language || "en";

        setTimeout(() => {
            toast(
                lang === "ar"
                    ? "تم فتح ثيم NIGHTWATCH في الإعدادات."
                    : "NIGHTWATCH interface theme unlocked."
            );

            localStorage.setItem("aftershift_nightwatch_theme_notified", "true");
        }, 900);
    }

    function hookBlackout() {
        const bodyText = document.body?.innerText || "";

        if (/BLACKOUT ACTIVE|انقطاع نشط/i.test(bodyText) && !blackoutSounded) {
            blackoutSounded = true;
            setTimeout(() => window.AftershiftAudio?.sfx("blackout"), 350);
        }
    }

    function hookNightwatch() {
        const bodyText = document.body?.innerText || "";

        if (
            /ROOT IDENTITY:\s*NW-ROOT|NIGHTWATCH\s+ROOT|NW-ROOT\s+ISOLATED/i.test(bodyText) &&
            !nightwatchSounded
        ) {
            nightwatchSounded = true;
            setTimeout(() => window.AftershiftAudio?.sfx("nightwatch"), 300);
        }
    }

    function observe() {
        let scheduled = false;

        const run = () => {
            scheduled = false;
            fixShift1EvidenceDisplay();
            detectEvidenceChange();
            detectEnding();
            hookBlackout();
            hookNightwatch();
        };

        const observer = new MutationObserver(() => {
            if (scheduled) return;

            scheduled = true;
            requestAnimationFrame(run);
        });

        observer.observe(document.body, {
            subtree: true,
            childList: true,
            characterData: true
        });

        run();
    }

    function init() {
        detectShift();
        observe();
        specialThemeHint();

        document.addEventListener("visibilitychange", () => {
            const settings = window.AftershiftSettings?.get();

            if (!settings) return;

            if (document.hidden) {
                window.AftershiftAudio?.configure({ ...settings, ambience: false });
            } else {
                window.AftershiftAudio?.configure(settings);
            }
        });

        window.addEventListener("aftershift:settingschange", event => {
            const detail = event.detail || {};

            toast(
                detail.language === "ar"
                    ? "تم حفظ الإعدادات."
                    : "SETTINGS SAVED."
            );
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init, { once: true });
    } else {
        init();
    }
})();
