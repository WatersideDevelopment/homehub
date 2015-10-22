module.exports = function(RED) {
    function HomeHubNode(config) {
        /*
         *  Stock HomeHub-Command node setup...
         */
        RED.nodes.createNode(this,config);
        var node = this;
        node.context = {
            global: RED.settings.functionGlobalContext
        };
        node.context.global.nodecount++;
        node.context.global.commands[node.id] = node;

        this.on('close', function() {
            for(var i in node.context.commands) {
                if(node.context.global.commands[i].id == node.id) {
                    delete node.context.global.commands[node.id];
                }
            }
            node.context.global.nodecount--;
            console.log("HOMEHUBNODE: close - nodes is "+node.context.global.nodecount);
        });
        /*
         *  Actual node logix...
         */
        this.on('input', function(msg) {
            msg.payload = "msg.payload";
            node.send(msg);
        });
    }
    RED.nodes.registerType("switch-simple",HomeHubNode);
};
