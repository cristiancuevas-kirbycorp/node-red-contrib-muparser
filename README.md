# node-red-contrib-muparser

**Blazing-fast math expression evaluator** for Node-RED using **muParser (C++)**.

> **15× faster than JavaScript parsers** — perfect for real-time sensor processing, control systems, and high-frequency data.

---

## Features

- **Blazing-fast C++ engine**: 18M+ evaluations/sec on modern CPUs
- **Static or dynamic expressions**: Define once or load from message properties
- **Flexible variable sources**: Manual mapping, object-based, or auto-detect from `msg.vars`
- **Custom output location**: Store results anywhere (msg/flow/global properties)
- **Batch processing mode**: Process arrays element-by-element automatically
- **Dual outputs**: Separate routing for successful results and errors
- **Live status indicator**: Visual feedback showing current state and results
- **Rich function library**: All muParser built-ins including:
    - Arithmetic: `+`, `-`, `*`, `/`, `^`, `**`, parentheses
    - Trigonometric: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `sinh`, `cosh`, `tanh`
    - Logarithmic: `ln`, `log10`, `log2`, `exp`
    - Rounding: `floor`, `ceil`, `round`, `abs`, `sign`
    - Min/Max: `min(a,b)`, `max(a,b)`
    - Conditional: `if(cond, true, false)`
    - Comparison: `<`, `>`, `<=`, `>=`, `==`, `!=`
    - Logical: `&&`, `||`, `!`
    - Constants: `pi`, `e`
- **Multiple outputs**: Return arrays using comma-separated expressions (e.g., `x*cos(theta), x*sin(theta)`)
- **No JavaScript eval()**: Safe, native, and fast
- **Enhanced error messages**: Detailed context for debugging
- **Cross-platform**: Windows, Linux, macOS

---

## Quick Examples

### Example 1: Basic Usage
```javascript
// Expression: sqrt(x^2 + y^2)
// Variables: x → msg.payload.x, y → msg.payload.y

Input:  { "payload": { "x": 3, "y": 4 } }
Output: { "payload": 5 }
```

### Example 2: Custom Output Location
```javascript
// Expression: temp * 1.8 + 32
// Variables: temp → msg.payload.celsius
// Result to: msg.payload.fahrenheit

Input:  { "payload": { "celsius": 25 } }
Output: { "payload": { "celsius": 25, "fahrenheit": 77 } }
```

### Example 3: Batch Processing
```javascript
// Expression: x^2 + 1
// Variables: x → msg.payload (batch mode enabled)

Input:  { "payload": [1, 2, 3, 4] }
Output: { "payload": [2, 5, 10, 17] }
```

### Example 4: Variables from Object
```javascript
// Expression: a + b * c
// Variables from: msg.vars

Input:  { "vars": { "a": 10, "b": 5, "c": 2 } }
Output: { "payload": 20 }
```

### Example 5: Dynamic Expression
```javascript
// Expression from: msg.formula
// Variables from: msg.params

Input:  { 
  "formula": "radius * radius * pi",
  "params": { "radius": 5 }
}
Output: { "payload": 78.54 }  // ≈ area of circle
```

### Example 6: Error Handling
```javascript
// Expression: sqrt(x)
// Variables: x → msg.value
// Output 1: Success, Output 2: Errors

Input to Output 1:  { "value": 16 }
→ { "payload": 4 }

Input to Output 2:  { "value": -4 }
→ { "value": -4, "error": { "message": "...", "source": {...} } }
```

---

## Configuration

### Expression
- **Static**: Enter expression directly in the node configuration
- **Dynamic**: Load expression from a message property (msg/flow/global)

### Variables
- **Define manually**: Map each variable to a specific property path
  - Example: `x` → `msg.payload.x`, `y` → `msg.payload.y`
- **From object**: Point to an object containing all variables
  - Example: `msg.payload.vars` where object is `{x: 3, y: 4}`
- **Auto-detect**: Automatically uses `msg.vars` if no variables are configured

### Output
- **Result to**: Choose where to store the result (default: `msg.payload`)
  - Supports msg, flow, and global contexts
- **Batch mode**: When enabled, processes array inputs element-by-element
  - Each element becomes the variable, or if element is an object, its properties become variables
- **Dual outputs**:
  - Output 1: Messages with successful results
  - Output 2: Messages with errors (includes original message + error details)

### Status Indicator
The node displays real-time status:
- **Green dot**: Success (shows result value)
- **Red ring**: Error occurred
- **Processing count**: Shows number of items processed in batch mode

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

