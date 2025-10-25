import express from "express";
import http from "http";
import { Server } from "socket.io";
import mqtt from "mqtt";
import cors from "cors";
import 'dotenv/config';
import { connectDB } from "./mongodb.js";
import Alert from "./models/Alert.js";
import User from "./models/User.js";

// ====== CONFIG ======
const MQTT_BROKER = "mqtt://test.mosquitto.org:1883";
const MQTT_TOPIC_MOTION = "home/door/motion";
const MQTT_TOPIC_GAS = "home/door/gas";
const MQTT_TOPIC_CONTROL = "smartdoor/control";
const MQTT_TOPIC_VIBRATION = "home/bed/vibration";
const MQTT_TOPIC_LED = "home/door/led";
const MQTT_TOPIC_ARDUINO_STATUS = "home/arduino/status"; 

const PORT = process.env.PORT || 5001;

// ====== INITIALIZE ======
const app = express();
app.use(cors());
app.use(express.json());

// Connect to database first
connectDB();

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5174", methods: ["GET", "POST"] },
});

// ====== MQTT SETUP ======
const mqttClient = mqtt.connect(MQTT_BROKER, {
  clientId: "SmartDoorServer",
  clean: true,
  reconnectPeriod: 2000, // try every 2 seconds
});


mqttClient.on("connect", () => {
  console.log("MQTT connected to broker");

  // Subscribe to all topics, including Arduino status
  mqttClient.subscribe([
    MQTT_TOPIC_MOTION,
    MQTT_TOPIC_GAS,
    MQTT_TOPIC_VIBRATION,
    MQTT_TOPIC_LED,
    MQTT_TOPIC_ARDUINO_STATUS, 
  ]);

  // Publish a "server connected" message
  mqttClient.publish(MQTT_TOPIC_ARDUINO_STATUS, "connected", { qos: 1, retain: true });
});

mqttClient.on("close", () => {
  console.log("MQTT disconnected from broker");
  mqttClient.publish(MQTT_TOPIC_ARDUINO_STATUS, "disconnected", { qos: 1, retain: true });
});

mqttClient.on("message", async (topic, message) => {
  const payload = message.toString();
  console.log(`MQTT: ${topic} - ${payload}`);

  // Handle Arduino connection status
  if (topic === MQTT_TOPIC_ARDUINO_STATUS) {
    io.emit("arduinoStatus", payload); // send status to frontend
    console.log(`Arduino is ${payload}`);
    return;
  }

  try {
    let eventType = "";
    switch (topic) {
      case MQTT_TOPIC_MOTION:
        eventType = "motionDetected";
        break;
      case MQTT_TOPIC_GAS:
        eventType = "gasDetected";
        break;
      case MQTT_TOPIC_VIBRATION:
        eventType = "vibrationDetected";
        break;
      case MQTT_TOPIC_LED:
        eventType = "ledAlert";
        break;
    }

    if (eventType) {
      const alert = new Alert({ type: eventType, message: payload });
      await alert.save();
      io.emit("alertUpdate", { eventType, payload, time: new Date() });
      console.log(`Alert saved & sent to frontend`);
    }
  } catch (err) {
    console.error("Error saving alert:", err);
  }
});

// ====== SOCKET.IO EVENTS ======
io.on("connection", (socket) => {
  console.log("Client connected:", socket.id);

  const lastStatus = mqttClient.connected ? "connected" : "disconnected";
  socket.emit("arduinoStatus", lastStatus);

  socket.on("control-arduino", (data) => {
    console.log("Control Arduino:", data);
    mqttClient.publish(MQTT_TOPIC_CONTROL, data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

// ====== REST API ======
app.get("/api/alerts", async (req, res) => {
  const alerts = await Alert.find().sort({ timestamp: -1 });
  res.json(alerts);
});

// ====== START SERVER ======
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
