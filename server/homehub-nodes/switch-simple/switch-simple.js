module.exports = function(RED) {
    function HomeHubNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        node.context = RED.settings.functionGlobalContext;
        node.context.nodecount++;
        node.context.commands[node.id] = node;

        this.on('input', function(msg) {
            msg.payload = "msg.payload";
            node.send(msg);
        });

        this.on('close', function() {
            for(var i in node.context.commands) {
                if(node.context.commands[i].id == node.id) {
                    delete node.context.commands[node.id];
                }
            }
            node.context.nodecount--;
            console.log("HOMEHUBNODE: close - nodes is "+node.context.nodecount);
        });
        this.on('open', function(msg) {
            console.log("HOMEHUBNODE: open");
        });
    }
    RED.nodes.registerType("switch-simple",HomeHubNode);
};
