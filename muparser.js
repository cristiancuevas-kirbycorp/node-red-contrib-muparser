"use strict";
const path = require('path');
const addonPath = path.join(__dirname, 'build', 'Release', 'muparser_node.node');
let MuParser = null;
let addonLoaded = false;

module.exports = function (RED) {
    try {
        const addon = require(addonPath);
        MuParser = addon.MuParser;
        addonLoaded = true;
        RED.log.info("muParser native addon loaded successfully");
    } catch (err) {
        RED.log.error("Failed to load muparser_node.node: " + err.message);
        RED.log.error("Please rebuild the addon with: cd " + __dirname + " && npm run build");
        // Don't return - still register the node so Node-RED doesn't crash
        addonLoaded = false;
    }

    function MuParserNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        
        // Show status if addon not loaded
        if (!addonLoaded) {
            node.status({fill:"red", shape:"ring", text:"Addon not loaded - rebuild required"});
        }

        // Helper function to evaluate expression with given variables
        function evaluateExpression(expression, variables) {
            const p = new MuParser();
            p.setExpression(expression);
            
            // Set all variables
            Object.keys(variables).forEach(name => {
                const val = Number(variables[name]);
                if (isNaN(val)) {
                    throw new Error(`Variable '${name}' has non-numeric value '${variables[name]}' (type: ${typeof variables[name]}). All variable values must be numbers.`);
                }
                p.setVar(name, val);
            });
            
            return p.eval();
        }

        // Helper function to gather variables from message
        function getVariables(msg) {
            const variables = {};
            
            if (config.useVarsFrom) {
                // Mode 1: Dynamic - Get variables from object at specified path
                const pathType = config.varsPathType || 'msg';
                const variableSource = RED.util.evaluateNodeProperty(
                    config.varsPath,
                    pathType,
                    node,
                    msg
                );
                if (!variableSource) {
                    throw new Error(`Variables object not found: ${pathType}.${config.varsPath} is ${variableSource === null ? 'null' : 'undefined'}. Ensure the property exists and contains an object with variable names and numeric values.`);
                }
                if (typeof variableSource !== 'object') {
                    throw new Error(`Variables must be an object: ${pathType}.${config.varsPath} is type '${typeof variableSource}' with value: ${JSON.stringify(variableSource)}. Expected an object like {x: 1, y: 2}.`);
                }
                Object.assign(variables, variableSource);
            } else {
                // Mode 2: Static - Use config.vars mapping (if defined)
                const varsMapping = (config.vars && config.vars.length > 0) ? config.vars : null;
                
                if (varsMapping) {
                    // Static mapping: each variable maps to a message property with type
                    varsMapping.forEach(varDef => {
                        const name = varDef.name;
                        const valType = varDef.valueType || 'msg';
                        const val = RED.util.evaluateNodeProperty(
                            varDef.value,
                            valType,
                            node,
                            msg
                        );
                        if (val === undefined || val === null) {
                            throw new Error(`Variable '${name}' not found: ${valType}.${varDef.value} is ${val === null ? 'null' : 'undefined'}. Check that the property path is correct.`);
                        }
                        variables[name] = val;
                    });
                } else if (msg.vars && typeof msg.vars === 'object') {
                    // Mode 3: Fallback - Use msg.vars if no static vars configured
                    Object.assign(variables, msg.vars);
                }
            }
            
            return variables;
        }

        node.on('input', function (msg) {
            // Check if the addon is loaded
            if (!addonLoaded) {
                node.status({fill:"red", shape:"ring", text:"Addon not loaded"});
                node.error("muParser addon not loaded. Please rebuild with: npm run build", msg);
                const errorMsg = RED.util.cloneMessage(msg);
                errorMsg.error = {
                    message: "muParser addon not loaded. Run 'npm run build' in the node directory.",
                    source: {
                        id: node.id,
                        type: node.type,
                        name: node.name
                    }
                };
                node.send([null, errorMsg]);
                return;
            }
            
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
                        const pathType = config.expressionPathType || 'msg';
                        throw new Error(`Expression not found: ${pathType}.${config.expressionPath} is ${expression === null ? 'null' : expression === undefined ? 'undefined' : 'empty'}. Check that the property exists and contains a valid expression string.`);
                    }
                } else {
                    expression = config.expression || "0";
                }

                // Get variables
                const variables = getVariables(msg);

                // Handle multi-expression mode
                if (config.multiExpressionMode && Array.isArray(expression)) {
                    // Process each expression with the same variables
                    const results = expression.map((expr, index) => {
                        if (!expr || typeof expr !== 'string') {
                            throw new Error(`Expression at index ${index} is invalid: expected string, got ${typeof expr} (${JSON.stringify(expr)})`);
                        }
                        return evaluateExpression(expr, variables);
                    });
                    
                    // Set result to output property
                    RED.util.setMessageProperty(
                        msg,
                        config.outputProperty || 'payload',
                        results,
                        true
                    );
                    
                    // Update status
                    node.status({fill:"green", shape:"dot", text:`Evaluated ${results.length} expressions`});
                    node.send([msg, null]);
                    return;
                }

                // Handle batch mode
                if (config.batchMode) {
                    // Check if we should process as batch
                    const inputValue = RED.util.evaluateNodeProperty(
                        config.outputProperty || 'payload',
                        config.outputPropertyType || 'msg',
                        node,
                        msg
                    );
                    
                    if (Array.isArray(inputValue)) {
                        // Process each element in the array
                        const results = inputValue.map(item => {
                            // Create a copy of variables and add the array item
                            const itemVars = Object.assign({}, variables);
                            // If item is an object, merge its properties as variables
                            if (typeof item === 'object' && item !== null) {
                                Object.assign(itemVars, item);
                            } else {
                                // If item is a scalar, use it as 'x' variable
                                itemVars.x = item;
                            }
                            return evaluateExpression(expression, itemVars);
                        });
                        
                        // Set result to output property
                        RED.util.setMessageProperty(
                            msg,
                            config.outputProperty || 'payload',
                            results,
                            true
                        );
                        
                        // Update status
                        node.status({fill:"green", shape:"dot", text:`Processed ${results.length} items`});
                        node.send([msg, null]);
                        return;
                    }
                }

                // Normal single evaluation
                const result = evaluateExpression(expression, variables);
                
                // Set result to output property
                RED.util.setMessageProperty(
                    msg,
                    config.outputProperty || 'payload',
                    result,
                    true
                );
                
                // Update status with result
                const statusText = Array.isArray(result) 
                    ? `[${result.length} values]` 
                    : result.toFixed(3);
                node.status({fill:"green", shape:"dot", text:statusText});
                
                node.send([msg, null]);
            } catch (err) {
                // Update status with error
                node.status({fill:"red", shape:"ring", text:"Error"});
                
                // Send error to second output
                const errorMsg = RED.util.cloneMessage(msg);
                errorMsg.error = {
                    message: err.message,
                    source: {
                        id: node.id,
                        type: node.type,
                        name: node.name
                    }
                };
                
                node.error("muParser error: " + err.message, msg);
                node.send([null, errorMsg]);
            }
        });
    }

    RED.nodes.registerType("muparser", MuParserNode);
};
