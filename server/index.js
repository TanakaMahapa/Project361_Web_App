const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const mqtt = require("mqtt");
const cors = require("cors");

// ====== CONFIG ======
const MQTT_BROKER = "mqtt://test.mosquitto.org:1883"; 
const MQTT_TOPIC_MOTION = "home/door/motion";
const MQTT_TOPIC_GAS = "home/door/gas";
const MQTT_TOPIC_CONTROL = "smartdoor/control"; // for controlling Arduino
const MQTT_TOPIC_VIBRATION = "home/bed/vibration";
const MQTT_TOPIC_LED = "home/door/led";

const PORT = 4000;

// ====== EXPRESS + SOCKET.IO SETUP ======
const app = express();
app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174", //  React frontend
    methods: ["GET", "POST"]
  }
});

// ====== MQTT CLIENT ======
const client = mqtt.connect(MQTT_BROKER);

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  client.subscribe([MQTT_TOPIC_MOTION, MQTT_TOPIC_GAS], (err) => {
    if (!err) console.log("Subscribed to motion + gas topics");
  });
});

// Forward MQTT → Socket.IO
client.on("message", (topic, message) => {
  const payload = message.toString();
  console.log(`MQTT: ${topic} -> ${payload}`);

  if (topic === MQTT_TOPIC_MOTION) {
    // Forward motion events
    io.emit("alert", {
      message: payload === "detected"
        ? "Motion detected!"
        : payload === "visitor"
        ? "Visitor at the door"
        : "Clear - No motion",
    });
  }

  if (topic === MQTT_TOPIC_GAS) {
    // Forward gas alerts
    io.emit("alert", {
      message: payload === "smoke"
        ? "Gas/Smoke detected!"
        : "Air quality normal",
    });
  }
});


// ====== SOCKET.IO EVENTS ======
io.on("connection", (socket) => {
  console.log("Web client connected:", socket.id);

  // Control Arduino: turn ON/OFF system
  socket.on("control-arduino", (data) => {
    console.log("Control Arduino:", data);
    client.publish(MQTT_TOPIC_CONTROL, data); // e.g., {power: "off"}
  });

  // Control vibration motor
  socket.on("control-vibration", (data) => {
    console.log("Control Vibration Motor:", data);
    client.publish(MQTT_TOPIC_VIBRATION, data); // e.g., {vibration: "off"}
  });

  socket.on("disconnect", () => {
    console.log("Web client disconnected");
  });
});

// ====== START SERVER ======
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
