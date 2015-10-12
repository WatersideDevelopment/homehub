module.exports = function(RED) {
    function HomeHubNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
            msg.payload = "p[oopmsg.payload";
            node.send(msg);
        });
    }
    RED.nodes.registerType("light-simple",HomeHubNode);
}
