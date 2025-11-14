# node-red-contrib-muparser

**Blazing-fast math expression evaluator** for Node-RED using **muParser (C++)**.

> **15× faster than JavaScript parsers** — perfect for real-time sensor processing, control systems, and high-frequency data.

---

## Features

- **C++ speed**: ~15M evaluations/sec
- Supports: `sin`, `cos`, `log`, `pow`, `**`, `if()`, variables
- Node-RED UI with expression input
- Dynamic expressions via `msg.expression`
- Variables via `msg.vars`

---
## Build and Install

### Prerequisites
- **Node.js** (v14+)
- **Python** (v3.x, required by node-gyp)
- **C++ build tools**
    - **Windows**: Visual Studio Build Tools
    - **Linux**: `build-essential` (GCC, g++, make)

### Quick Install (From npm - Coming Soon)
```bash
cd ~/.node-red
npm install node-red-contrib-muparser
```

### Build from Source

#### Windows
```bash
cd C:\S2L_Dev\node-red-contrib\node-red-contrib-muparser
npm install
npm run build
```

#### Linux
```bash
# Install build tools first (Ubuntu/Debian)
sudo apt-get update && sudo apt-get install -y build-essential python3

# Build the module
cd ~/node-red-contrib-muparser
npm install
npm run build
```

### Install Local Tarball
```bash
# After building, create a tarball
npm pack

# Install in Node-RED (replace X.X.X with version)
cd ~/.node-red
npm install /path/to/node-red-contrib-muparser-X.X.X.tgz
```

---
## Troubleshooting

### Linux: Missing build tools
```bash
sudo apt-get update && sudo apt-get install -y build-essential python3
```

### Linux: "napi.h: No such file or directory"
```bash
# Ensure dependencies are installed
cd /path/to/node-red-contrib-muparser
npm install
npm run build
```

### Windows: Missing Visual Studio Build Tools
Install from: https://visualstudio.microsoft.com/downloads/
- Select "Desktop development with C++"

### General: Build fails
- Ensure Node.js v14+ is installed: `node --version`
- Ensure Python 3 is installed: `python3 --version`
- Check error logs for specific missing dependencies

---
## Platform Support
- **Windows**: 10/11 with Visual Studio Build Tools
- **Linux**: Ubuntu 20.04+, Debian 10+, and most modern distros
- **macOS**: Should work with Xcode Command Line Tools (untested)

---

