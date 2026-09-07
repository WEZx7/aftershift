const AftershiftProgress = (() => {
    const endingScores = {
        1: {
            "ENDING: FULL ATTRIBUTION": 6,
            "ENDING: ROOT CAUSE": 5,
            "ENDING: CONTAINMENT": 4,
            "ENDING: SOMETHING REMAINS": 3,
            "ENDING: LOCKED DOWN": 2,
            "ENDING: THE BREACH": 1
        },

        2: {
            "ENDING: INSIDE ACCESS": 6,
            "ENDING: CONTAINED AGAIN": 5,
            "ENDING: QUIET COVER-UP": 3,
            "ENDING: THE GHOST REMAINS": 2,
            "ENDING: FALSE POSITIVE": 1
        },

        3: {
            "ENDING: DEAD CHANNEL": 6,
            "ENDING: TRUST ANCHOR": 5,
            "ENDING: SILENCE": 4,
            "ENDING: NO SIGNAL": 2,
            "ENDING: FALSE DIRECTIVE": 1
        }
    };

    function getChapter() {
        const path = window.location.pathname.toLowerCase();

        if (path.includes("shift1.html")) return 1;
        if (path.includes("shift2.html")) return 2;
        if (path.includes("shift3.html")) return 3;

        return null;
    }

    function endingKey(chapter) {
        return `aftershift_shift${chapter}_best`;
    }

    function completeKey(chapter) {
        return `aftershift_shift${chapter}_complete`;
    }

    function normalizeEnding(ending) {
        return ending.trim().replace(/\s+/g, " ").toUpperCase();
    }

    function scoreEnding(chapter, ending) {
        const normalized = normalizeEnding(ending);
        const scores = endingScores[chapter] || {};

        return scores[normalized] || 0;
    }

    function saveEnding(chapter, ending) {
        if (!chapter || !ending) return;

        const normalized = normalizeEnding(ending);
        const oldEnding = localStorage.getItem(endingKey(chapter));

        if (
            !oldEnding ||
            scoreEnding(chapter, normalized) >= scoreEnding(chapter, oldEnding)
        ) {
            localStorage.setItem(endingKey(chapter), normalized);
        }

        localStorage.setItem(completeKey(chapter), "true");
        localStorage.setItem("aftershift_last_completed", String(chapter));
        localStorage.setItem("aftershift_campaign_started", "true");
    }

    function migrateOldSaves() {
        const shift2 = localStorage.getItem("aftershift_shift2_best");
        const shift3 = localStorage.getItem("aftershift_shift3_best");

        if (shift2) {
            localStorage.setItem("aftershift_shift1_complete", "true");

            if (!localStorage.getItem("aftershift_shift1_best")) {
                localStorage.setItem(
                    "aftershift_shift1_best",
                    "ENDING: FULL ATTRIBUTION"
                );
            }

            localStorage.setItem("aftershift_shift2_complete", "true");
        }

        if (shift3) {
            localStorage.setItem("aftershift_shift2_complete", "true");
            localStorage.setItem("aftershift_shift3_complete", "true");
        }
    }

    function watchEnding() {
        const chapter = getChapter();

        if (!chapter) return;

        const endingTitle = document.getElementById("ending-title");

        if (!endingTitle) return;

        const observer = new MutationObserver(() => {
            const ending = endingTitle.textContent.trim();

            if (ending.toUpperCase().startsWith("ENDING:")) {
                saveEnding(chapter, ending);
            }
        });

        observer.observe(endingTitle, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    function getBestEnding(chapter) {
        return localStorage.getItem(endingKey(chapter));
    }

    function isComplete(chapter) {
        return localStorage.getItem(completeKey(chapter)) === "true";
    }

    function clearCampaign() {
        const keys = [];

        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);

            if (key && key.startsWith("aftershift_")) {
                keys.push(key);
            }
        }

        keys.forEach(key => localStorage.removeItem(key));
    }

    migrateOldSaves();

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", watchEnding);
    } else {
        watchEnding();
    }

    return {
        getBestEnding,
        isComplete,
        clearCampaign,
        saveEnding
    };
})();