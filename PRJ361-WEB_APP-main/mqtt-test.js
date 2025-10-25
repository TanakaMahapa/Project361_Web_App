import mqtt from "mqtt";  // Node.js version

// ========================================
// REAL IOT INTEGRATION POINTS
// ========================================

// 1. BROKER CONFIGURATION - Change this for real IoT setup
// Current: Public test broker
const brokerUrl = "mqtt://test.mosquitto.org:1883";

// For real IoT devices, use your own broker:
// const brokerUrl = "mqtt://192.168.1.100:1883";  // Local broker
// const brokerUrl = "mqtts://your-broker.com:8883";  // Secure broker
// const brokerUrl = "mqtt://username:password@your-broker.com:1883";  // With auth

// 2. AUTHENTICATION - Add for production
// const options = {
//   username: "your_username",
//   password: "your_password",
//   clientId: "smart_door_controller"
// };

// 3. MQTT TOPICS - These match your IoT device topics
// Your motion sensor publishes to:
const TOPIC_MOTION = "home/door/motion";        // PIR sensor → "detected", "visitor", "clear"

// Your LED controllers subscribe to:
const TOPIC_DOOR_LED = "home/door/led";         // Door LED strip control
const TOPIC_BED_LED = "home/bed/led";           // Bed LED strip control

// Your vibration motor subscribes to:
const TOPIC_VIBRATION = "home/bed/vibration";   // Bed vibration motor control

// Your bed Arduino publishes to:
const TOPIC_BED_ACK = "home/bed/ack";           // Bed device status/acknowledgment

// Your gas sensor publishes to:
const TOPIC_GAS = "home/door/gas";              // Gas sensor readings

// Your PR (Pressure) sensor publishes to:
const TOPIC_PRESSURE = "home/door/pressure";    // Pressure sensor readings

console.log("Starting MQTT Test...");
console.log("Connecting to broker:", brokerUrl);

// 4. MQTT CONNECTION - Add options for real IoT
// Current: Basic connection
const client = mqtt.connect(brokerUrl);

// For real IoT with authentication:
// const client = mqtt.connect(brokerUrl, options);

client.on("connect", () => {
  console.log("Connected to broker via MQTT");

  // Subscribe
  client.subscribe([TOPIC_MOTION, TOPIC_BED_ACK, TOPIC_GAS, TOPIC_PRESSURE], { qos: 2 }, (err) => {
    if (err) console.error("Subscribe error:", err);
    else console.log("Subscribed to:", TOPIC_MOTION, ",", TOPIC_BED_ACK, ",", TOPIC_GAS, "and", TOPIC_PRESSURE);
  });
});

// 5. MESSAGE HANDLING - This receives real IoT sensor data
client.on("message", (topic, message) => {
  const payload = message.toString();
  console.log("Message received:", topic, payload);

  // REAL IOT INTEGRATION: Your motion sensor sends these messages
  if (topic === TOPIC_MOTION) {
    // PIR sensor detected motion → process and control LEDs/vibration
    handleMotion(payload);
  } 
  // REAL IOT INTEGRATION: Your bed Arduino sends status updates
  else if (topic === TOPIC_BED_ACK) {
    console.log("🛏 Bed ACK:", payload);
    // Handle bed device status (e.g., "LED_ON", "VIBRATION_ACTIVE", "ERROR")
  }
  // REAL IOT INTEGRATION: Your gas sensor sends readings
  else if (topic === TOPIC_GAS) {
    console.log("Gas Reading:", payload);
    // Handle gas sensor data (e.g., "NORMAL", "WARNING", "DANGER", or numeric values)
    handleGasReading(payload);
  }
  // REAL IOT INTEGRATION: Your pressure sensor sends readings
  else if (topic === TOPIC_PRESSURE) {
    console.log("Pressure Reading:", payload);
    // Handle pressure sensor data (e.g., "NORMAL", "HIGH", "LOW", or numeric values)
    handlePressureReading(payload);
  }
});

// 6. MOTION PROCESSING - This controls your real IoT devices
function handleMotion(payload) {
  let door_led = "OFF";
  let bed_led = "OFF";
  let vibration = "STOP";
  let status = "CLEAR - No motion";

  // REAL IOT INTEGRATION: Process sensor data from your PIR sensor
  if (payload === "detected") {
    // Emergency motion detected → RED LEDs + vibration
    door_led = "RED";
    bed_led = "RED";
    vibration = "START";
    status = "EMERGENCY - Motion Detected";
  } else if (payload === "visitor") {
    // Visitor detected → YELLOW LEDs, no vibration
    door_led = "YELLOW";
    bed_led = "YELLOW";
    vibration = "STOP";
    status = "VISITOR - Someone at door";
  }

  // REAL IOT INTEGRATION: Send commands to your LED strips and vibration motor
  // These messages will be received by your Arduino/ESP32 devices
  client.publish(TOPIC_DOOR_LED, door_led, { qos: 1, retain: true });    // → Door LED strip
  client.publish(TOPIC_BED_LED, bed_led, { qos: 1, retain: true });      // → Bed LED strip  
  client.publish(TOPIC_VIBRATION, vibration, { qos: 1 });                // → Bed vibration motor

  console.log("------ SYSTEM STATUS ------");
  console.log("Status:", status);
  console.log("Door LED:", door_led);
  console.log("Bed LED:", bed_led);
  console.log("Vibration:", vibration);
  console.log("---------------------------");
}

// 7. GAS SENSOR PROCESSING - Handle gas sensor readings
function handleGasReading(payload) {
  let gas_status = "NORMAL";
  let door_led = "OFF";
  let bed_led = "OFF";
  let vibration = "STOP";

  // REAL IOT INTEGRATION: Process gas sensor readings
  if (payload === "WARNING" || payload === "HIGH") {
    gas_status = "GAS WARNING";
    door_led = "YELLOW";
    bed_led = "YELLOW";
    vibration = "STOP";
  } else if (payload === "DANGER" || payload === "CRITICAL") {
    gas_status = "GAS DANGER";
    door_led = "RED";
    bed_led = "RED";
    vibration = "START";
  } else if (payload === "NORMAL" || payload === "LOW") {
    gas_status = "GAS NORMAL";
    door_led = "OFF";
    bed_led = "OFF";
    vibration = "STOP";
  }

  // REAL IOT INTEGRATION: Send commands based on gas readings
  client.publish(TOPIC_DOOR_LED, door_led, { qos: 1, retain: true });
  client.publish(TOPIC_BED_LED, bed_led, { qos: 1, retain: true });
  client.publish(TOPIC_VIBRATION, vibration, { qos: 1 });

  console.log("------ GAS SENSOR STATUS ------");
  console.log("Gas Status:", gas_status);
  console.log("Door LED:", door_led);
  console.log("Bed LED:", bed_led);
  console.log("Vibration:", vibration);
  console.log("-------------------------------");
}

// 8. PRESSURE SENSOR PROCESSING - Handle pressure sensor readings
function handlePressureReading(payload) {
  let pressure_status = "NORMAL";
  let door_led = "OFF";
  let bed_led = "OFF";
  let vibration = "STOP";

  // REAL IOT INTEGRATION: Process pressure sensor readings
  if (payload === "HIGH" || payload === "OVERLOAD") {
    pressure_status = "PRESSURE HIGH";
    door_led = "YELLOW";
    bed_led = "YELLOW";
    vibration = "STOP";
  } else if (payload === "CRITICAL" || payload === "DANGER") {
    pressure_status = "PRESSURE CRITICAL";
    door_led = "RED";
    bed_led = "RED";
    vibration = "START";
  } else if (payload === "NORMAL" || payload === "LOW") {
    pressure_status = "PRESSURE NORMAL";
    door_led = "OFF";
    bed_led = "OFF";
    vibration = "STOP";
  }

  // REAL IOT INTEGRATION: Send commands based on pressure readings
  client.publish(TOPIC_DOOR_LED, door_led, { qos: 1, retain: true });
  client.publish(TOPIC_BED_LED, bed_led, { qos: 1, retain: true });
  client.publish(TOPIC_VIBRATION, vibration, { qos: 1 });

  console.log("------ PRESSURE SENSOR STATUS ------");
  console.log("Pressure Status:", pressure_status);
  console.log("Door LED:", door_led);
  console.log("Bed LED:", bed_led);
  console.log("Vibration:", vibration);
  console.log("-----------------------------------");
}

// Handle connection errors
client.on("error", (err) => {
  console.error("MQTT Error:", err);
});

client.on("offline", () => {
  console.log("Client offline");
});

client.on("reconnect", () => {
  console.log("Reconnecting...");
});

// 7. TEST FUNCTION - Remove this for real IoT deployment
// This simulates your PIR sensor for testing purposes
function testMotionDetection() {
  console.log("\n Testing motion detection...");
  
  // REAL IOT INTEGRATION: Remove this function in production
  // Your PIR sensor will automatically publish these messages:
  
  // Simulate different motion scenarios
  setTimeout(() => {
    console.log("Publishing 'detected' motion...");
    client.publish(TOPIC_MOTION, "detected", { qos: 1 });
  }, 2000);
  
  setTimeout(() => {
    console.log("Publishing 'visitor' motion...");
    client.publish(TOPIC_MOTION, "visitor", { qos: 1 });
  }, 5000);
  
  setTimeout(() => {
    console.log("Publishing 'clear' motion...");
    client.publish(TOPIC_MOTION, "clear", { qos: 1 });
  }, 8000);

  // Test gas sensor scenarios
  setTimeout(() => {
    console.log("Publishing 'NORMAL' gas reading...");
    client.publish(TOPIC_GAS, "NORMAL", { qos: 1 });
  }, 10000);
  
  setTimeout(() => {
    console.log("Publishing 'WARNING' gas reading...");
    client.publish(TOPIC_GAS, "WARNING", { qos: 1 });
  }, 12000);
  
  setTimeout(() => {
    console.log("Publishing 'DANGER' gas reading...");
    client.publish(TOPIC_GAS, "DANGER", { qos: 1 });
  }, 14000);

  // Test pressure sensor scenarios
  setTimeout(() => {
    console.log("Publishing 'NORMAL' pressure reading...");
    client.publish(TOPIC_PRESSURE, "NORMAL", { qos: 1 });
  }, 16000);
  
  setTimeout(() => {
    console.log("Publishing 'HIGH' pressure reading...");
    client.publish(TOPIC_PRESSURE, "HIGH", { qos: 1 });
  }, 18000);
  
  setTimeout(() => {
    console.log("Publishing 'CRITICAL' pressure reading...");
    client.publish(TOPIC_PRESSURE, "CRITICAL", { qos: 1 });
  }, 20000);
}

// 8. STARTUP - Modify for real IoT deployment
// Start test after connection
client.on("connect", () => {
  // REAL IOT INTEGRATION: Remove this line in production
  // Your PIR sensor will automatically start sending data
  setTimeout(testMotionDetection, 1000);
});

// ========================================
// REAL IOT DEVICE INTEGRATION SUMMARY
// ========================================
// 
// 1. PIR MOTION SENSOR (Arduino/ESP32):
//    - Publishes to: home/door/motion
//    - Messages: "detected", "visitor", "clear"
//    - Code: client.publish("home/door/motion", "detected");
//
// 2. DOOR LED STRIP (Arduino/ESP32):
//    - Subscribes to: home/door/led
//    - Commands: "RED", "YELLOW", "OFF"
//    - Code: client.subscribe("home/door/led");
//
// 3. BED LED STRIP (Arduino/ESP32):
//    - Subscribes to: home/bed/led  
//    - Commands: "RED", "YELLOW", "OFF"
//    - Code: client.subscribe("home/bed/led");
//
// 4. BED VIBRATION MOTOR (Arduino/ESP32):
//    - Subscribes to: home/bed/vibration
//    - Commands: "START", "STOP"
//    - Code: client.subscribe("home/bed/vibration");
//
// 5. BED ARDUINO STATUS (Arduino/ESP32):
//    - Publishes to: home/bed/ack
//    - Messages: "LED_ON", "VIBRATION_ACTIVE", "ERROR"
//    - Code: client.publish("home/bed/ack", "LED_ON");
//
// 6. GAS SENSOR (Arduino/ESP32):
//    - Publishes to: home/door/gas
//    - Messages: "NORMAL", "WARNING", "DANGER", "HIGH", "LOW", "CRITICAL"
//    - Code: client.publish("home/door/gas", "WARNING");
//
// 7. PRESSURE SENSOR (Arduino/ESP32):
//    - Publishes to: home/door/pressure
//    - Messages: "NORMAL", "HIGH", "LOW", "OVERLOAD", "CRITICAL", "DANGER"
//    - Code: client.publish("home/door/pressure", "HIGH");

// Keep the process running
console.log("MQTT test running... Press Ctrl+C to stop");
