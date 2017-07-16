const SerialPort = require('serialport');

// Define Arduino Port location
const ARDUINO_PORT = "/dev/cu.usbmodemFA141"

// Define Port Options
const portOptions = {
    parser: SerialPort.parsers.readline('\n')
};
// Set up Serial Port Connection
const port = new SerialPort(ARDUINO_PORT, portOptions);

port.on('open', function() {
  console.log("Serial Port Connection Established");
  port.on('data', function(data) {
    var pData = JSON.parse(data);
    console.log(pData);
  });
});
