// Import MQTT library
import mqtt from "mqtt";

// Connect to HiveMQ public broker
const client = mqtt.connect("mqtt://broker.hivemq.com:1883");

// When connected, subscribe & publish
client.on("connect", () => {
  console.log("✅ Connected to HiveMQ broker");

  // Subscribe to test topic
  client.subscribe("home/door/motion", (err) => {
    if (!err) {
      console.log("📩 Subscribed to home/door/motion");

      // Publish test message
      client.publish("home/door/motion", "detected");
      client.publish("home/door/motion", "clear");
    }
  });
});

// Handle incoming messages
client.on("message", (topic, message) => {
  console.log(`📨 ${topic}: ${message.toString()}`);
});
