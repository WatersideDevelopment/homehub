module.exports = function(RED) {
    "use strict";
    var spawn = require('child_process').spawn;
    var exec = require('child_process').exec;
    var isUtf8 = require('is-utf8');

    function CRelayNode(config) {
        RED.nodes.createNode(this,config);
        this.cmd = (config.command || "").trim();
        if (config.addpay === undefined) { config.addpay = true; }
        this.addpay = config.addpay;
        this.append = (config.append || "").trim();
        this.useSpawn = config.useSpawn;

        var node = this;
        this.on("input", function(msg) {
            node.status({fill:"blue",shape:"dot"});
            if (this.useSpawn === true) {
                // make the extra args into an array
                // then prepend with the msg.payload
                if (typeof(msg.payload !== "string")) { msg.payload = (msg.payload || "").toString(); }
                var arg = [];
                if (node.append.length > 0) { arg = node.append.split(","); }
                if ((node.addpay === true) && (msg.payload.toString().trim() !== "")) { arg.unshift(msg.payload); }
                if (RED.settings.verbose) { node.log(node.cmd+" ["+arg+"]"); }
                if (node.cmd.indexOf(" ") == -1) {
                    var ex = spawn(node.cmd,arg);
                    ex.stdout.on('data', function (data) {
                        //console.log('[exec] stdout: ' + data);
                        if (isUtf8(data)) { msg.payload = data.toString(); }
                        else { msg.payload = data; }
                        node.send([msg,null,null]);
                    });
                    ex.stderr.on('data', function (data) {
                        //console.log('[exec] stderr: ' + data);
                        if (isUtf8(data)) { msg.payload = data.toString(); }
                        else { msg.payload = new Buffer(data); }
                        node.send([null,msg,null]);
                    });
                    ex.on('close', function (code) {
                        //console.log('[exec] result: ' + code);
                        msg.payload = code;
                        node.status({});
                        node.send([null,null,msg]);
                    });
                    ex.on('error', function (code) {
                        node.error(code,msg);
                    });
                }
                else { node.error(RED._("exec.spawnerr")); }
            }
            else {
                var cl = node.cmd;
                if ((node.addpay === true) && ((msg.payload.toString() || "").trim() !== "")) { cl += " "+msg.payload; }
                if (node.append.trim() !== "") { cl += " "+node.append; }
                if (RED.settings.verbose) { node.log(cl); }
                var child = exec(cl, {encoding: 'binary', maxBuffer:10000000}, function (error, stdout, stderr) {
                    msg.payload = new Buffer(stdout,"binary");
                    try {
                        if (isUtf8(msg.payload)) { msg.payload = msg.payload.toString(); }
                    } catch(e) {
                        node.log(RED._("exec.badstdout"));
                    }
                    var msg2 = {payload:stderr};
                    var msg3 = null;
                    //console.log('[exec] stdout: ' + stdout);
                    //console.log('[exec] stderr: ' + stderr);
                    if (error !== null) {
                        msg3 = {payload:error};
                        //console.log('[exec] error: ' + error);
                    }
                    node.status({});
                    node.send([msg,msg2,msg3]);
                });
            }
        });
    }
    RED.nodes.registerType("crelay",CRelayNode);
}
