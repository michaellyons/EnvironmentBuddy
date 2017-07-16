# Environment Buddy
## NodeJS Server
[node.js] is a minimal run-time environment that allows Javascript execution on a server. It is what we will use to listen to the Arduino's serial output, record that output to a database, and stream the data to our front-end app.

### What we'll do
 - Create a [node.js] Application
 - Read serial output from Arduino
 - Create a Websocket Server
 - Stream Data to Websocket Clients
 - Host preview page to display socket connection

### Code

The first thing that we should do is create a folder to host a NodeJS application that will be our server. In the root project directory go ahead and create a folder named server:
```sh
$ mkdir server && cd server
```

To define a Node Application, we need to create a file called ```package.json``` which will give node basic information about the application.

We'll use the build in utility npm init
```sh
npm init
```
This will walk you through the intro steps to creating a package.json file, ask you some input, then generate the file for you.

It'll ask for:
 - your package's name (Must use lowercase, this project is 'buddyserver')
 - the semantic version (I like to start projects on 0.1.0)
 - a description (Whatever you want)
 - the entry point ("main.js")
 - a test command ("npm test")
 - the git repository (your-git-repository)
 - some keywords ("temperature", "express", "logging", "Arduino", etc..)
 - what license the project has. (MIT is best)


Once we've created the package.json file, we can write our first bit of server code and establish a way to listen to the serial port that the Arduino is sending JSON data to. The library we are going to use is conveniently named serialport.

**Add/include the serialport with v4.0.7 library from NPM**
```bash
$ yarn add serialport@^4.0.7
```
**Create the server directory and add a main.js file**
```
$ touch main.js
```
Open server/main.js in your favorite text editor.

**Import the Serial Port Library**
```js
const SerialPort = require('serialport');
```
***Instantiate SerialPort class with options***
```js
// Define Arduino Port location
const ARDUINO_PORT = "/dev/cu.usbmodemFA141"
// Define Port Options
const portOptions = {
	parser: SerialPort.parsers.readline('\n')
};
// Set up Serial Port Connection
const port = new SerialPort(ARDUINO_PORT, portOptions);
```

***Add Event Handles for the SerialPort***
```js
port.on('open', function() {
  console.log("Serial Port Connection Established");
  port.on('data', function(data) {
    console.log(data);
  });
});
```

With this code so far, you should be able to run the server.js file in your console and see the following:

![Console Code](http://i.imgur.com/bWD3VR9.png)

That's how simple it is to read and print the serial output coming from the Arduino, about 13 lines of code and thoughtfully prepared output we can easily start to work with our data.


Okay now that this is ready, we can go back into our server and install **ws** and **express**. We are going to use the [express] library to create a webserver that can handle HTTP connections, and we will use [ws] as a simple websocket server.

Run this to install both```express``` and  ```ws``` at the versions of when this was written.
```sh
yarn add express@^4.15.3 ws@^3.0.0
```
***index.js***
At the top of your file, add three more lines to import:
```js
// Import Express webserver and HTTP imports
const express = require('express');
const http = require('http');
// Import the Websocket Library
const WebSocket = require('ws');
```

Now  that we have our libraries imported, we can create the servers that will be the core of our application.

First we'll create an Express app which can respond to HTTP requests with files, JSON, binary data, etc.
```js
// Instantiate Express App
const app = express();
// Set Express to serve the preview html page
app.get('/', function(req, res){
  res.sendFile(__dirname + '/preview.html');
});
// Create the HTTP Server with Express app
const server = http.createServer(app);
```

Now that we've created an HTTP server, we'll create a Websocket server that rides on top of the HTTP server.
```js
// Instantiate Websocket Server
const wss = new WebSocket.Server({ server });
```
First we'll define a broadcast function which sends the same data to every client connected.
```js
// Define Broadcast to all function
wss.broadcast = function broadcast(data) {
  // For every client
  wss.clients.forEach(function each(client) {
    // Send if their connection is open
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
};
```

We'll add a websocket connection event handler just so that we can see some console output for the activity.
```js
// Define Websocket connection handler
wss.on('connection', function connection(ws, req) {
  console.log("Received new Websocket Connection");
});
```

Finally we'll tell the HTTP server to listen on port 8000. This will route ```http://``` requests to Express and ```ws://``` requests to Websocket.
```js
// Tell server to Listen to port 8000
server.listen(8000, function listening() {
  console.log('Listening on %d', server.address().port);
});
```

Now that we have the server code ready to go, we can emit a socket event when the serial port receives data. Back up in the serial port 'data' event callback, we will call the broadcast function that we defined earlier instead of just logging to console:
```js
port.on('data', function(data) {
  console.log(data);
  wss.broadcast(data);
});
```
Now we can create a ```preview.html``` file in the server directory, this will be a simple webpage that will display the socket data as a preview without having to build a React App (which we will do in the next chapter). The head of the html document will contain some inline styles to make the preview page look nice. I'm keeping the styles inline because there really aren't that many.

We'll also use [jQuery] so we can easily manipulate the dom, so that will go right below the inline styles.
***preview.html***
```html
<!doctype html>
<html>
  <head>
    <title>Buddy Server</title>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html,
      body {
        height: 100%;
        min-height: 100%;
      }
      body {
        display: flex;
        font: 13px Helvetica, Arial;
        color: white;
        background-repeat: no-repeat;
        background: #1976d2;
        background: -moz-linear-gradient(-45deg, #1976d2 0%, #64b5f6 100%);
        background: -webkit-linear-gradient(-45deg, #1976d2 0%,#64b5f6 100%);
        background: linear-gradient(135deg, #1976d2 0%,#64b5f6 100%);
      }
      .valueDisplay {
        font-size: 4em;
        margin-top: 20px;
      }
      .wrap {
        margin: auto;
        text-align: center;
      }
    </style>
    <script src="https://code.jquery.com/jquery-1.11.1.js"></script>
  </head>
  ```

  This is the body of the HTML preview page, you can see we're just going to display the three values.
  ```html
  <body class="wrap">
    <div style="padding: 20px">
      <h1>Environment Buddy Server</h1>
      <h2 id='conn_label'>Not Connected</h2>
    </div>
    <h1 id="temp" class="valueDisplay" />
    <h1>Temperature</h1>
    <h1 id="humidity" class="valueDisplay" />
    <h1>Humidity</h1>
    <h1 id="brightness" class="valueDisplay" />
    <h1>Brightness</h1>
  </body>
  ```

  This is the custom js that will connect to the server, and modify the dom content when it receives the proper event.
  ```html
  <script>
    (function(){
      $('#temp').html('0');
      $('#humidity').html('0');
      $('#brightness').html(0);
    })();

    var socket = new WebSocket('ws://localhost:8000');

    socket.onopen = function() {
      $('#conn_label').html('Connected')
    };
    socket.onmessage = function (event) {
      console.log(event.data);
      var msg = JSON.parse(event.data);
      $('#temp').html(msg[1][0]+' F');
      $('#humidity').html(msg[1][1]+' %');
      $('#brightness').html(msg[1][2]);
    }
  </script>
</html>
```

Now in the terminal, you should be able to run ```npm start```, then open up a web browser to http://localhost:8000 and you should see something like this this:

![ServerWebImage](http://i.imgur.com/5ldAoGR.png)

At this point we have a working example that looks pretty good. We're going to take in a few steps further and build this in React, then add some interactive functionality and graphing.

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
   [Arduino]: <https://www.arduino.cc/>
   [ArduinoIDE]: <https://www.arduino.cc/en/Main/Software>
   [express]: <http://expressjs.com>
   [jQuery]: <http://jquery.com>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [mike]: <https://michaellyons.github.io>
   [MongoDB]: <https://www.mongodb.com/>
   [node.js]: <http://nodejs.org>
   [npm]: <https://www.npmjs.com/>
   [ReactJS]: <https://facebook.github.io/react>
   [Redux]: <http://redux.js.org/>
   [ws]: <https://www.npmjs.com/package/ws>
