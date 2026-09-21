from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json
root = Path(__file__).resolve().parent.parent
version = json.loads((root / 'extension/manifest.json').read_text())['version']
output = root / 'dist' / f'dark-docs-{version}.zip'
output.parent.mkdir(exist_ok=True)
with ZipFile(output, 'w', ZIP_DEFLATED) as archive:
    for file in sorted((root / 'extension').rglob('*')):
        if file.is_file() and not file.name.startswith('.'):
            archive.write(file, file.relative_to(root / 'extension'))
print(output)
