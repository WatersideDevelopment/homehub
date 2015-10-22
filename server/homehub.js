"use strict";

var http = require('http');
var express = require("express");
var repl = require("repl");
var RED = require("node-red");

// Create an Express app
var app = express();

// Add a simple route for static content served from 'public'
app.use("/",express.static("public"));

// Create a server
var server = http.createServer(app);

// Create the settings object - see default settings.js file for other options
var settings = {
    httpAdminRoot:"/red",
    httpNodeRoot: "/api",
    nodesDir: __dirname+'/homehub-nodes',
    userDir:  __dirname+'/nodered_modules',
    flowFile: "flows.json",
    httpNodeMiddleware: function(req,res,next) {
        // Perform any processing on the request.
        // Be sure to call next() if the request should be passed
        // to the relevant HTTP In node
        console.log(req.uri);
        next()
    },
    paletteCategories: [
        'homehub-commands',
        'subflows',
        'homehub-advanced',
        'input',
        'output',
        'function',
        'social',
        'storage',
        'analysis',
        'advanced'
    ],
    functionGlobalContext: {
        commands: [],
        nodecount: 0
    }    // enables global context
};

// Initialise the runtime with a server and settings
RED.init(server,settings);

// Serve the editor UI from /red
app.use(settings.httpAdminRoot,RED.httpAdmin);

// Serve the http nodes UI from /api
app.use(settings.httpNodeRoot,RED.httpNode);

server.listen(8000);

// Start the runtime
RED.start();

var envName = process.env.NODE_ENV || "dev";

var shutdown = function() {
    RED.stop();
    server.close();
    process.exit();
};

// open the repl session
var replServer = repl.start({
    prompt: "homehub (" + envName + ") > "
});

replServer.on('exit', shutdown);

replServer.context.RED = RED;
replServer.context.getCommands = function() {
    console.log(RED.settings.functionGlobalContext.commands);
};