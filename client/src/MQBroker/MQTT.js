import mqtt from "mqtt/dist/mqtt";  // important: browser version

// Broker over WebSocket (secure)
const brokerUrl = "wss://test.mosquitto.org:8081/mqtt";

// Topics
const TOPIC_MOTION = "home/door/motion";
const TOPIC_DOOR_LED = "home/door/led";
const TOPIC_BED_LED = "home/bed/led";
const TOPIC_VIBRATION = "home/bed/vibration";
const TOPIC_BED_ACK = "home/bed/ack";

// Connect
const client = mqtt.connect(brokerUrl);

client.on("connect", () => {
  console.log("✅ Connected to broker via WebSocket");

  // Subscribe
  client.subscribe([TOPIC_MOTION, TOPIC_BED_ACK], { qos: 2 }, (err) => {
    if (err) console.error("❌ Subscribe error:", err);
    else console.log("📡 Subscribed to:", TOPIC_MOTION, "and", TOPIC_BED_ACK);
  });
});

// Handle messages
client.on("message", (topic, message) => {
  const payload = message.toString();
  console.log("📩 Message received:", topic, payload);

  if (topic === TOPIC_MOTION) {
    handleMotion(payload);
  } else if (topic === TOPIC_BED_ACK) {
    console.log("🛏 Bed ACK:", payload);
  }
});

// Motion logic
function handleMotion(payload) {
  let door_led = "OFF";
  let bed_led = "OFF";
  let vibration = "STOP";
  let status = "✅ CLEAR - No motion";

  if (payload === "detected") {
    door_led = "RED";
    bed_led = "RED";
    vibration = "START";
    status = "🚨 EMERGENCY - Motion Detected";
  } else if (payload === "visitor") {
    door_led = "YELLOW";
    bed_led = "YELLOW";
    vibration = "STOP";
    status = "🟡 VISITOR - Someone at door";
  }

  // Publish control outputs
  client.publish(TOPIC_DOOR_LED, door_led, { qos: 1, retain: true });
  client.publish(TOPIC_BED_LED, bed_led, { qos: 1, retain: true });
  client.publish(TOPIC_VIBRATION, vibration, { qos: 1 });

  console.log("------ SYSTEM STATUS ------");
  console.log("Status:", status);
  console.log("Door LED:", door_led);
  console.log("Bed LED:", bed_led);
  console.log("Vibration:", vibration);
  console.log("---------------------------");
}

export default client;
