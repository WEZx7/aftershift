(() => {
    const campaignComplete =
        AftershiftProgress.isComplete(1) &&
        AftershiftProgress.isComplete(2) &&
        AftershiftProgress.isComplete(3) &&
        AftershiftProgress.isComplete(4) &&
        AftershiftProgress.isComplete(5);

    const epilogueUnlocked =
        localStorage.getItem("aftershift_epilogue_unlocked") === "true";

    const version = document.querySelector(".version");

    if (version) {
        version.innerHTML = `
            CAMPAIGN BUILD 1.0<br>
            OPERATOR PROFILE: LOCAL<br>
            SAVE SYSTEM: ACTIVE
        `;
    }

    if (!campaignComplete) return;

    const continueButton =
        document.getElementById("continue-button");

    const continueLabel =
        document.getElementById("continue-label");

    if (continueButton && continueLabel) {
        continueButton.disabled = true;
        continueButton.textContent = "CAMPAIGN COMPLETE";

        const label = document.createElement("span");
        label.textContent = "5 / 5 SHIFTS";

        continueButton.appendChild(label);
    }

    const menu = document.querySelector(".menu");

    if (epilogueUnlocked && menu) {
        const existing =
            document.getElementById("epilogue-menu-button");

        if (!existing) {
            const button = document.createElement("button");

            button.id = "epilogue-menu-button";
            button.className = "menu-button";

            button.innerHTML = `
                VIEW SEALED EPILOGUE
                <span>DAYBREAK // UNLOCKED</span>
            `;

            button.addEventListener("click", () => {
                window.location.href =
                    "shift5.html?epilogue=1";
            });

            menu.insertBefore(
                button,
                document.getElementById("new-game-button")
            );
        }
    }

    const progress =
        document.getElementById("progress-list");

    if (progress && epilogueUnlocked) {
        const record =
            document.createElement("div");

        record.className = "chapter-mini";

        record.innerHTML = `
            <div class="chapter-number">✓</div>

            <div>
                <strong>Sealed Epilogue</strong>
                <small>DAYBREAK // TRUE ENDING</small>
            </div>

            <span class="status complete">
                UNLOCKED
            </span>
        `;

        progress.appendChild(record);
    }
})();