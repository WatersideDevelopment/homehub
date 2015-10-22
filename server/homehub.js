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
    editorTheme: {
        page: {
            title: "homehub flow editor",
            favicon: "/absolute/path/to/theme/icon",
            css: "/absolute/path/to/custom/css/file"
        },
        header: {
            title: "homehub",
            image: null, // or null to remove image
            url: "http://www.watersidedevelopement.co.uk/portfolio/homehub" // optional url to make the header text/image a link to this url
        },

        deployButton: {
            type:"simple",
            label:"Save",
            icon: null // or null to remove image
        },

        menu: { // Hide unwanted menu items by id. see editor/js/main.js:loadEditor for complete list
            "menu-item-import-library": false,
            "menu-item-export-library": false,
            "menu-item-keyboard-shortcuts": false,
            "menu-item-help": {
                label: "Alternative Help Link Text",
                url: "http://example.com"
            }
        },

        userMenu: false, // Hide the user-menu even if adminAuth is enabled

        login: {
            image: "/absolute/path/to/login/page/big/image" // a 256x256 image
        }
    },
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