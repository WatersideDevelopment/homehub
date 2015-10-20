module.exports = function(RED) {
    function HomeHubNode(config) {
	console.log("HOMEHUBNODE");
	console.log(config);
        RED.nodes.createNode(this,config);
        var node = this;
        this.on('input', function(msg) {
            msg.payload = "msg.payload";
            node.send(msg);
        });
	this.on('close', function() {
    		// tidy up any state
	});
	console.log(node);
	console.log("HOMEHUBNODEINITED");
    }
    RED.nodes.registerType("light-simple",HomeHubNode);
}
