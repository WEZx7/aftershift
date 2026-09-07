(() => {
    const path = window.location.pathname.toLowerCase();

    let chapter = null;

    if (path.includes("shift1.html")) chapter = 1;
    if (path.includes("shift2.html")) chapter = 2;
    if (path.includes("shift3.html")) chapter = 3;

    if (!chapter) return;

    const terminalInput = document.getElementById("terminal-input");

    if (!terminalInput) return;

    const style = document.createElement("style");

    style.textContent = `
        .quick-command-box {
            border-top: 1px solid var(--border);
            padding-top: 14px;
            margin-top: 14px;
        }

        .quick-command-title {
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--muted);
            font-size: 9px;
            letter-spacing: 1px;
            margin-bottom: 10px;
        }

        .quick-command-list {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .quick-command {
            border: 1px solid var(--border);
            background: transparent;
            color: var(--blue);
            padding: 8px 11px;
            cursor: pointer;
            font-size: 10px;
        }

        .quick-command:hover {
            border-color: var(--green);
            color: var(--green);
        }

        .hint-button {
            position: fixed;
            right: 22px;
            bottom: 55px;
            z-index: 800;
            border: 1px solid var(--yellow);
            background: #090e0f;
            color: var(--yellow);
            padding: 10px 14px;
            cursor: pointer;
            font-size: 10px;
            box-shadow: 0 0 25px rgba(0, 0, 0, 0.45);
        }

        .hint-button:hover {
            background: var(--yellow);
            color: #0a0803;
        }

        .hint-panel {
            position: fixed;
            right: 22px;
            bottom: 102px;
            z-index: 801;
            width: min(390px, calc(100vw - 44px));
            border: 1px solid var(--yellow);
            background: #090e0f;
            padding: 17px;
            box-shadow: 0 0 45px rgba(0, 0, 0, 0.65);
        }

        .hint-panel-label {
            color: var(--yellow);
            font-size: 9px;
            letter-spacing: 2px;
        }

        .hint-panel p {
            color: var(--text);
            font-size: 11px;
            line-height: 1.8;
            margin: 12px 0 15px;
        }

        .hint-actions {
            display: flex;
            gap: 8px;
        }

        .hint-actions button {
            border: 1px solid var(--border);
            background: transparent;
            color: var(--text);
            padding: 8px 11px;
            cursor: pointer;
            font-size: 9px;
        }

        .hint-actions button:hover {
            border-color: var(--yellow);
            color: var(--yellow);
        }

        .tutorial-card {
            position: fixed;
            left: 24px;
            bottom: 55px;
            z-index: 900;
            width: min(420px, calc(100vw - 48px));
            border: 1px solid var(--green);
            background: #080d0e;
            padding: 18px;
            box-shadow: 0 0 50px rgba(0, 0, 0, 0.7);
        }

        .tutorial-card span {
            color: var(--green);
            font-size: 9px;
            letter-spacing: 2px;
        }

        .tutorial-card h3 {
            margin: 10px 0;
            font-size: 17px;
        }

        .tutorial-card p {
            color: var(--muted);
            font-size: 11px;
            line-height: 1.8;
        }

        .tutorial-card button {
            border: 1px solid var(--green);
            background: transparent;
            color: var(--green);
            padding: 9px 13px;
            cursor: pointer;
        }

        .tutorial-card button:hover {
            background: var(--green);
            color: #04100c;
        }

        .tutorial-focus {
            outline: 1px solid var(--green) !important;
            box-shadow: 0 0 22px rgba(102, 239, 178, 0.2) !important;
        }

        @media (max-width: 600px) {
            .hint-button {
                right: 12px;
                bottom: 48px;
            }

            .hint-panel {
                right: 12px;
                bottom: 95px;
                width: calc(100vw - 24px);
            }

            .tutorial-card {
                left: 12px;
                bottom: 48px;
                width: calc(100vw - 24px);
            }

            .quick-command {
                flex: 1 1 auto;
            }
        }
    `;

    document.head.appendChild(style);

    const quickBox = document.createElement("div");
    quickBox.className = "quick-command-box";

    quickBox.innerHTML = `
        <div class="quick-command-title">
            <span>SUGGESTED COMMANDS</span>
            <span>TAP TO FILL</span>
        </div>

        <div class="quick-command-list"></div>
    `;

    terminalInput.parentElement.insertAdjacentElement("afterend", quickBox);

    const quickList = quickBox.querySelector(".quick-command-list");

    function evidenceCount() {
        const element = document.getElementById("evidence-count");

        if (!element) return 0;

        const value = parseInt(element.textContent, 10);

        return Number.isNaN(value) ? 0 : value;
    }

    function chapterOneCommands(count) {
        if (count <= 2) {
            return [
                "help",
                "scan FIN-LT-014",
                "logs defender"
            ];
        }

        if (count <= 5) {
            return [
                "logs auth",
                "connections FIN-LT-014",
                "scan OPS-PC-021"
            ];
        }

        if (count <= 7) {
            return [
                "lookup UNKNOWN-7F2",
                "connections UNKNOWN-7F2",
                "isolate UNKNOWN-7F2"
            ];
        }

        return [
            "evidence",
            "timeline",
            "isolate UNKNOWN-7F2"
        ];
    }

    function chapterTwoCommands(count) {
        if (count <= 2) {
            return [
                "help",
                "badge EW-044",
                "account e.ward"
            ];
        }

        if (count <= 4) {
            return [
                "camera server-room",
                "archive NS-031",
                "mac 8C:7A:15:3F:91:C2"
            ];
        }

        if (count <= 6) {
            return [
                "token svc-deploy-07",
                "chat lena",
                "connections GHOST-03"
            ];
        }

        return [
            "evidence",
            "status",
            "isolate GHOST-03"
        ];
    }

    function chapterThreeCommands(count) {
        if (count <= 2) {
            return [
                "help",
                "trace EXT-0000",
                "audio CALL-0000"
            ];
        }

        if (count <= 4) {
            return [
                "verify lena",
                "compare MSG-DIR-441",
                "session adrian.cole"
            ];
        }

        if (count <= 6) {
            return [
                "route MSG-DIR-441",
                "lookup RELAY-09",
                "isolate RELAY-09"
            ];
        }

        return [
            "evidence",
            "status",
            "isolate RELAY-09"
        ];
    }

    function currentCommands() {
        const count = evidenceCount();

        if (chapter === 1) return chapterOneCommands(count);
        if (chapter === 2) return chapterTwoCommands(count);

        return chapterThreeCommands(count);
    }

    function renderCommands() {
        quickList.innerHTML = "";

        currentCommands().forEach(command => {
            const button = document.createElement("button");

            button.className = "quick-command";
            button.textContent = command;

            button.addEventListener("click", () => {
                terminalInput.value = command;
                terminalInput.focus();
            });

            quickList.appendChild(button);
        });
    }

    renderCommands();

    const evidenceCounter = document.getElementById("evidence-count");

    if (evidenceCounter) {
        const observer = new MutationObserver(renderCommands);

        observer.observe(evidenceCounter, {
            childList: true,
            subtree: true,
            characterData: true
        });
    }

    document
        .querySelectorAll('[data-view="terminal"]')
        .forEach(button => {
            button.addEventListener("click", renderCommands);
        });

    const hintButton = document.createElement("button");
    hintButton.className = "hint-button";
    hintButton.textContent = "NEED A HINT?";

    document.body.appendChild(hintButton);

    const hintPanel = document.createElement("div");
    hintPanel.className = "hint-panel hidden";

    hintPanel.innerHTML = `
        <span class="hint-panel-label">OPERATOR ASSIST</span>

        <p id="hint-text"></p>

        <div class="hint-actions">
            <button id="stronger-hint">STRONGER HINT</button>
            <button id="close-hint">CLOSE</button>
        </div>
    `;

    document.body.appendChild(hintPanel);

    const hintText = hintPanel.querySelector("#hint-text");
    const strongerHint = hintPanel.querySelector("#stronger-hint");

    let hintLevel = 0;
    let lastHintEvidence = -1;

    function chapterOneHints(count) {
        if (count <= 1) {
            return [
                "Start with the device mentioned in the first ticket.",
                "The Finance laptop may reveal more than the user report.",
                "Try: scan FIN-LT-014"
            ];
        }

        if (count <= 3) {
            return [
                "Look for what happened before the slowdown began.",
                "Security logs and the user's mailbox may contain the initial clue.",
                "Try: logs defender, then inspect the suspicious invoice email."
            ];
        }

        if (count <= 5) {
            return [
                "The incidents may involve more than one department.",
                "Check authentication activity and suspicious network connections.",
                "Try: logs auth and connections FIN-LT-014"
            ];
        }

        if (count <= 7) {
            return [
                "You know about UNKNOWN-7F2, but you still need to understand its reach.",
                "Compare the unknown device with Operations and other network activity.",
                "Try: connections UNKNOWN-7F2 and scan OPS-PC-021"
            ];
        }

        return [
            "You have enough information to think about containment.",
            "Make sure the unauthorized device cannot continue communicating.",
            "Try: isolate UNKNOWN-7F2"
        ];
    }

    function chapterTwoHints(count) {
        if (count <= 2) {
            return [
                "Start with the terminated employee identity.",
                "Compare the badge and the disabled account.",
                "Try: badge EW-044 and account e.ward"
            ];
        }

        if (count <= 4) {
            return [
                "Physical access and archived cases may be connected.",
                "Review the camera gap and the older unauthorized endpoint.",
                "Try: camera server-room and archive NS-031"
            ];
        }

        if (count <= 6) {
            return [
                "Something internal had enough privilege to restore the account.",
                "Trace the service token and read what Morning Security said.",
                "Try: token svc-deploy-07 and chat lena"
            ];
        }

        return [
            "You have nearly reconstructed the incident.",
            "Contain the active ghost endpoint before filing the report.",
            "Try: isolate GHOST-03"
        ];
    }

    function chapterThreeHints(count) {
        if (count <= 2) {
            return [
                "Do not trust the caller identity yet.",
                "Trace the impossible extension and inspect the voice itself.",
                "Try: trace EXT-0000 and audio CALL-0000"
            ];
        }

        if (count <= 4) {
            return [
                "One person gave you a way to verify them independently.",
                "Check Lena's challenge phrase and compare the Director message.",
                "Try: verify lena and compare MSG-DIR-441"
            ];
        }

        if (count <= 6) {
            return [
                "Follow how the false message entered the communications system.",
                "Inspect the Director session and message route.",
                "Try: session adrian.cole and route MSG-DIR-441"
            ];
        }

        return [
            "The false signals now point to a common system.",
            "Remove that relay before choosing who receives your evidence.",
            "Try: isolate RELAY-09"
        ];
    }

    function hintPack() {
        const count = evidenceCount();

        if (chapter === 1) return chapterOneHints(count);
        if (chapter === 2) return chapterTwoHints(count);

        return chapterThreeHints(count);
    }

    function showHint() {
        const count = evidenceCount();

        if (count !== lastHintEvidence) {
            hintLevel = 0;
            lastHintEvidence = count;
        }

        const hints = hintPack();

        hintText.textContent = hints[hintLevel];
        hintPanel.classList.remove("hidden");

        strongerHint.textContent =
            hintLevel >= hints.length - 1
                ? "MAXIMUM HINT"
                : "STRONGER HINT";
    }

    hintButton.addEventListener("click", showHint);

    strongerHint.addEventListener("click", () => {
        const hints = hintPack();

        if (hintLevel < hints.length - 1) {
            hintLevel++;
        }

        hintText.textContent = hints[hintLevel];

        strongerHint.textContent =
            hintLevel >= hints.length - 1
                ? "MAXIMUM HINT"
                : "STRONGER HINT";
    });

    hintPanel
        .querySelector("#close-hint")
        .addEventListener("click", () => {
            hintPanel.classList.add("hidden");
        });

    const forceTutorial =
        new URLSearchParams(window.location.search).get("tutorial") === "1";

    const tutorialComplete =
        localStorage.getItem("aftershift_tutorial_complete") === "true";

    const chapterOneComplete =
        localStorage.getItem("aftershift_shift1_complete") === "true";

    const tutorialEnabled =
        chapter === 1 &&
        (forceTutorial || (!tutorialComplete && !chapterOneComplete));

    if (!tutorialEnabled) {
        return;
    }

    const tutorialCard = document.createElement("div");
    tutorialCard.className = "tutorial-card hidden";

    tutorialCard.innerHTML = `
        <span>OPERATOR TRAINING</span>
        <h3 id="tutorial-title"></h3>
        <p id="tutorial-text"></p>
        <button id="tutorial-finish" class="hidden">FINISH TUTORIAL</button>
    `;

    document.body.appendChild(tutorialCard);

    const tutorialTitle =
        tutorialCard.querySelector("#tutorial-title");

    const tutorialText =
        tutorialCard.querySelector("#tutorial-text");

    const tutorialFinish =
        tutorialCard.querySelector("#tutorial-finish");

    let tutorialStage = 0;

    function clearFocus() {
        document
            .querySelectorAll(".tutorial-focus")
            .forEach(element => {
                element.classList.remove("tutorial-focus");
            });
    }

    function focusElement(selector) {
        clearFocus();

        const element = document.querySelector(selector);

        if (element) {
            element.classList.add("tutorial-focus");
        }
    }

    function tutorialStep(stage) {
        tutorialStage = stage;
        tutorialCard.classList.remove("hidden");

        if (stage === 1) {
            tutorialTitle.textContent = "Investigation Tools";

            tutorialText.textContent =
                "Read the first incident, then open Terminal from the workstation menu. The Terminal lets you investigate beyond the information shown in a ticket.";

            focusElement('[data-view="terminal"]');
            return;
        }

        if (stage === 2) {
            tutorialTitle.textContent = "Run Your First Investigation";

            tutorialText.textContent =
                "Try scanning the affected Finance laptop. You can type the command yourself or tap the suggested command below the Terminal.";

            focusElement("#terminal-input");
            return;
        }

        if (stage === 3) {
            tutorialTitle.textContent = "Evidence Discovered";

            tutorialText.textContent =
                "Investigations can reveal hidden evidence. Open the Evidence Board to review what you found.";

            focusElement('[data-view="evidence"]');
            return;
        }

        if (stage === 4) {
            tutorialTitle.textContent = "Training Complete";

            tutorialText.textContent =
                "Keep investigating before making major decisions. Mailbox, Network, Event Logs and Timeline can reveal additional clues. Use NEED A HINT? whenever you get stuck.";

            clearFocus();
            tutorialFinish.classList.remove("hidden");
        }
    }

    const startButton = document.getElementById("start-button");

    if (startButton) {
        startButton.addEventListener("click", () => {
            setTimeout(() => {
                tutorialStep(1);
            }, 500);
        });
    }

    const terminalNav =
        document.querySelector('[data-view="terminal"]');

    if (terminalNav) {
        terminalNav.addEventListener("click", () => {
            if (tutorialStage === 1) {
                setTimeout(() => {
                    tutorialStep(2);
                }, 200);
            }
        });
    }

    terminalInput.addEventListener(
        "keydown",
        event => {
            if (
                event.key === "Enter" &&
                tutorialStage === 2
            ) {
                const command =
                    terminalInput.value
                        .trim()
                        .replace(/\s+/g, " ")
                        .toLowerCase();

                if (command === "scan fin-lt-014") {
                    setTimeout(() => {
                        tutorialStep(3);
                    }, 350);
                }
            }
        },
        true
    );

    const evidenceNav =
        document.querySelector('[data-view="evidence"]');

    if (evidenceNav) {
        evidenceNav.addEventListener("click", () => {
            if (tutorialStage === 3) {
                setTimeout(() => {
                    tutorialStep(4);
                }, 250);
            }
        });
    }

    tutorialFinish.addEventListener("click", () => {
        localStorage.setItem(
            "aftershift_tutorial_complete",
            "true"
        );

        clearFocus();
        tutorialCard.remove();
    });
})();