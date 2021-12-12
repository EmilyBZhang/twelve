"""Generates a TypeScript file to access asset modules directly"""

import os

IN_DIR = './src/assets'
OUT_PATH = './src/res/assets.tsx'

pwd = os.getcwd()
os.chdir(IN_DIR)
assets = {}
for dirpath, dirnames, filenames in os.walk('.'):
    if dirpath == '.':
        continue
    path = os.path.normpath(dirpath).split(os.sep)
    root_dir = path[0]
    file_dir = os.path.join('', *path[1:])
    assets.setdefault(root_dir, []).extend(
        os.path.join(file_dir, filename) for filename in filenames
    )
os.chdir(pwd)

with open(OUT_PATH, 'w') as f:
    f.write(f'// Generated using {__file__}\n')

    def prepare_asset(asset_name: str):
        require_path = os.path.join('assets', asset_type, asset_name)
        return f"""'{asset_name}': require('{require_path}'),"""

    for asset_type, asset_names in assets.items():
        f.write(f'\nexport const {asset_type} = {{\n  ')
        f.write('\n  '.join(map(prepare_asset, sorted(asset_names))))
        f.write('\n};\n')
