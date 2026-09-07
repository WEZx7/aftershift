from pathlib import Path
import re
import shutil
import sys

ROOT = Path.cwd()
BACKUP = ROOT / ".aftershift-backup-v1.1"

HTML_FILES = [
    ROOT / "index.html",
    ROOT / "shift1.html",
    ROOT / "shift2.html",
    ROOT / "shift3.html",
    ROOT / "shift4.html",
    ROOT / "shift5.html",
]

PACK_FILES = [
    "aftershift-immersion.css",
    "aftershift-i18n.js",
    "aftershift-audio.js",
    "aftershift-settings.js",
    "aftershift-immersion.js",
]

STYLE_TAG = '<link rel="stylesheet" href="aftershift-immersion.css">'
SCRIPT_FILES = [
    "aftershift-i18n.js",
    "aftershift-audio.js",
    "aftershift-settings.js",
    "aftershift-immersion.js",
]

def fail(message):
    print(f"[ERROR] {message}")
    raise SystemExit(1)

def ensure_repo():
    missing_html = [path.name for path in HTML_FILES if not path.exists()]
    if missing_html:
        fail("Run this from the AFTERSHIFT repository root. Missing: " + ", ".join(missing_html))

    missing_pack = [name for name in PACK_FILES if not (ROOT / name).exists()]
    if missing_pack:
        fail("Upload the v1.1.1 replacement files first. Missing: " + ", ".join(missing_pack))

def backup():
    BACKUP.mkdir(exist_ok=True)

    backup_names = [path.name for path in HTML_FILES] + ["script.js"] + PACK_FILES

    for name in backup_names:
        source = ROOT / name
        target = BACKUP / name

        if source.exists() and not target.exists():
            shutil.copy2(source, target)

    print(f"[OK] Backup saved to {BACKUP.name}/")

def dedupe_tag(text, filename):
    pattern = re.compile(
        rf'^[ \t]*<script[^>]+src=["\']{re.escape(filename)}["\'][^>]*></script>[ \t]*\n?',
        re.MULTILINE | re.IGNORECASE
    )

    matches = list(pattern.finditer(text))

    if len(matches) <= 1:
        return text

    first_start = matches[0].start()
    kept = False
    output = []
    cursor = 0

    for match in matches:
        output.append(text[cursor:match.start()])

        if not kept:
            output.append(match.group(0))
            kept = True

        cursor = match.end()

    output.append(text[cursor:])
    return "".join(output)

def ensure_immersion_tags(path):
    text = path.read_text(encoding="utf-8")

    if "aftershift-immersion.css" not in text:
        if "</head>" not in text:
            fail(f"{path.name}: </head> not found")

        text = text.replace(
            "</head>",
            f'    {STYLE_TAG}\n</head>',
            1
        )

    for filename in SCRIPT_FILES:
        text = dedupe_tag(text, filename)

    missing_scripts = [
        filename
        for filename in SCRIPT_FILES
        if f'src="{filename}"' not in text and f"src='{filename}'" not in text
    ]

    if missing_scripts:
        if "</body>" not in text:
            fail(f"{path.name}: </body> not found")

        block = "".join(
            f'    <script src="{filename}"></script>\n'
            for filename in missing_scripts
        )

        text = text.replace("</body>", block + "</body>", 1)

    path.write_text(text, encoding="utf-8")

def patch_shift1_evidence_total():
    files = [ROOT / "shift1.html", ROOT / "script.js"]
    changed = 0

    for path in files:
        if not path.exists():
            continue

        text = path.read_text(encoding="utf-8")
        original = text

        text = re.sub(r'12\s*/\s*10', '12 / 12', text)

        lines = text.splitlines(keepends=True)
        patched_lines = []

        for line in lines:
            low = line.lower()

            if "evidence" in low:
                line = re.sub(r'(/\s*)10\b', r'\g<1>12', line)

                line = re.sub(
                    r'(?i)\b(totalEvidence|evidenceTotal|TOTAL_EVIDENCE|MAX_EVIDENCE)\s*=\s*10\b',
                    lambda m: m.group(0).replace("10", "12"),
                    line
                )

            patched_lines.append(line)

        text = "".join(patched_lines)

        if text != original:
            path.write_text(text, encoding="utf-8")
            changed += 1
            print(f"[OK] Patched Shift 1 evidence total in {path.name}")

    if changed == 0:
        print("[INFO] No hard-coded Shift 1 /10 evidence display found.")
        print("[INFO] Runtime protection still corrects a visible 12 / 10 to 12 / 12.")

def restore():
    if not BACKUP.exists():
        fail("No .aftershift-backup-v1.1 folder found.")

    for source in BACKUP.iterdir():
        if source.is_file():
            shutil.copy2(source, ROOT / source.name)
            print(f"[OK] Restored {source.name}")

    print("[DONE] v1.1 files restored.")

def main():
    if "--restore" in sys.argv:
        restore()
        return

    ensure_repo()
    backup()

    for path in HTML_FILES:
        ensure_immersion_tags(path)
        print(f"[OK] Checked {path.name}")

    patch_shift1_evidence_total()

    print()
    print("AFTERSHIFT v1.1.1 polish update installed.")
    print()
    print("Test with:")
    print("  python -m http.server 8000")
    print()
    print("Then commit:")
    print('  git add .')
    print('  git commit -m "Polish AFTERSHIFT v1.1 immersion update"')
    print('  git push')
    print()
    print("Restore v1.1 HTML/code backup with:")
    print("  python update_v1_1_1.py --restore")

if __name__ == "__main__":
    main()
