# AFTERSHIFT v1.1.1 — Polish Pack

Drop-in replacement for the v1.1 immersion files.

## Fixes

- Fixes the Shift 1 `12 / 10` evidence display when present
- Adds a runtime safeguard for the same display
- Improves Arabic RTL behavior while keeping terminals / commands LTR
- Adds Arabic ending subtitles and Arabic ending summaries
- Adds many more translated interface, evidence, recovery, attribution and ending strings
- Improves dynamically created text translation
- Keeps technical identifiers such as `NW-ROOT`, `RELAY-09`, `ORCH-13` and terminal commands readable in LTR

## Audio polish

- Per-shift procedural ambience
- Subtle background operational signals
- Stronger Shift 4 blackout atmosphere
- NIGHTWATCH sting in Shift 5
- Click, command, evidence, alert, success and failure sounds
- Audio-ready status in Settings
- No copyrighted or external audio files

## Theme polish

Five options now appear as preview cards:

- Northstar Green
- SOC Ice
- Amber Ops
- Adaptive Shift
- NIGHTWATCH

`Adaptive Shift` changes the interface mood depending on the chapter.

`NIGHTWATCH` remains a reward unlocked by the sealed epilogue.

## Install over your current v1.1 test

Upload / replace these files in the repository root:

- `aftershift-immersion.css`
- `aftershift-i18n.js`
- `aftershift-audio.js`
- `aftershift-settings.js`
- `aftershift-immersion.js`
- `update_v1_1_1.py`

Then run:

```bash
python update_v1_1_1.py
```

Test locally:

```bash
python -m http.server 8000
```

Open the forwarded port and test:

1. English
2. Arabic
3. All theme cards
4. Terminal direction in Arabic
5. Shift 1 ending evidence total
6. Shift 4 blackout audio
7. Shift 5 NIGHTWATCH / ending
8. Volume, ambience, SFX and Reduced Motion persistence

## Commit only after testing

```bash
git add .
git commit -m "Polish AFTERSHIFT v1.1 immersion update"
git push
```

## Restore

The updater stores the current v1.1 files in:

```text
.aftershift-backup-v1.1/
```

Restore them with:

```bash
python update_v1_1_1.py --restore
```

## Arabic design choice

Ending names remain in English as part of AFTERSHIFT's visual identity.

When Arabic is selected, the game adds the Arabic ending name and a localized ending summary beneath it.

This keeps names such as `FIRST LIGHT`, `DEAD CHANNEL` and `LIGHTS ON` recognizable while making the story understandable in Arabic.
