import express from "express";
import http from "http";
import { Server } from "socket.io";
import mqtt from "mqtt";
import cors from "cors";
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
const MQTT_TOPIC_VIBRATION_SETTINGS = "home/settings/vibration";
const MQTT_TOPIC_LED_SETTINGS = "home/settings/led";

const PORT = process.env.PORT || 5001;


// ====== INITIALIZE ======
const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5174", methods: ["GET", "POST"] }
});

// ====== CONNECT DATABASE ======
connectDB();

// ====== MQTT SETUP ======
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on("connect", () => {
  console.log("MQTT connected");
  mqttClient.subscribe([
    MQTT_TOPIC_MOTION,
    MQTT_TOPIC_GAS,
    MQTT_TOPIC_VIBRATION,
    MQTT_TOPIC_LED
  ]);
});

mqttClient.on("message", async (topic, message) => {
  const payload = message.toString();
  console.log(`MQTT: ${topic} - ${payload}`);

  try {
    let eventType = "";
    switch (topic) {
      case MQTT_TOPIC_MOTION:
        eventType = "motionDetected"; break;
      case MQTT_TOPIC_GAS:
        eventType = "gasDetected"; break;
      case MQTT_TOPIC_VIBRATION:
        eventType = "vibrationDetected"; break;
      case MQTT_TOPIC_LED:
        eventType = "ledAlert"; break;
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

  // Existing control
  socket.on("control-arduino", (data) => {
    console.log("Control Arduino:", data);
    mqttClient.publish(MQTT_TOPIC_CONTROL, data);
  });

  //Vibration Intensity Change
  socket.on("updateVibration", (strength) => {
    console.log("Vibration strength updated:", strength);
    const payload = JSON.stringify({ strength });
    mqttClient.publish(MQTT_TOPIC_VIBRATION_SETTINGS, payload);
  });

  // LED Duration Change
  socket.on("updateLedDuration", (duration) => {
    console.log("LED flash duration updated:", duration);
    const payload = JSON.stringify({ duration });
    mqttClient.publish(MQTT_TOPIC_LED_SETTINGS, payload);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});


// ====== REST API ======
app.get("/api/alerts", async (req, res) => {
  const alerts = await Alert.find().sort({ timestamp: -1 });
  res.json(alerts);
});

// ====== START SERVER ======
server.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
