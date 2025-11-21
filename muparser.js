"use strict";
const path = require('path');
const addonPath = path.join(__dirname, 'build', 'Release', 'muparser_node.node');
let MuParser;

module.exports = function (RED) {
    try {
        MuParser = require(addonPath).MuParser;
    } catch (err) {
        RED.log.error("Failed to load muparser_node.node: " + err.message);
        return;
    }

    function MuParserNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function (msg) {
            try {
                let expression;
                // Handle expression: dynamic or static
                if (config.useExpressionFrom) {
                    expression = RED.util.evaluateNodeProperty(
                        config.expressionPath, 
                        config.expressionPathType || 'msg', 
                        node, 
                        msg
                    );
                    if (expression === undefined || expression === null || expression === "") {
                        throw new Error("Expression not found or empty at: " + config.expressionPath);
                    }
                } else {
                    expression = config.expression || "0";
                }

                const p = new MuParser();
                p.setExpression(expression);

                // Handle variables: three modes with priority order
                if (config.useVarsFrom) {
                    // Mode 1: Dynamic - Get variables from object at specified path
                    const variableSource = RED.util.evaluateNodeProperty(
                        config.varsPath,
                        config.varsPathType || 'msg',
                        node,
                        msg
                    );
                    if (!variableSource || typeof variableSource !== 'object') {
                        throw new Error("Variables not found or not an object at: " + config.varsPath);
                    }
                    // Set variables directly from the object
                    Object.keys(variableSource).forEach(name => {
                        const val = Number(variableSource[name]);
                        if (isNaN(val)) {
                            throw new Error(`Variable '${name}' has non-numeric value: ${variableSource[name]}`);
                        }
                        p.setVar(name, val);
                    });
                } else {
                    // Mode 2: Static - Use config.vars mapping (if defined)
                    // Mode 3: Fallback - Use msg.vars if no static vars configured
                    const varsMapping = (config.vars && config.vars.length > 0) ? config.vars : null;
                    
                    if (varsMapping) {
                        // Static mapping: each variable maps to a message property with type
                        varsMapping.forEach(varDef => {
                            const name = varDef.name;
                            const val = RED.util.evaluateNodeProperty(
                                varDef.value,
                                varDef.valueType || 'msg',
                                node,
                                msg
                            );
                            if (val === undefined || val === null) {
                                throw new Error(`Variable '${name}' not found at: ${varDef.value}`);
                            }
                            const numVal = Number(val);
                            if (isNaN(numVal)) {
                                throw new Error(`Variable '${name}' has non-numeric value: ${val}`);
                            }
                            p.setVar(name, numVal);
                        });
                    } else if (msg.vars && typeof msg.vars === 'object') {
                        // Fallback: use msg.vars object
                        Object.keys(msg.vars).forEach(name => {
                            const val = Number(msg.vars[name]);
                            if (isNaN(val)) {
                                throw new Error(`Variable '${name}' in msg.vars has non-numeric value: ${msg.vars[name]}`);
                            }
                            p.setVar(name, val);
                        });
                    }
                    // If neither static vars nor msg.vars exist, proceed with no variables
                }

                msg.payload = p.eval();
                node.send(msg);
            } catch (err) {
                node.error("muParser error: " + err.message, msg);
            }
        });
    }

    RED.nodes.registerType("muparser", MuParserNode);
};
