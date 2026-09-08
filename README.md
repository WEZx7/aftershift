# AFTERSHIFT

> **Nobody calls IT at 2AM for something normal.**

**AFTERSHIFT** is a story-driven browser game that combines IT support, cybersecurity investigation, incident response, evidence correlation, and interactive storytelling across one very long night shift at Northstar Systems.

[![Play on itch.io](https://img.shields.io/badge/PLAY-itch.io-FA5C5C?style=for-the-badge&logo=itchdotio&logoColor=white)](https://wezx.itch.io/aftershift)
[![GitHub Pages](https://img.shields.io/badge/PLAY-GitHub%20Pages-181717?style=for-the-badge&logo=github)](https://wezx7.github.io/aftershift/)
[![Version](https://img.shields.io/badge/version-1.1-6FD8FF?style=for-the-badge)](#aftershift-v11)
[![License](https://img.shields.io/badge/license-MIT-66EFB2?style=for-the-badge)](LICENSE)

**English + Arabic · 5 shifts · Multiple endings · True ending · No installation**

---

## Play

### Recommended
**[Play AFTERSHIFT on itch.io](https://wezx.itch.io/aftershift)**

### Alternate
**[Play on GitHub Pages](https://wezx7.github.io/aftershift/)**

AFTERSHIFT runs entirely in the browser.

---

## What is AFTERSHIFT?

You play as a **Night IT Technician** at Northstar Systems.

A routine support ticket turns into a connected security incident involving compromised endpoints, suspicious authentication activity, identity abuse, communications failures, infrastructure sabotage, and a hidden internal platform.

The player investigates tickets, logs, identities, network activity, devices, emails, evidence, and infrastructure while making incident-response decisions that affect each chapter's ending.

---

## Campaign

### Shift 1 — The First Incident
A routine performance ticket reveals suspicious processes, authentication activity, phishing evidence, and an unauthorized device.

### Shift 2 — The Ghost Account
A terminated employee identity begins appearing inside active systems and restricted areas.

### Shift 3 — Dead Channel
Northstar's communications infrastructure can no longer be trusted. Verify identities, messages, sessions, and routing paths before acting.

### Shift 4 — Blackout Protocol
Critical infrastructure begins shutting down while backup power is limited. Investigate the outage, prioritize recovery, and prevent automated sabotage.

### Shift 5 — The Last Shift
Every previous incident converges into one final investigation involving NIGHTWATCH and NW-ROOT.

Reconstruct the complete attack chain, determine attribution, and make the final decision.

---

## AFTERSHIFT v1.1

Version 1.1 expands the original release with a more complete presentation and accessibility layer.

- Full **English and Arabic** interface
- RTL-aware Arabic layout
- Technical identifiers and terminal commands remain readable in LTR
- Ambient audio system
- Interface sound effects
- Multiple visual themes
- Adaptive Shift theme
- Unlockable NIGHTWATCH theme
- Operator settings menu
- Volume and audio controls
- Reduced-motion option
- Expanded ending localization
- Mobile UI polish
- Campaign and ending fixes

---

## Features

- Five connected story-driven chapters
- Interactive simulated investigation terminal
- Help desk and endpoint troubleshooting
- Phishing and email investigation
- Authentication log analysis
- Network investigation
- Identity verification
- Evidence collection and correlation
- Attack timeline reconstruction
- Infrastructure recovery management
- Attribution Board
- Multiple endings per chapter
- True campaign ending
- Sealed epilogue
- Persistent browser saves
- Chapter Select
- Case Archive
- Operator Manual
- First-time tutorial
- Progressive hint system
- Mobile-friendly controls
- English and Arabic interfaces
- Ambient audio and custom themes

---

## Investigation Terminal

Each chapter contains a simulated terminal used to inspect evidence and systems.

Example commands:

```text
help
scan FIN-LT-014
logs defender
trace RELAY-09
inspect ORCH-13
isolate NW-ROOT
```

The terminal exists entirely inside the game simulation. It does **not** execute real operating-system commands.

---

## Skills Represented

AFTERSHIFT was designed around concepts commonly encountered in IT support, help desk, systems administration, cybersecurity, and incident response.

The project includes simulated examples of:

- IT troubleshooting
- Help desk ticket analysis
- Endpoint diagnostics
- Phishing investigation
- Windows security events
- Authentication failures
- Account compromise
- Asset identification
- Network monitoring
- Unauthorized devices
- Log analysis
- Privileged service accounts
- Incident containment
- Evidence preservation
- Infrastructure recovery
- Incident correlation
- Root cause analysis
- Attack-chain reconstruction
- Security decision making

---

## Technologies

- HTML5
- CSS3
- JavaScript
- Web Audio API
- Browser Local Storage
- Git
- GitHub
- GitHub Pages
- itch.io

No external framework is required.

---

## Screenshots

### Campaign
![AFTERSHIFT Campaign](screenshots/campaign.png)

### Investigation
![AFTERSHIFT Investigation](screenshots/investigation.png)

### Blackout Protocol
![Blackout Protocol](screenshots/blackout.png)

### The Last Shift
![The Last Shift](screenshots/last-shift.png)

### First Light
![First Light Ending](screenshots/first-light.png)

---

## Project Structure

```text
aftershift/
├── index.html
├── shift1.html
├── shift2.html
├── shift3.html
├── shift4.html
├── shift5.html
├── script.js
├── style.css
├── progress.js
├── onboarding.js
├── final-polish.js
├── aftershift-audio.js
├── aftershift-i18n.js
├── aftershift-immersion.css
├── aftershift-immersion.js
├── aftershift-settings.js
├── screenshots/
├── RELEASE_NOTES.md
├── LICENSE
└── README.md
```

---

## Running Locally

Clone the repository:

```bash
git clone https://github.com/WEZx7/aftershift.git
cd aftershift
```

Start a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

---

## Save System

Campaign progress is stored locally in the player's browser.

Saved information includes:

- Completed chapters
- Best chapter endings
- Tutorial completion
- Campaign progress
- Settings
- Secret epilogue unlock

Starting a New Game resets AFTERSHIFT campaign progress stored in that browser.

---

## Project Goal

AFTERSHIFT began as a portfolio project combining IT support knowledge with interactive storytelling.

Instead of presenting troubleshooting and cybersecurity concepts only through documentation or isolated command-line examples, the project turns those concepts into an investigation where the player must gather evidence, understand what happened, make decisions, and live with the result.

The goal is to demonstrate technical knowledge while remaining interactive, memorable, and playable.

---

## Author

**Feras M. Jubran**

GitHub: [@WEZx7](https://github.com/WEZx7)

itch.io: [wezx.itch.io/aftershift](https://wezx.itch.io/aftershift)

---

## License

Released under the [MIT License](LICENSE).
