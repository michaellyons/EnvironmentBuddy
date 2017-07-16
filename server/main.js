// Import Serialport
const SerialPort = require('serialport');
// Import Express webserver and HTTP imports
const express = require('express');
const http = require('http');
// Import the Websocket Library
const WebSocket = require('ws');

// Define Arduino Port location
const ARDUINO_PORT = "/dev/cu.usbmodemFA141"
// Define Port Options
const portOptions = {
    parser: SerialPort.parsers.readline('\n')
};
// Set up Serial Port Connection
const port = new SerialPort(ARDUINO_PORT, portOptions);

// Setup Port Open Event handler
port.on('open', function() {
  console.log("Serial Port Connection Established");
  port.on('data', function(data) {
    console.log(data);
    wss.broadcast(data);
  });
});

// Instantiate Express App
const app = express();
// Set Express to serve the preview html page
app.get('/', function(req, res){
  res.sendFile(__dirname + '/preview.html');
});
// Create the HTTP Server with Express app
const server = http.createServer(app);

// Instantiate Websocket Server
const wss = new WebSocket.Server({ server });
// Define Broadcast to all function
wss.broadcast = function broadcast(data) {
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};

// Define Websocket connection handler
wss.on('connection', function connection(ws, req) {
  console.log("Received new Websocket Connection");
});

// Tell server to Listen to port 8000
server.listen(8000, function listening() {
  console.log('Listening on %d', server.address().port);
});
