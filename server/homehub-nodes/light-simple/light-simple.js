module.exports = function(RED) {
    var globalContext = RED.settings.functionGlobalContext;

    function HomeHubNode(config) {
        console.log("HOMEHUBNODE");
        console.log(config);
        RED.nodes.createNode(this,config);
        globalContext.nodecount++;
        var node = this;
        globalContext.commands[node.id] = node;
        this.on('input', function(msg) {
            console.log("HOMEHUBNODE: input");
            msg.payload = "msg.payload";
            node.send(msg);
        });
        this.on('close', function() {
            for(var i in globalContext.commands) {
                if(globalContext.commands[i].id == node.id) {
                    delete globalContext.commands[node.id];
                }
            }
            globalContext.nodecount--;
            console.log("HOMEHUBNODE: close - nodes is "+globalContext.nodecount);
        });
        this.on('open', function(msg) {
            console.log("HOMEHUBNODE: open");
        });
        console.log("node");
        console.log(node);
        console.log("globalContext.commands.indexOf");
        console.log(globalContext.commands.indexOf(node));
        console.log("HOMEHUBNODEINITED - nodes is "+globalContext.nodecount);
    }
    RED.nodes.registerType("light-simple",HomeHubNode);
}
