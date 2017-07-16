#include <DHT.h>

#define DHTPIN 7
#define DHTTYPE DHT11

// Define LDR Analog input pin A0
const int LDR_Pin = A0;
// Set a delay time to 5000
// This will be a 5 second pause between sensor readings
const int DELAY_TIME = 5000;

// Instantiate the DHT Class with Pin and DHT Type (DHT11)
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  // Being serial with standard baud rate
  Serial.begin(9600);
  // Begin the DHT class which will take temp/humidity readings
  dht.begin();
}

void printJSON(float T, float H, float L) {
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

void loop() {
  // Read the Temperature
  // Pass True to get Farenheit, False (or nothing) to get Celsius
  float temp = dht.readTemperature(true);
  // Read the Humidity
  float humidity = dht.readHumidity();
  float brightness = analogRead(LDR_Pin);
  // Call the printJSON function
  // Pass Temp, Humidity, and Brightness
  printJSON(temp, humidity, brightness);
  delay(DELAY_TIME);
}
