const startButton = document.getElementById("start-button");
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const endingScreen = document.getElementById("ending-screen");

const choicesContainer = document.getElementById("choices");
const resultBox = document.getElementById("result-box");
const resultText = document.getElementById("result-text");
const continueButton = document.getElementById("continue-button");

const terminalInput = document.getElementById("terminal-input");
const terminalOutput = document.getElementById("terminal-output");

let health = 100;
let security = 100;
let trust = 70;
let currentTicket = 0;
let currentMinutes = 23 * 60 + 47;
let unknownDeviceIsolated = false;

const discoveredEvidence = new Set();

const evidenceDatabase = {
    suspiciousProcess: {
        title: "Suspicious Process",
        description: "FIN-LT-014 is running svhost32.exe, an unverified process consuming unusually high CPU resources."
    },

    defenderDetection: {
        title: "Defender Detection",
        description: "Windows Defender blocked invoice_viewer.exe shortly before the Finance endpoint slowdown began."
    },

    failedLogins: {
        title: "Authentication Attack",
        description: "Daniel Reed's account received 43 failed login attempts from UNKNOWN-7F2."
    },

    suspiciousConnection: {
        title: "External Connection",
        description: "FIN-LT-014 established a connection to an unrecognized external address after the suspicious process appeared."
    },

    startupPersistence: {
        title: "Startup Persistence",
        description: "OPS-PC-021 contains a suspicious startup entry and browser extension installed during the night shift."
    },

    unknownDevice: {
        title: "Unauthorized Device",
        description: "UNKNOWN-7F2 is connected to the company network but does not exist in the official asset inventory."
    },

    lateralMovement: {
        title: "Cross-Department Activity",
        description: "UNKNOWN-7F2 attempted connections to Finance, HR, and Operations systems."
    },

    initialVector: {
        title: "Probable Initial Vector",
        description: "Evidence suggests invoice_viewer.exe downloaded by the Finance user may have been the first stage of the incident."
    }
};

const devices = [
    {
        id: "CORE-SRV-01",
        type: "Domain Controller",
        status: "ONLINE",
        className: "online"
    },

    {
        id: "FILE-SRV-02",
        type: "File Server",
        status: "ONLINE",
        className: "online"
    },

    {
        id: "FIN-LT-014",
        type: "Finance Laptop",
        status: "WARNING",
        className: "warning"
    },

    {
        id: "HR-LT-011",
        type: "HR Laptop",
        status: "ONLINE",
        className: "online"
    },

    {
        id: "OPS-PC-021",
        type: "Operations Desktop",
        status: "ONLINE",
        className: "online"
    },

    {
        id: "UNKNOWN-7F2",
        type: "Unidentified Device",
        status: "UNVERIFIED",
        className: "unknown"
    }
];

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
        tip: "Try scanning FIN-LT-014 or reviewing Defender events.",
        choices: [
            {
                text: "Run system diagnostics",
                result: "Diagnostics reveal CPU usage at 97%. An unfamiliar process is consuming most system resources.",
                health: -3,
                security: 0,
                trust: 4,
                risk: 38,
                evidence: "Unknown process detected during diagnostics",
                discover: "suspiciousProcess",
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
                result: "Windows Defender recorded a blocked executable shortly before the slowdown began.",
                health: 0,
                security: 5,
                trust: 1,
                risk: 61,
                evidence: "Defender blocked suspicious executable before slowdown",
                discover: "defenderDetection",
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
        tip: "Authentication logs may reveal where the login attempts originate.",
        choices: [
            {
                text: "Review authentication logs",
                result: "You find 43 failed login attempts against Daniel's account from an unrecognized device.",
                health: 0,
                security: 6,
                trust: 3,
                risk: 78,
                evidence: "43 failed login attempts from UNKNOWN-7F2",
                discover: "failedLogins",
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
                result: "The suspicious attempts stop, but Daniel loses access to critical HR systems.",
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
                discover: "failedLogins",
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
        tip: "Scan OPS-PC-021 or inspect its active connections.",
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
                result: "A suspicious startup entry and browser extension are discovered.",
                health: -2,
                security: 10,
                trust: 2,
                risk: 89,
                evidence: "Suspicious extension and startup persistence discovered",
                discover: "startupPersistence",
                logType: "SECURITY"
            },

            {
                text: "Reinstall Chrome",
                result: "Chrome is reinstalled, but the browser begins opening pages again.",
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
            "Associated with suspicious activity"
        ],
        tip: "Use lookup UNKNOWN-7F2, connections UNKNOWN-7F2, or isolate UNKNOWN-7F2.",
        choices: [
            {
                text: "Block device and preserve logs",
                result: "UNKNOWN-7F2 is blocked from the network. Authentication and endpoint logs are preserved.",
                health: 0,
                security: 18,
                trust: 2,
                risk: 96,
                evidence: "Unknown device successfully contained",
                isolateUnknown: true,
                discover: "unknownDevice",
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
                discover: "lateralMovement",
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
                isolateUnknown: true,
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
                discover: "lateralMovement",
                logType: "SECURITY"
            }
        ]
    }
];

startButton.addEventListener("click", startGame);
continueButton.addEventListener("click", nextTicket);

terminalInput.addEventListener("keydown", event => {
    if (event.key === "Enter") {
        const command = terminalInput.value.trim();

        if (command) {
            executeTerminalCommand(command);
        }

        terminalInput.value = "";
    }
});

document.querySelectorAll(".nav-button").forEach(button => {
    button.addEventListener("click", () => {
        setActiveView(button.dataset.view);

        if (button.dataset.view === "terminal") {
            setTimeout(() => terminalInput.focus(), 100);
        }
    });
});

function startGame() {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");

    addLog("SYSTEM", "Night shift operator authenticated.");
    addLog("SYSTEM", "Monitoring services initialized.");
    addLog("WARNING", "Unverified device UNKNOWN-7F2 detected on network.");

    addTerminalLine("NORTHSTAR SECURE SHELL v2.4", "success");
    addTerminalLine("Operator: Night IT Technician", "info");
    addTerminalLine("Session: AUTHENTICATED", "success");
    addTerminalLine("");
    addTerminalLine("Type \"help\" for available commands.");

    renderNetwork();
    renderTicket();
    renderEvidenceBoard();
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
    document.getElementById("device-status").textContent = getDeviceStatus(ticket.device);

    document.getElementById("investigation-tip-text").textContent = ticket.tip;

    const severityBadge = document.getElementById("severity-badge");
    severityBadge.textContent = ticket.severity;
    severityBadge.className = `severity ${ticket.severity.toLowerCase()}`;

    updateRisk(ticket.risk);

    const evidenceList = document.getElementById("ticket-evidence-list");
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
    updateTicketCounters();
}

function selectChoice(choice) {
    health = clamp(health + choice.health);
    security = clamp(security + choice.security);
    trust = clamp(trust + choice.trust);

    if (choice.discover) {
        discoverEvidence(choice.discover);
    }

    if (choice.isolateUnknown) {
        isolateUnknownDevice();
    }

    advanceTime(17);

    updateStats();
    updateRisk(choice.risk);

    const evidenceList = document.getElementById("ticket-evidence-list");
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
    setActiveView("tickets");

    addLog("SYSTEM", `${tickets[currentTicket].id} received by Help Desk.`);
}

function setActiveView(viewName) {
    document.querySelectorAll(".view").forEach(view => {
        view.classList.add("hidden");
    });

    const target = document.getElementById(`${viewName}-view`);

    if (target) {
        target.classList.remove("hidden");
    }

    document.querySelectorAll(".nav-button").forEach(nav => {
        nav.classList.toggle("active", nav.dataset.view === viewName);
    });
}

function renderNetwork() {
    const grid = document.getElementById("network-grid");
    grid.innerHTML = "";

    devices.forEach(device => {
        const card = document.createElement("div");
        card.className = `device-card ${device.className}`;

        card.innerHTML = `
            <span class="device-dot"></span>
            <strong>${device.id}</strong>
            <p>${device.type}</p>
            <small>${device.status}</small>
        `;

        grid.appendChild(card);
    });
}

function getDeviceStatus(deviceId) {
    const device = devices.find(item => item.id === deviceId);

    if (!device) {
        return "UNKNOWN";
    }

    return device.status;
}

function isolateUnknownDevice() {
    const device = devices.find(item => item.id === "UNKNOWN-7F2");

    if (!device || unknownDeviceIsolated) {
        return;
    }

    unknownDeviceIsolated = true;
    device.status = "ISOLATED";
    device.className = "isolated";

    renderNetwork();

    addLog("SECURITY", "UNKNOWN-7F2 isolated from company network.");
}

function discoverEvidence(key) {
    if (!evidenceDatabase[key]) {
        return;
    }

    if (discoveredEvidence.has(key)) {
        return;
    }

    discoveredEvidence.add(key);

    const evidence = evidenceDatabase[key];

    addLog("INVESTIGATION", `Evidence discovered: ${evidence.title}`);
    addTerminalLine(`[EVIDENCE ADDED] ${evidence.title}`, "success");

    document.getElementById("footer-message").textContent =
        `New evidence discovered: ${evidence.title}`;

    renderEvidenceBoard();
}

function renderEvidenceBoard() {
    const board = document.getElementById("evidence-board");
    board.innerHTML = "";

    Object.entries(evidenceDatabase).forEach(([key, evidence], index) => {
        const discovered = discoveredEvidence.has(key);

        const card = document.createElement("div");
        card.className = `evidence-card ${discovered ? "discovered" : "locked"}`;

        card.innerHTML = `
            <span class="evidence-status">
                ${discovered ? "DISCOVERED" : "UNDISCOVERED"}
            </span>

            <h3>
                ${discovered ? evidence.title : `Evidence ${String(index + 1).padStart(2, "0")}`}
            </h3>

            <p>
                ${discovered
                    ? evidence.description
                    : "Further investigation required."}
            </p>
        `;

        board.appendChild(card);
    });

    document.getElementById("evidence-count").textContent = discoveredEvidence.size;
    document.getElementById("case-progress").textContent =
        `${discoveredEvidence.size} / ${Object.keys(evidenceDatabase).length} DISCOVERED`;
}

function executeTerminalCommand(rawCommand) {
    const normalized = rawCommand.trim();
    const lower = normalized.toLowerCase();

    addTerminalLine(`aftershift> ${normalized}`, "command");
    advanceTime(2);

    if (lower === "help") {
        showTerminalHelp();
        return;
    }

    if (lower === "clear") {
        terminalOutput.innerHTML = "";
        return;
    }

    if (lower === "status") {
        showSystemStatus();
        return;
    }

    if (lower === "evidence") {
        showEvidenceList();
        return;
    }

    if (lower === "whoami") {
        addTerminalLine("Operator: Night IT Technician");
        addTerminalLine("Clearance: Level 2");
        addTerminalLine("Session: AUTHENTICATED", "success");
        return;
    }

    const parts = normalized.split(/\s+/);
    const command = parts[0].toLowerCase();
    const argument = parts.slice(1).join(" ");

    if (command === "scan") {
        runScan(argument);
        return;
    }

    if (command === "logs") {
        runLogs(argument);
        return;
    }

    if (command === "lookup") {
        runLookup(argument);
        return;
    }

    if (command === "connections") {
        runConnections(argument);
        return;
    }

    if (command === "isolate") {
        runIsolation(argument);
        return;
    }

    addTerminalLine(`Command not recognized: ${normalized}`, "danger");
    addTerminalLine("Type \"help\" for available commands.");
}

function showTerminalHelp() {
    addTerminalLine("AVAILABLE COMMANDS", "success");
    addTerminalLine("");
    addTerminalLine("help                       Show command list");
    addTerminalLine("status                     View shift status");
    addTerminalLine("scan <device>              Run endpoint diagnostics");
    addTerminalLine("logs auth                  Review authentication events");
    addTerminalLine("logs defender              Review Defender events");
    addTerminalLine("lookup <name/device>       Search company directory");
    addTerminalLine("connections <device>       Show network connections");
    addTerminalLine("isolate <device>           Isolate suspicious device");
    addTerminalLine("evidence                   View discovered evidence");
    addTerminalLine("whoami                     Display operator identity");
    addTerminalLine("clear                      Clear terminal");
}

function showSystemStatus() {
    addTerminalLine("SHIFT STATUS", "success");
    addTerminalLine(`System Health: ${health}%`);
    addTerminalLine(`Security: ${security}%`);
    addTerminalLine(`Employee Trust: ${trust}%`);
    addTerminalLine(`Open Tickets: ${Math.max(tickets.length - currentTicket, 0)}`);
    addTerminalLine(`Evidence Found: ${discoveredEvidence.size}/8`);
    addTerminalLine(
        `UNKNOWN-7F2: ${unknownDeviceIsolated ? "ISOLATED" : "CONNECTED"}`,
        unknownDeviceIsolated ? "success" : "danger"
    );
}

function showEvidenceList() {
    if (discoveredEvidence.size === 0) {
        addTerminalLine("No case evidence has been discovered.", "warning");
        return;
    }

    addTerminalLine("DISCOVERED CASE EVIDENCE", "success");

    discoveredEvidence.forEach(key => {
        addTerminalLine(`- ${evidenceDatabase[key].title}`);
    });
}

function runScan(target) {
    const device = target.toUpperCase();

    if (!device) {
        addTerminalLine("Usage: scan <device>", "warning");
        return;
    }

    if (device === "FIN-LT-014") {
        addTerminalLine("DEVICE: FIN-LT-014", "info");
        addTerminalLine("STATUS: ONLINE");
        addTerminalLine("CPU: 97%");
        addTerminalLine("MEMORY: 68%");
        addTerminalLine("");
        addTerminalLine("TOP PROCESSES");
        addTerminalLine("chrome.exe        11%");
        addTerminalLine("explorer.exe       4%");
        addTerminalLine("svhost32.exe      72%   [UNVERIFIED]", "danger");

        discoverEvidence("suspiciousProcess");
        return;
    }

    if (device === "HR-LT-011") {
        addTerminalLine("DEVICE: HR-LT-011", "info");
        addTerminalLine("STATUS: ONLINE");
        addTerminalLine("CPU: 21%");
        addTerminalLine("MEMORY: 53%");
        addTerminalLine("LOCAL SECURITY ALERTS: NONE");
        addTerminalLine("");
        addTerminalLine("Account lockout appears authentication-related.", "warning");
        return;
    }

    if (device === "OPS-PC-021") {
        addTerminalLine("DEVICE: OPS-PC-021", "info");
        addTerminalLine("STATUS: ONLINE");
        addTerminalLine("CPU: 61%");
        addTerminalLine("MEMORY: 74%");
        addTerminalLine("");
        addTerminalLine("STARTUP ITEMS");
        addTerminalLine("OneDrive.exe");
        addTerminalLine("SecurityHealth.exe");
        addTerminalLine("browser_update_service.exe   [UNVERIFIED]", "danger");

        discoverEvidence("startupPersistence");
        return;
    }

    if (device === "UNKNOWN-7F2") {
        addTerminalLine("DEVICE: UNKNOWN-7F2", "danger");
        addTerminalLine(`STATUS: ${unknownDeviceIsolated ? "ISOLATED" : "CONNECTED"}`);
        addTerminalLine("ASSET RECORD: NOT FOUND");
        addTerminalLine("OWNER: UNKNOWN");
        addTerminalLine("DEVICE CLASS: UNVERIFIED ENDPOINT");

        discoverEvidence("unknownDevice");
        return;
    }

    addTerminalLine(`Device not found: ${device}`, "danger");
}

function runLogs(type) {
    const logType = type.toLowerCase();

    if (logType === "auth") {
        addTerminalLine("AUTHENTICATION EVENTS", "info");
        addTerminalLine("");
        addTerminalLine("00:04  Daniel Reed  FAILED  UNKNOWN-7F2", "danger");
        addTerminalLine("00:04  Daniel Reed  FAILED  UNKNOWN-7F2", "danger");
        addTerminalLine("00:05  Daniel Reed  FAILED  UNKNOWN-7F2", "danger");
        addTerminalLine("...");
        addTerminalLine("43 failed attempts detected.", "danger");

        discoverEvidence("failedLogins");
        return;
    }

    if (logType === "defender") {
        addTerminalLine("MICROSOFT DEFENDER EVENTS", "info");
        addTerminalLine("");
        addTerminalLine("23:34:18  THREAT BLOCKED", "danger");
        addTerminalLine("File: invoice_viewer.exe");
        addTerminalLine("User: Sarah Mitchell");
        addTerminalLine("Path: Downloads/invoice_viewer.exe");
        addTerminalLine("Severity: HIGH");

        discoverEvidence("defenderDetection");

        if (discoveredEvidence.has("suspiciousProcess")) {
            addTerminalLine("");
            addTerminalLine(
                "CORRELATION: Threat event occurred shortly before svhost32.exe appeared.",
                "warning"
            );

            discoverEvidence("initialVector");
        }

        return;
    }

    addTerminalLine("Available log sources: auth, defender", "warning");
}

function runLookup(target) {
    const value = target.toLowerCase();

    if (!value) {
        addTerminalLine("Usage: lookup <name/device>", "warning");
        return;
    }

    if (value.includes("sarah")) {
        addTerminalLine("EMPLOYEE RECORD", "info");
        addTerminalLine("Name: Sarah Mitchell");
        addTerminalLine("Department: Finance");
        addTerminalLine("Device: FIN-LT-014");
        addTerminalLine("Account Status: ACTIVE");
        return;
    }

    if (value.includes("daniel")) {
        addTerminalLine("EMPLOYEE RECORD", "info");
        addTerminalLine("Name: Daniel Reed");
        addTerminalLine("Department: Human Resources");
        addTerminalLine("Device: HR-LT-011");
        addTerminalLine("Account Status: ACTIVE");
        return;
    }

    if (value.includes("marcus")) {
        addTerminalLine("EMPLOYEE RECORD", "info");
        addTerminalLine("Name: Marcus Hale");
        addTerminalLine("Department: Operations");
        addTerminalLine("Device: OPS-PC-021");
        addTerminalLine("Account Status: ACTIVE");
        return;
    }

    if (value.includes("unknown-7f2")) {
        addTerminalLine("ASSET LOOKUP: UNKNOWN-7F2", "danger");
        addTerminalLine("Result: NO MATCH");
        addTerminalLine("Asset Inventory: NOT REGISTERED");
        addTerminalLine("Employee Assignment: NONE");
        addTerminalLine("Device Trust: UNVERIFIED");

        discoverEvidence("unknownDevice");
        return;
    }

    addTerminalLine(`No directory result for: ${target}`, "danger");
}

function runConnections(target) {
    const device = target.toUpperCase();

    if (!device) {
        addTerminalLine("Usage: connections <device>", "warning");
        return;
    }

    if (device === "FIN-LT-014") {
        addTerminalLine("ACTIVE CONNECTIONS // FIN-LT-014", "info");
        addTerminalLine("");
        addTerminalLine("FIN-LT-014 -> CORE-SRV-01       ESTABLISHED");
        addTerminalLine("FIN-LT-014 -> FILE-SRV-02       ESTABLISHED");
        addTerminalLine("FIN-LT-014 -> 185.91.72.44       UNRECOGNIZED", "danger");

        discoverEvidence("suspiciousConnection");
        return;
    }

    if (device === "OPS-PC-021") {
        addTerminalLine("ACTIVE CONNECTIONS // OPS-PC-021", "info");
        addTerminalLine("");
        addTerminalLine("OPS-PC-021 -> CORE-SRV-01       ESTABLISHED");
        addTerminalLine("OPS-PC-021 -> UNKNOWN-7F2       RECENT", "danger");

        discoverEvidence("lateralMovement");
        return;
    }

    if (device === "UNKNOWN-7F2") {
        addTerminalLine("CONNECTION HISTORY // UNKNOWN-7F2", "danger");
        addTerminalLine("");
        addTerminalLine("UNKNOWN-7F2 -> FIN-LT-014");
        addTerminalLine("UNKNOWN-7F2 -> HR-LT-011");
        addTerminalLine("UNKNOWN-7F2 -> OPS-PC-021");

        discoverEvidence("lateralMovement");
        return;
    }

    addTerminalLine(`No unusual connections found for ${device}.`);
}

function runIsolation(target) {
    const device = target.toUpperCase();

    if (!device) {
        addTerminalLine("Usage: isolate <device>", "warning");
        return;
    }

    if (device !== "UNKNOWN-7F2") {
        addTerminalLine(
            `Isolation denied for ${device}. This simulation currently allows containment of UNKNOWN-7F2 only.`,
            "warning"
        );
        return;
    }

    if (unknownDeviceIsolated) {
        addTerminalLine("UNKNOWN-7F2 is already isolated.", "warning");
        return;
    }

    isolateUnknownDevice();
    discoverEvidence("unknownDevice");

    security = clamp(security + 12);
    trust = clamp(trust + 1);

    updateStats();

    addTerminalLine("NETWORK CONTROL", "info");
    addTerminalLine("UNKNOWN-7F2 -> ISOLATED", "success");
    addTerminalLine("Traffic blocked.");
    addTerminalLine("Evidence preserved.");
}

function addTerminalLine(text, type = "") {
    const line = document.createElement("div");
    line.className = `terminal-line ${type}`;
    line.textContent = text;

    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
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

    updateTicketCounters();
}

function updateTicketCounters() {
    const remaining = Math.max(tickets.length - currentTicket, 0);

    document.getElementById("open-ticket-value").textContent = remaining;
    document.getElementById("ticket-count").textContent = remaining;
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

    const evidenceCount = discoveredEvidence.size;

    if (
        evidenceCount === Object.keys(evidenceDatabase).length &&
        unknownDeviceIsolated &&
        security >= 70
    ) {
        title = "ENDING: ROOT CAUSE";
        description =
            "You did more than contain the incident. You reconstructed the chain of events, identified the probable initial compromise, mapped the suspicious device activity, and preserved the evidence. Morning security receives a complete incident timeline instead of a mystery.";
    } else if (security < 45 && !unknownDeviceIsolated) {
        title = "ENDING: THE BREACH";
        description =
            "The incidents were connected, but the pattern was recognized too late. UNKNOWN-7F2 remained active long enough for suspicious activity to spread across multiple departments.";
    } else if (trust < 35) {
        title = "ENDING: LOCKED DOWN";
        description =
            "The company survived the night, but your response caused major disruption. Systems were secured at the cost of employee trust and business operations.";
    } else if (
        unknownDeviceIsolated &&
        evidenceCount >= 4 &&
        security >= 70
    ) {
        title = "ENDING: CONTAINMENT";
        description =
            "You connected enough of the incidents to recognize the threat. UNKNOWN-7F2 was contained and the immediate danger passed, though parts of the attack chain remain unanswered.";
    } else {
        title = "ENDING: SOMETHING REMAINS";
        description =
            "The immediate incidents were handled, but the evidence does not completely fit. Some answers are still buried in the network logs, and the full story of UNKNOWN-7F2 remains unresolved.";
    }

    document.getElementById("ending-title").textContent = title;
    document.getElementById("ending-description").textContent = description;

    document.getElementById("ending-health").textContent = `${health}%`;
    document.getElementById("ending-security").textContent = `${security}%`;
    document.getElementById("ending-trust").textContent = `${trust}%`;

    document.getElementById("ending-evidence-count").textContent =
        `${evidenceCount} / ${Object.keys(evidenceDatabase).length}`;
}