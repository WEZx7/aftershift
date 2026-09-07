# AFTERSHIFT v1.1 — Immersion Pack

This pack adds a non-destructive immersion layer to the existing AFTERSHIFT v1.0 game.

## What it adds

- Procedural ambience generated with the Web Audio API
- UI click / terminal / evidence / alert / success / failure sounds
- Master volume control
- Ambience toggle
- SFX toggle
- English / Arabic interface switch
- RTL layout support for Arabic
- Terminal commands remain LTR
- Theme switcher:
  - Northstar Green
  - Amber Ops
  - SOC Ice
  - NIGHTWATCH (unlocks after the sealed epilogue)
- Reduced Motion accessibility option
- Settings are saved in localStorage
- Small evidence / critical-event visual feedback

No MP3 or external audio files are required.

## Files

Copy these files into the root of the AFTERSHIFT repository:

- `aftershift-immersion.css`
- `aftershift-i18n.js`
- `aftershift-audio.js`
- `aftershift-settings.js`
- `aftershift-immersion.js`
- `install_v1_1.py`

## Install

From the AFTERSHIFT repository root:

```bash
python install_v1_1.py
```

The installer automatically patches:

- `index.html`
- `shift1.html`
- `shift2.html`
- `shift3.html`
- `shift4.html`
- `shift5.html`

It also creates:

```text
.aftershift-backup-v1.0/
```

with the original HTML files.

## Test

Use a local server:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

Audio starts after the first user interaction because modern browsers block autoplay audio.

## Commit

After testing:

```bash
git add .
git commit -m "Add AFTERSHIFT v1.1 immersion settings audio themes and Arabic UI"
git push
```

## Restore

If anything looks wrong:

```bash
python install_v1_1.py --restore
```

## Arabic support note

The pack translates the main campaign UI, shared investigation controls, chapter names, common tutorial text, Shift 4 recovery UI, Shift 5 attribution UI, endings, settings, and other recurring interface text.

Terminal commands intentionally remain in English to preserve the technical feel and avoid RTL issues.

Any very specific narrative sentence that does not exist in the translation dictionary remains in English rather than being translated incorrectly. You can add more exact translations inside `aftershift-i18n.js` at any time.

## NIGHTWATCH theme

The NIGHTWATCH purple theme checks:

```text
aftershift_epilogue_unlocked
```

in localStorage. Players only see the theme after unlocking the sealed epilogue.

That turns the true ending into a small cosmetic reward too.
