# Vendored muParser Library

**Source:** https://github.com/beltoforion/muparser  
**Version:** v2.3.4 (or latest from main branch as of Nov 2024)  
**License:** MIT (see LICENSE file)

## Included Files
- `include/` - Header files
- `src/` - Source implementation
- `LICENSE` - MIT license
- `README.md` - Original documentation
- `CHANGELOG` - Version history

## Why Vendored?
This library is vendored (copied into the repository) to ensure consistent builds and avoid external dependencies during installation. The muParser library is stable and updates are infrequent.

## Updating
If a new version is needed:
1. Download from https://github.com/beltoforion/muparser/releases
2. Replace `include/` and `src/` directories
3. Update this file with new version number
4. Test compilation with `npm run build`
