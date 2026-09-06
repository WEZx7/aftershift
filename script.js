const startButton = document.getElementById("start-button");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endingScreen = document.getElementById("ending-screen");

const choicesContainer = document.getElementById("choices");
const resultBox = document.getElementById("result-box");
const resultText = document.getElementById("result-text");
const continueButton = document.getElementById("continue-button");

let health = 100;
let security = 100;
let trust = 70;
let currentTicket = 0;
let currentMinutes = 23 * 60 + 47;

const tickets = [
    {
        id: "TICKET #1842",
        title: "Computer suddenly became very slow",
        message: "\"Everything froze about ten minutes ago. I didn't install anything.\"",
        employee: "Sarah Mitchell",
        department: "Finance",
        device: "FIN-LT-014",
        status: "ONLINE",
        severity: "LOW",
        risk: 12,
        evidence: [
            "User reports severe system slowdown"
        ],
        choices: [
            {
                text: "Run system diagnostics",
                result: "Diagnostics reveal CPU usage at 97%. An unfamiliar process named svhost32.exe is consuming most system resources.",
                health: -3,
                security: 0,
                trust: 4,
                risk: 38,
                evidence: "Unknown process svhost32.exe consuming 72% CPU",
                logType: "WARNING"
            },
            {
                text: "Restart the computer",
                result: "The computer restarts and appears normal for several minutes. The underlying cause was not identified.",
                health: 3,
                security: -8,
                trust: 2,
                risk: 23,
                evidence: "Issue temporarily disappeared after restart",
                logType: "INFO"
            },
            {
                text: "Check security logs",
                result: "Windows Defender recorded a blocked executable from the user's Downloads folder fourteen minutes before the slowdown.",
                health: 0,
                security: 5,
                trust: 1,
                risk: 61,
                evidence: "Defender blocked suspicious executable before slowdown",
                logType: "SECURITY"
            },
            {
                text: "Ignore until morning",
                result: "The employee continues working on the affected device. Background activity increases.",
                health: -10,
                security: -15,
                trust: -12,
                risk: 69,
                evidence: "Suspicious activity continued without investigation",
                logType: "SECURITY"
            }
        ]
    },

    {
        id: "TICKET #1843",
        title: "Account keeps locking itself",
        message: "\"I reset my password yesterday. Why does my account keep getting locked?\"",
        employee: "Daniel Reed",
        department: "Human Resources",
        device: "HR-LT-011",
        status: "ONLINE",
        severity: "MEDIUM",
        risk: 34,
        evidence: [
            "User reports repeated account lockouts",
            "Password changed within the last 24 hours"
        ],
        choices: [
            {
                text: "Review authentication logs",
                result: "You find 43 failed login attempts against Daniel's account from an unrecognized device.",
                health: 0,
                security: 6,
                trust: 3,
                risk: 78,
                evidence: "43 failed login attempts from UNKNOWN-7F2",
                logType: "SECURITY"
            },
            {
                text: "Unlock the account",
                result: "Daniel regains access, but failed authentication attempts continue almost immediately.",
                health: 0,
                security: -12,
                trust: 5,
                risk: 65,
                evidence: "Failed logins resumed immediately after account unlock",
                logType: "WARNING"
            },
            {
                text: "Disable Daniel's account",
                result: "The suspicious attempts stop, but Daniel loses access to critical HR systems during an overnight payroll task.",
                health: -2,
                security: 8,
                trust: -9,
                risk: 52,
                evidence: "Account secured but business operations interrupted",
                logType: "WARNING"
            },
            {
                text: "Reset password and force sign-out",
                result: "All active sessions are terminated. Failed login attempts continue from UNKNOWN-7F2.",
                health: 0,
                security: 8,
                trust: 2,
                risk: 71,
                evidence: "Unknown device continues attempting authentication",
                logType: "SECURITY"
            }
        ]
    },

    {
        id: "TICKET #1844",
        title: "Random browser tabs keep opening",
        message: "\"Chrome keeps opening pages by itself. Some of them disappear before I can read them.\"",
        employee: "Marcus Hale",
        department: "Operations",
        device: "OPS-PC-021",
        status: "ONLINE",
        severity: "HIGH",
        risk: 62,
        evidence: [
            "Browser launches pages without user interaction",
            "Issue started during the night shift"
        ],
        choices: [
            {
                text: "Isolate device from network",
                result: "OPS-PC-021 is isolated. Outbound connections to an unknown external address immediately stop.",
                health: -3,
                security: 15,
                trust: -2,
                risk: 84,
                evidence: "Outbound connections stopped after network isolation",
                logType: "SECURITY"
            },
            {
                text: "Run malware investigation",
                result: "A suspicious startup entry and browser extension are discovered. The extension was installed earlier tonight.",
                health: -2,
                security: 10,
                trust: 2,
                risk: 89,
                evidence: "Suspicious extension and startup persistence discovered",
                logType: "SECURITY"
            },
            {
                text: "Reinstall Chrome",
                result: "Chrome is reinstalled, but the browser begins opening pages again. The cause exists outside the browser.",
                health: -4,
                security: -7,
                trust: -3,
                risk: 76,
                evidence: "Browser reinstall failed to remove suspicious behavior",
                logType: "WARNING"
            },
            {
                text: "Close the ticket as user error",
                result: "Twenty minutes later, the endpoint begins sending unusual network traffic.",
                health: -8,
                security: -20,
                trust: -10,
                risk: 95,
                evidence: "Endpoint began generating abnormal outbound traffic",
                logType: "SECURITY"
            }
        ]
    },

    {
        id: "SECURITY EVENT #011",
        title: "Unrecognized device joined the network",
        message: "\"Automated monitoring detected a device that does not exist in the asset inventory.\"",
        employee: "SYSTEM GENERATED",
        department: "Security Monitoring",
        device: "UNKNOWN-7F2",
        status: "CONNECTED",
        severity: "CRITICAL",
        risk: 91,
        evidence: [
            "Device not present in company asset inventory",
            "Associated with failed employee login attempts",
            "Connected during multiple suspicious endpoint events"
        ],
        choices: [
            {
                text: "Block device and preserve logs",
                result: "UNKNOWN-7F2 is blocked from the network. Authentication and endpoint logs are preserved for investigation.",
                health: 0,
                security: 18,
                trust: 2,
                risk: 96,
                evidence: "Unknown device successfully contained",
                logType: "SECURITY"
            },
            {
                text: "Monitor device silently",
                result: "Monitoring reveals the device attempting connections to Finance, HR, and Operations endpoints.",
                health: -4,
                security: 4,
                trust: 0,
                risk: 99,
                evidence: "Unknown device attempted access across multiple departments",
                logType: "SECURITY"
            },
            {
                text: "Disconnect the entire office network",
                result: "The threat is contained, but every active employee loses access to company systems.",
                health: -15,
                security: 20,
                trust: -18,
                risk: 92,
                evidence: "Network-wide isolation contained threat with major business impact",
                logType: "WARNING"
            },
            {
                text: "Dismiss as inventory error",
                result: "UNKNOWN-7F2 remains connected. Minutes later, multiple endpoints begin generating security alerts.",
                health: -20,
                security: -30,
                trust: -8,
                risk: 100,
                evidence: "Suspected compromise spread to multiple endpoints",
                logType: "SECURITY"
            }
        ]
    }
];

startButton.addEventListener("click", startGame);
continueButton.addEventListener("click", nextTicket);

document.querySelectorAll(".nav-button").forEach(button => {
    button.addEventListener("click", () => {
        switchView(button.dataset.view);

        document.querySelectorAll(".nav-button").forEach(nav => {
            nav.classList.remove("active");
        });

        button.classList.add("active");
    });
});

function startGame() {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    addLog("SYSTEM", "Night shift operator authenticated.");
    addLog("SYSTEM", "Monitoring services initialized.");
    addLog("WARNING", "Unverified device UNKNOWN-7F2 detected on network.");

    renderTicket();
    updateStats();
    updateClock();
}

function renderTicket() {
    const ticket = tickets[currentTicket];

    document.getElementById("ticket-id").textContent = ticket.id;
    document.getElementById("ticket-title").textContent = ticket.title;
    document.getElementById("ticket-message").textContent = ticket.message;
    document.getElementById("employee-name").textContent = ticket.employee;
    document.getElementById("department").textContent = ticket.department;
    document.getElementById("device").textContent = ticket.device;
    document.getElementById("device-status").textContent = ticket.status;

    const severityBadge = document.getElementById("severity-badge");
    severityBadge.textContent = ticket.severity;
    severityBadge.className = `severity ${ticket.severity.toLowerCase()}`;

    updateRisk(ticket.risk);

    const evidenceList = document.getElementById("evidence-list");
    evidenceList.innerHTML = "";

    ticket.evidence.forEach(item => {
        const li = document.createElement("li");
        li.textContent = item;
        evidenceList.appendChild(li);
    });

    choicesContainer.innerHTML = "";

    ticket.choices.forEach(choice => {
        const button = document.createElement("button");
        button.className = "choice-button";
        button.textContent = choice.text;

        button.addEventListener("click", () => {
            selectChoice(choice);
        });

        choicesContainer.appendChild(button);
    });

    resultBox.classList.add("hidden");

    document.getElementById("ticket-time").textContent = formatTime(currentMinutes);
    document.getElementById("open-ticket-value").textContent = tickets.length - currentTicket;
    document.getElementById("ticket-count").textContent = tickets.length - currentTicket;
}

function selectChoice(choice) {
    health = clamp(health + choice.health);
    security = clamp(security + choice.security);
    trust = clamp(trust + choice.trust);

    advanceTime(17);

    updateStats();
    updateRisk(choice.risk);

    const evidenceList = document.getElementById("evidence-list");
    const newEvidence = document.createElement("li");
    newEvidence.textContent = choice.evidence;
    evidenceList.appendChild(newEvidence);

    resultText.textContent = choice.result;
    resultBox.classList.remove("hidden");

    choicesContainer.innerHTML = "";

    addLog(choice.logType, choice.evidence);

    if (choice.risk >= 80) {
        document.getElementById("footer-message").textContent =
            "Critical security indicators detected.";
    }
}

function nextTicket() {
    currentTicket++;

    if (currentTicket >= tickets.length) {
        finishShift();
        return;
    }

    advanceTime(13);
    renderTicket();

    switchView("tickets");

    document.querySelectorAll(".nav-button").forEach(nav => {
        nav.classList.remove("active");

        if (nav.dataset.view === "tickets") {
            nav.classList.add("active");
        }
    });

    addLog("SYSTEM", `${tickets[currentTicket].id} received by Help Desk.`);
}

function updateStats() {
    document.getElementById("health-value").textContent = `${health}%`;
    document.getElementById("security-value").textContent = `${security}%`;
    document.getElementById("trust-value").textContent = `${trust}%`;

    document.getElementById("health-bar").style.width = `${health}%`;
    document.getElementById("security-bar").style.width = `${security}%`;
    document.getElementById("trust-bar").style.width = `${trust}%`;

    updateMeterColor("health-bar", health);
    updateMeterColor("security-bar", security);
    updateMeterColor("trust-bar", trust);
}

function updateMeterColor(id, value) {
    const bar = document.getElementById(id);

    if (value >= 70) {
        bar.style.background = "#72f1b8";
    } else if (value >= 40) {
        bar.style.background = "#f3c969";
    } else {
        bar.style.background = "#ff6b6b";
    }
}

function updateRisk(score) {
    document.getElementById("risk-score").textContent = `${score} / 100`;

    const riskBar = document.getElementById("risk-bar");
    riskBar.style.width = `${score}%`;

    if (score < 30) {
        riskBar.style.background = "#72f1b8";
    } else if (score < 60) {
        riskBar.style.background = "#f3c969";
    } else {
        riskBar.style.background = "#ff6b6b";
    }
}

function switchView(viewName) {
    document.querySelectorAll(".view").forEach(view => {
        view.classList.add("hidden");
    });

    document.getElementById(`${viewName}-view`).classList.remove("hidden");
}

function addLog(type, message) {
    const log = document.getElementById("event-log");

    const entry = document.createElement("div");
    entry.className = "log-entry";

    const time = document.createElement("span");
    time.className = "log-time";
    time.textContent = formatTime(currentMinutes);

    const category = document.createElement("span");
    category.className = `log-type ${type.toLowerCase()}`;
    category.textContent = type;

    const text = document.createElement("span");
    text.textContent = message;

    entry.appendChild(time);
    entry.appendChild(category);
    entry.appendChild(text);

    log.prepend(entry);
}

function advanceTime(minutes) {
    currentMinutes += minutes;

    if (currentMinutes >= 24 * 60) {
        currentMinutes -= 24 * 60;
    }

    updateClock();
}

function updateClock() {
    document.getElementById("clock").textContent = formatTime(currentMinutes);
}

function formatTime(totalMinutes) {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const period = hours >= 12 ? "PM" : "AM";

    let displayHour = hours % 12;

    if (displayHour === 0) {
        displayHour = 12;
    }

    return `${displayHour}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function clamp(value) {
    return Math.max(0, Math.min(100, value));
}

function finishShift() {
    gameScreen.classList.add("hidden");
    endingScreen.classList.remove("hidden");

    let title = "";
    let description = "";

    if (security >= 85 && health >= 70) {
        title = "ENDING: CONTAINMENT";
        description =
            "You connected the incidents before they became a full breach. The unknown device was contained and the evidence was preserved. Morning security has a very interesting report waiting for them.";
    } else if (security < 45) {
        title = "ENDING: THE BREACH";
        description =
            "What looked like unrelated support tickets were connected. By the time the pattern became clear, multiple systems had already been affected.";
    } else if (trust < 35) {
        title = "ENDING: LOCKED DOWN";
        description =
            "The company survived the night, but your response caused major disruption. Security was maintained at the cost of employee trust and operations.";
    } else {
        title = "ENDING: SOMETHING REMAINS";
        description =
            "The immediate incidents were handled, but the evidence does not completely fit. UNKNOWN-7F2 disappeared from the network before sunrise.";
    }

    document.getElementById("ending-title").textContent = title;
    document.getElementById("ending-description").textContent = description;

    document.getElementById("ending-health").textContent = `${health}%`;
    document.getElementById("ending-security").textContent = `${security}%`;
    document.getElementById("ending-trust").textContent = `${trust}%`;
}
