"""Build the upload ZIP plus a separate, clearly labeled submission kit."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import hashlib
import json
import runpy

root = Path(__file__).resolve().parent.parent
runpy.run_path(str(root / 'scripts/package.py'))
version = json.loads((root / 'extension/manifest.json').read_text())['version']
upload = root / 'dist' / f'dark-docs-{version}.zip'
kit = root / 'dist' / f'dark-docs-submission-kit-{version}.zip'

files = {
    upload: f'upload/{upload.name}',
    root / 'store/SUBMISSION.md': 'SUBMISSION.md',
    root / 'PRIVACY.md': 'PRIVACY.md',
    root / 'DEVELOPMENT.md': 'DEVELOPMENT.md',
    root / 'TESTING.md': 'TESTING.md',
    root / 'extension/icons/128.png': 'assets/icon-128.png',
}
for asset in sorted((root / 'store/assets').glob('*')):
    if asset.is_file() and not asset.name.startswith('.'):
        files[asset] = f'assets/{asset.name}'

with ZipFile(kit, 'w', ZIP_DEFLATED) as archive:
    for source, destination in files.items():
        archive.write(source, destination)
    archive.writestr('START-HERE.txt', (
        f'Upload upload/{upload.name} to Chrome Web Store.\n'
        'Do NOT upload this whole submission-kit ZIP.\n'
        'SUBMISSION.md has the copy-ready fields and remaining requirements.\n'
        'The source-tree paths in the guide refer to the GitHub repository;\n'
        'the supplied images are in assets/ in this kit.\n'
        'A real light-appearance comparison screenshot is in assets/.\n'
        'The primary dark screenshot is pending manual selection of Dark.\n'
        'Promotional artwork is not a substitute for a product screenshot.\n'
    ))

checksums = root / 'dist' / f'SHA256SUMS-{version}.txt'
checksums.write_text(''.join(
    f'{hashlib.sha256(path.read_bytes()).hexdigest()}  {path.name}\n'
    for path in (upload, kit)
))
print(kit)
print(checksums)
