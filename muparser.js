module.exports = function(RED) {
    const path = require('path');
    let MuParser;
    try {
        MuParser = require('./build/Release/muparser_node').MuParser;
    } catch (err) {
        RED.log.error("muParser native module failed to load: " + err.message);
        RED.log.info("Run 'npm run build' in the node-red-contrib-muparser directory");
        return;
    }

    function MuParserNode(config) {
        RED.nodes.createNode(this, config);
        const node = this;
        let parser = new MuParser();

        if (config.expression) {
            try {
                parser.setExpression(config.expression);
            } catch (e) {
                node.error("Invalid expression: " + e.message);
            }
        }

        node.on('input', function(msg) {
            try {
                // Allow dynamic expression
                if (config.useMsg && msg.expression) {
                    parser.setExpression(msg.expression);
                }

                // Set variables
                if (msg.vars && typeof msg.vars === 'object') {
                    for (const [key, val] of Object.entries(msg.vars)) {
                        if (typeof val === 'number') {
                            parser.setVar(key, val);
                        }
                    }
                }

                msg.payload = parser.eval();
                node.send(msg);
            } catch (err) {
                node.error("muParser error: " + err.message, msg);
            }
        });
    }

    RED.nodes.registerType("muparser", MuParserNode);
};