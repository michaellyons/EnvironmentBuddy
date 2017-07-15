# Enviroment Buddy
Enviroment Buddy (Buddy) is an example Internet of Things (IoT) project to build an [Arduino] device that records atmospheric sensor data, sends that data to a central [node.js] server that logs data to [MongoDB] and broadcasts live metrics to a [ReactJS] webapp.

### Technologies Used
  - [ReactJS] - Front End Framework
  - [node.js] - Back End Server Runtime
  - [Express] - Node Webserver Framework
  - [ws] - Node Websockets
  - [MongoDB] - NoSQL Database
  - [Arduino] - Plug-n-play Circuitry

## Prerequisites
This project's components have varying levels of difficulty and has prerequisites as follows:
 - node v4+
 - Arduino Hardware Components

## This project has several sections:
#####    1 -  Arduino Circuit Hardware
This section walks through the component and circuit configuration required to build a miniature weather station with an Arduino board (using the Uno, but others will work similarly).
#####    2 - NodeJS Server
This section walks through setting up a basic [node.js] websocket server along with a simple HTML page that connects to the socket and displays the live data.
#####    3 - Create React App
This section creates simple React app setup that nicely displays our live data along with graphs that is easily extendable/customizable.
#####    4 - Logging to MongoDB
This section walks through logging data in a NoSQL database for archive viewing, we'll use MongoDB to do this.

##### Extended - React Native App
This extended section will take the React app that was built in Section 3 and rebuild it with a React Native app that has a nearly identical user experience across both iOS and Android.

### Getting Started
Environment Buddy requires [Node.js](https://nodejs.org/) v4+ to run.

Each completed step is stored in a branch within the git tree, the Master branch is the full completed project so you can browse all of the code if you don't need a walkthrough.

To get started just get in the project directory and navigate to the Init branch. This will be essentially an empty project and you can follow along from Chapter 1.

```sh
$ cd EnvironmentBuddy
$ git checkout Init
```

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
   [Arduino]: <https://www.arduino.cc/>
   [express]: <http://expressjs.com>
   [jQuery]: <http://jquery.com>
   [markdown-it]: <https://github.com/markdown-it/markdown-it>
   [mike]: <https://michaellyons.github.io>
   [MongoDB]: <https://www.mongodb.com/>
   [node.js]: <http://nodejs.org>
   [ReactJS]: <https://facebook.github.io/react>
   [React Native]: <https://facebook.github.io/react-native>
   [Redux]: <http://redux.js.org/>
   [ws]: <https://socket.io>
   [Webpack]: <http://webpack.github.io/>
