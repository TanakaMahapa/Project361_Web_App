import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import SensorRecord from "./models/SensorRecord.js";
import { startMqttBridge } from "./mqttBridge.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/sensordb";
const PORT = Number(process.env.PORT || 5050);
const MQTT_URL = process.env.MQTT_URL || "wss://test.mosquitto.org:8081/mqtt";
const MQTT_TOPICS = (process.env.MQTT_TOPICS || "home/door/motion,home/bed/ack").split(",").map((s) => s.trim());

await mongoose.connect(MONGODB_URI);
console.log("[DB] Connected", MONGODB_URI);

// Seed one record with the provided values if empty
if ((await SensorRecord.countDocuments()) === 0) {
  const seed = new SensorRecord({
    ledAlertAt: new Date("2025-10-16T20:12:48Z"),
    device: "laptop",
    gasDetectedAt: new Date("2025-10-10T02:09:07Z"),
    motionDetectedAt: new Date("2025-10-02T16:04:32Z"),
    password: "T@na12ka",
    username: "Tanaka",
    vibrationAlertAt: new Date("2025-10-17T03:00:03Z"),
  });
  await seed.save();
  console.log("[DB] Seeded initial SensorRecord");
}

const app = express();
app.use(cors());
app.use(express.json());

// API: latest record
app.get("/api/record/latest", async (req, res) => {
  const doc = await SensorRecord.findOne().sort({ createdAt: -1 });
  res.json(doc ?? null);
});

// API: create/update record (optional for UI testing)
app.post("/api/record", async (req, res) => {
  const payload = req.body || {};
  const doc = await SensorRecord.create(payload);
  res.status(201).json(doc);
});

// Start MQTT bridge to react to motion topic -> update DB
const mqttClient = startMqttBridge({
  mqttUrl: MQTT_URL,
  topics: MQTT_TOPICS,
  onMotion: async (topic, payload) => {
    try {
      // Interpret known topics
      const updates = {};
      const now = new Date();
      if (topic.includes("home/door/motion")) {
        updates.motionDetectedAt = payload === "detected" ? now : undefined;
        updates.ledAlertAt = payload === "detected" ? now : undefined;
      }
      if (Object.keys(updates).length) {
        const doc = await SensorRecord.create({
          device: "laptop",
          username: "Tanaka",
          password: "T@na12ka",
          ...updates,
        });
        console.log("[DB] Saved record from MQTT", doc._id.toString());
      }
    } catch (err) {
      console.error("[DB] error persisting MQTT event", err);
    }
  },
});

app.listen(PORT, () => {
  console.log(`[API] Listening on http://localhost:${PORT}`);
});
