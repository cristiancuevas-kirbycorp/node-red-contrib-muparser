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

```bash
## Build
git clone https://github.com/beltoforion/muparser.git muparser
cd C:\S2L_Dev\node-red-contrib\node-red-contrib-muparser
npm run clean
npm run build


## Install

cd ~/.node-red
npm install node-red-contrib-muparser

