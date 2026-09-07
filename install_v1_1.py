from pathlib import Path
import shutil
import sys

ROOT = Path.cwd()
BACKUP = ROOT / ".aftershift-backup-v1.0"

HTML_FILES = [
    ROOT / "index.html",
    ROOT / "shift1.html",
    ROOT / "shift2.html",
    ROOT / "shift3.html",
    ROOT / "shift4.html",
    ROOT / "shift5.html",
]

CSS_TAG = '    <link rel="stylesheet" href="aftershift-immersion.css">\n'
SCRIPT_TAGS = """    <script src="aftershift-i18n.js"></script>
    <script src="aftershift-audio.js"></script>
    <script src="aftershift-settings.js"></script>
    <script src="aftershift-immersion.js"></script>
"""

PACK_FILES = [
    "aftershift-immersion.css",
    "aftershift-i18n.js",
    "aftershift-audio.js",
    "aftershift-settings.js",
    "aftershift-immersion.js",
]

def fail(message):
    print(f"[ERROR] {message}")
    raise SystemExit(1)

def ensure_repo():
    missing = [str(path.name) for path in HTML_FILES if not path.exists()]
    if missing:
        fail("Run this script from the AFTERSHIFT repository root. Missing: " + ", ".join(missing))

    missing_pack = [name for name in PACK_FILES if not (ROOT / name).exists()]
    if missing_pack:
        fail("Immersion pack files are missing: " + ", ".join(missing_pack))

def backup():
    BACKUP.mkdir(exist_ok=True)

    for path in HTML_FILES:
        target = BACKUP / path.name
        if not target.exists():
            shutil.copy2(path, target)

    print(f"[OK] Backup saved to {BACKUP.name}/")

def patch_html(path):
    text = path.read_text(encoding="utf-8")

    if "aftershift-immersion.css" not in text:
        if "</head>" not in text:
            fail(f"{path.name}: </head> not found")
        text = text.replace("</head>", CSS_TAG + "</head>", 1)

    if "aftershift-immersion.js" not in text:
        if "</body>" not in text:
            fail(f"{path.name}: </body> not found")
        text = text.replace("</body>", SCRIPT_TAGS + "</body>", 1)

    path.write_text(text, encoding="utf-8")
    print(f"[OK] Patched {path.name}")

def restore():
    if not BACKUP.exists():
        fail("No .aftershift-backup-v1.0 folder found.")

    for path in HTML_FILES:
        source = BACKUP / path.name
        if source.exists():
            shutil.copy2(source, path)
            print(f"[OK] Restored {path.name}")

    print("[DONE] Original HTML files restored.")

def main():
    if "--restore" in sys.argv:
        restore()
        return

    ensure_repo()
    backup()

    for path in HTML_FILES:
        patch_html(path)

    print()
    print("AFTERSHIFT v1.1 immersion pack installed.")
    print("Test the game locally, then commit:")
    print()
    print('  git add .')
    print('  git commit -m "Add AFTERSHIFT v1.1 immersion settings audio themes and Arabic UI"')
    print('  git push')
    print()
    print("To restore the original HTML files:")
    print("  python install_v1_1.py --restore")

if __name__ == "__main__":
    main()
