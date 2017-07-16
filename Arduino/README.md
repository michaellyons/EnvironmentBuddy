# Environment Buddy
## Arduino
Using the DHT11 (or DHT22) sensor, we can very easily read the humidity and temperature of the local environment. This is useful for remote weather stations, garden projects, indoor terrarium monitoring, etc. The components used in this example were sourced from a starter-kit

#### Required Hardware
This weather system's components are simple and pretty cheap
 - Arduino Uno   ~$25
 - DHT11 (or DHT22) Sensor  ~$5-10
 - 1 Photoresistor (Photocell/LDR)  ~$1 each
 - 6 Jumper Wires
 - 1 10k Ohm Resistor
 - Extra 10k Ohm Resistor (If using 4-pin sensor)

 ### Required Software
Make sure you have the [ArduinoIDE] installed and ready to go. The code you need will be provided in this section.
### Setup Preview
![Image](http://i.imgur.com/3R8ujsy.jpg)

If you purchased a kit, your temperature sensor may have varying pin counts (3 or 4), here are the different schematic visuals:

### 3 Pin Version Connection
![3pin](http://i.imgur.com/qOextYN.png)

### 4 Pin Version Connection
![4pin](http://i.imgur.com/IL54igX.png)

# Code

First create a subfolder in the project root to house the Arduino Code:
```sh
$ mkdir Arduino
```

Now open a fresh sketch in your [ArduinoIDE] and we'll write the code to read the temp/humidity and the light intensity.

**Add/include the DHT Library from the library manager**
```c++
#include <DHT.h>
```
**Add definitions for the pin location and the sensor type**
```c++
// Define your pin number and sensor type
#define DHTPIN 7
#define DHTTYPE DHT11

// Define LDR Analog input pin A0
const int LDR_Pin = A0;
// Set a delay time to 5000
// This will be a 5 second pause between sensor readings
const int DELAY_TIME = 5000;
```
***Instantiate the DHT Class***
```c++
DHT dht(DHTPIN, DHTTYPE);
```
***Setup***
Arduino's first primary function is *setup* which will run once before the primary code loop begins. This is the place where we tell the Serial and the DHT libraries to start running.
```c++
void setup () {
  // Being serial with standard baud rate
  Serial.begin(9600);
  // Begin the DHT class which will take temp/humidity readings
  dht.begin();
}
```
***Define JSON Print Function***
Since we're going to be buildling a server in NodeJS, an easy thing that we can do (since we're not working with many data points) is prepare the data that we're writing into a JSON format by hand. We're going to send an array of two arrays that will contain the keys and the values respectively.
```c++
void printJSON (float T, float H, float L) {
  // First add initial array of keys
  // Then add the array of values
  // Format in JSON by escaping double quotes
  Serial.print("[");
  Serial.print("[\"T\",\"H\",\"L\"],[");
  Serial.print(T);
  Serial.print(",");
  Serial.print(H);
  Serial.print(",");
  Serial.print(L);
  Serial.println("]]");
}
```
***Update***
The core function that the Arduino code will use in it's process is called loop, which is nice because that's exactly what it does. This function will be called over and over again as fast as the Arduino can manage.
```c
void loop () {
  // Read the Temperature
  // Pass True to get Farenheit, False (or nothing) to get Celsius
  float temp = dht.readTemperature(true);

  // Read the Humidity
  float humidity = dht.readHumidity();

  // Read the analog value from the LDR Pin for Brightness
  float brightness = analogRead(LDR_Pin);

  // Call the PrintJSON function that we made
  // Pass Temp and Humidity
  printJSON(temp, humidity, brightness);
  // Delay update for predefined time
  delay(DELAY_TIME);
}
```

Now you should be able to check and upload this to your arduino via the IDE. Then open up the serial monitor and you'll see this output stream in with a new line every 5 seconds.

![image2](http://i.imgur.com/nbYHdXo.png)

And that's all we need to do. We've set up a small script that monitors two sensors and formats the serial output into JSON.

License
----

MIT


**Free Software, Hell Yeah!**

[//]: # (These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax)
   [Arduino]: <https://www.arduino.cc/>
   [ArduinoIDE]: <https://www.arduino.cc/en/Main/Software>
