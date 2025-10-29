"use strict";
const path = require('path');
const addonPath = path.join(__dirname, 'build', 'Release', 'muparser_node.node');
let MuParser;

function getByPath(obj, path) {
    return path.split('.').reduce((o, p) => (o ? o[p] : undefined), obj);
}

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
                if (config.useExpressionFrom) {
                    if (!config.expressionPath) {
                        throw new Error("Expression path is not defined in node configuration.");
                    }
                    // Remove leading "msg." if present
                    const path = config.expressionPath.replace(/^msg\./, "");
                    expression = getByPath(msg, path);
                    if (expression === undefined || expression === null || expression === "") {
                        throw new Error("Expression not found or empty at path: " + config.expressionPath);
                    }
                } else {
                    expression = config.expression || "0";
                }

                const p = new MuParser();
                p.setExpression(expression);

                // Extract variables from msg.vars or config.vars
                const vars = config.vars || msg.vars || {};
                Object.keys(vars).forEach(name => {
                    const val = RED.util.evaluateNodeProperty(vars[name], 'msg', this, msg);
                    p.setVar(name, val);
                });

                msg.payload = p.eval();
                node.send(msg);
            } catch (err) {
                node.error("muParser error: " + err.message, msg);
            }
        });
    }

    RED.nodes.registerType("muparser", MuParserNode);
};
