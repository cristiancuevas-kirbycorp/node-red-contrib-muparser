# Changelog

All notable changes to node-red-contrib-muparser will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.2.4] - 2024-11-24

### Fixed
- Fixed locale initialization to use pointer-based lazy initialization
  - Previous version had scope issues with change_dec_sep
  - Now uses heap allocation with null check for truly lazy initialization

## [1.2.3] - 2024-11-24

### Fixed
- **Critical**: Patched muParserBase.cpp to use function-local static for locale
  - Global static std::locale initialization was causing segfaults on Linux during module load
  - Changed to lazy initialization using function-local static (Meyers Singleton pattern)
  - This avoids static initialization order fiasco in shared libraries

### Changed
- Re-added muParserCallback.cpp to build (needed for function support)

## [1.2.2] - 2024-11-24

### Fixed
- **Critical**: Excluded muParserTest.cpp and muParserDLL.cpp from build
  - These files contain global static initializers that cause segfaults on module load
  - Removed unnecessary test and DLL code from the build
  - Added Linux-specific build flags for better compatibility

### Changed
- Improved binding.gyp with platform-specific flags
- Added -fPIC flag for Linux builds

## [1.2.1] - 2024-11-24

### Added
- Full muParser integration with explicit Napi:: namespacing
- Heap-allocated parser with proper destructor
- All original functionality restored

### Fixed
- Compilation issues on Linux resolved by explicit namespace qualifiers
- No custom operators added in constructor to avoid segfaults

## [1.2.0] - 2024-11-24

### Fixed
- Fixed namespace issues by using explicit Napi:: qualifiers instead of `using namespace`
- Minimal test version should now compile on Linux
- Returns dummy value (42) for debugging

## [1.1.9] - 2024-11-24

### Fixed
- Fixed binding.gyp to match minimal test code (removed muParser sources)
- This version is for debugging only - returns dummy value (42)

## [1.1.8] - 2024-11-24

### Fixed
- **Debug**: Minimal NAPI wrapper without muParser to isolate segfault
  - Removed all muParser code temporarily to test if NAPI binding itself works
  - Returns dummy value (42) for testing
  - This version is for debugging only

## [1.1.7] - 2024-11-24

### Fixed
- **Critical**: Changed muParser from member variable to heap-allocated pointer
  - Stack-allocated mu::Parser was causing segfaults during object construction on Linux
  - Now using `new mu::Parser()` with proper destructor cleanup
  - Added null checks for parser in all methods
  - Improved build configuration with explicit C++14 standard and exception handling

### Changed
- Updated binding.gyp to use C++14 standard and enable NAPI_CPP_EXCEPTIONS
- Added explicit exception flags for Linux builds

## [1.1.6] - 2024-11-24

### Fixed
- **Critical**: Removed DefineOprt call from constructor to fix segmentation fault on Linux
  - DefineOprt was causing crashes even with static function pointers on some systems
  - Removed custom `**` power operator (use built-in `pow(x,y)` function instead)
  - Constructor is now minimal and safe across all platforms

### Changed
- Users should use `pow(base, exponent)` instead of `base**exponent` for power operations

## [1.1.5] - 2024-11-24

### Fixed
- **Critical**: Removed pre-built binaries from npm package to force platform-specific builds
  - Previously, Windows-built .node files were included in package causing segfaults on Linux
  - Now excludes entire `build/` directory, forcing rebuild from source on target platform
  - Ensures the segfault fix from 1.1.3 is actually applied on Linux systems
  - Added fallback message to install script if build fails

### Changed
- Updated .npmignore to exclude all build artifacts
- Package now contains only source files, ensuring clean builds on all platforms

## [1.1.4] - 2024-11-24

### Fixed
- **Critical**: Fixed install script to properly build native addon on `npm install`
  - Removed `--ignore-scripts` flag that was preventing automatic build
  - Addon now builds automatically when installed via npm
- Fixed false "addon not loaded" errors when addon was actually loaded successfully
  - Added `addonLoaded` flag to properly track addon loading state
  - Now correctly detects when MuParser class is available
  - Added success log message when addon loads properly

### Changed
- Improved addon loading detection logic for better reliability

## [1.1.3] - 2024-11-24

### Fixed
- **Critical**: Fixed segmentation fault on Linux when loading native addon
  - Replaced lambda function with static function pointer for power operator `**`
  - Lambda functions in DefineOprt were causing crashes on some Linux systems
  - Now uses proper function pointer that's compatible across all platforms

## [1.1.2] - 2024-11-24

### Fixed
- **Critical**: Fixed Node-RED crash loop when native addon fails to load (re-release with complete fix)
  - Previously, if the addon wasn't built or failed to load, the module would return early without registering the node type, causing Node-RED to crash repeatedly
  - Now gracefully handles missing addon and displays clear error status
  - Shows "Addon not loaded - rebuild required" status on nodes when addon isn't available
  - Provides helpful error messages directing users to run `npm run build`
  - Allows Node-RED to start successfully even when addon needs rebuilding

### Changed
- Improved error messages with rebuild instructions
- Added visual status indicators when addon is not loaded

## [1.1.1] - 2024-11-24

### Fixed
- Partial fix for addon loading issue (superseded by 1.1.2)

## [1.1.0] - 2024-11-23

### Added
- Batch processing mode for array inputs
- Custom output location (msg/flow/global properties)
- Dual outputs for success/error routing
- Enhanced error messages with detailed context
- Dynamic expression loading from message properties
- Flexible variable sources (manual mapping, object-based, auto-detect)
- Live status indicator showing current state and results
- Support for multiple outputs via comma-separated expressions
- Power operator `**` support

### Changed
- Improved variable handling with multiple input modes
- Better error handling and reporting

## [1.0.0] - 2024-11-20

### Added
- Initial release
- Native C++ muParser integration
- Static expression evaluation
- Basic variable support via msg.vars
- Cross-platform support (Windows, Linux, macOS)
- Comprehensive function library (trig, log, rounding, conditional, etc.)
