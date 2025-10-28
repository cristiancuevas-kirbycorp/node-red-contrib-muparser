module.exports = function(RED) {
    "use strict";
    const path = require('path');
    const addonPath = path.join(__dirname, 'build', 'Release', 'muparser_node.node');
    let MuParser;

    try {
        MuParser = require(addonPath).MuParser;
    } catch (err) {
        RED.log.error("Failed to load muparser_node.node: " + err.message);
        return;
    }

    function MuParserNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;

        node.on('input', function(msg) {
            try {
                const p = new MuParser();
                p.setExpression(config.expression || msg.expression || "0");

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