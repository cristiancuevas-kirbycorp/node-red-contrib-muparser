# node-red-contrib-muparser

**Blazing-fast math expression evaluator** for Node-RED using **muParser (C++)**.

> **15× faster than JavaScript parsers** — perfect for real-time sensor processing, control systems, and high-frequency data.

---


## Features

- **Blazing-fast C++ engine**: 15M–18M+ evaluations/sec on modern CPUs
- **Node-RED UI**: Intuitive node for entering math expressions and mapping variables
- **Dynamic expressions**: Use a static expression or set it dynamically from any property (e.g., `msg.payload.expression`)
- **Flexible variable mapping**: Map variables to any property in the incoming message (e.g., `payload.x`, `msg.temp`)
- **Variables via `msg.vars` or node config**: Pass variables as an object in `msg.vars` or configure in the node
- **Rich function/operator support**: All muParser built-ins, including:
    - Arithmetic: `+`, `-`, `*`, `/`, `^`, `**`, parentheses
    - Trigonometric: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `sinh`, `cosh`, `tanh`
    - Logarithmic: `ln`, `log10`, `log2`, `exp`
    - Rounding: `floor`, `ceil`, `round`, `abs`, `sign`
    - Min/Max: `min(a,b)`, `max(a,b)`
    - Conditional: `if(cond, true, false)`
    - Constants: `pi`, `e`
- **Multiple outputs**: Return arrays by using comma-separated expressions (e.g., `x*cos(theta), x*sin(theta)`)
- **No JavaScript eval()**: Safe, native, and fast
- **Error handling**: Errors are reported in the Node-RED debug tab
- **Cross-platform**: Windows, Linux, macOS (untested)

---

### Example Usage

**Expression:** `sqrt(x^2 + y^2) + sin(z)`  
**Variables:**
    - `x` → `payload.x`
    - `y` → `payload.y`
    - `z` → `payload.angle`
**Input:** `{ "x": 3, "y": 4, "angle": 1.57 }`
**Output:** `5.999...` (≈ 6)

---

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

