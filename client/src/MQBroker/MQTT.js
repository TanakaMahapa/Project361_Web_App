import mqtt from "mqtt/dist/mqtt";
import { getToken } from "firebase/messaging";
import { messaging } from "../firebase"; 

// MQTT Broker over WebSocket
const brokerUrl = "wss://test.mosquitto.org:8081/mqtt";

// MQTT Topics
const TOPIC_MOTION = "home/door/motion";
const TOPIC_DOOR_LED = "home/door/led";
const TOPIC_BED_LED = "home/bed/led";
const TOPIC_VIBRATION = "home/bed/vibration";
const TOPIC_BED_ACK = "home/bed/ack";
const TOPIC_ARDUINO_STATUS = "home/arduino/status";

// Connect to broker
const client = mqtt.connect(brokerUrl);

client.on("connect", () => {
  console.log("Connected to MQTT broker");

  // Subscribe to topics
  client.subscribe([TOPIC_MOTION, TOPIC_BED_ACK,TOPIC_ARDUINO_STATUS], { qos: 2 }, (err) => {
    if (err) console.error("Subscription error:", err);
    else console.log("Subscribed to:", TOPIC_MOTION, "and", TOPIC_BED_ACK, "and", TOPIC_ARDUINO_STATUS);
  });
});


let lastPing = Date.now();

client.on("message", (topic, message) => {
  const payload = message.toString();
  lastPing = Date.now();
  if (topic === TOPIC_ARDUINO_STATUS) {
    window.dispatchEvent(new CustomEvent("arduino-status", { detail: payload }));
  }
});

// Mark offline if no activity for 30 seconds
setInterval(() => {
  if (Date.now() - lastPing > 30000) {
    window.dispatchEvent(new CustomEvent("arduino-status", { detail: "disconnected" }));
  }
}, 5000);


// Handle incoming messages
client.on("message", async (topic, message) => {
  const payload = message.toString();
  console.log("MQTT Message:", topic, payload);

  if (topic === TOPIC_MOTION) {
    handleMotion(payload);
  } else if (topic === TOPIC_ARDUINO_STATUS) {
    window.dispatchEvent(
      new CustomEvent("arduino-status", { detail: payload })
    );
  } else if (topic === TOPIC_BED_ACK) {
    console.log("Bed Acknowledged:", payload);
  }
});

// Motion event handler
async function handleMotion(payload) {
  let door_led = "OFF";
  let bed_led = "OFF";
  let vibration = "STOP";
  let status = "CLEAR - No motion";

  if (payload === "detected") {
    door_led = "RED";
    bed_led = "RED";
    vibration = "START";
    status = "EMERGENCY - Motion Detected";
    sendBrowserNotification("Motion Detected!", "Movement was detected at your door!");
    await sendPushNotification("Motion Detected!", "Movement was detected at your door!");
  } else if (payload === "visitor") {
    door_led = "YELLOW";
    bed_led = "YELLOW";
    vibration = "STOP";
    status = "VISITOR - Someone is at the door";
    sendBrowserNotification("Visitor Alert", "Someone is at your door!");
    await sendPushNotification("Visitor Alert", "Someone is at your door!");
  } else {
    status = "CLEAR - No Motion";
    sendBrowserNotification("Area Clear", "The area is clear again.");
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

// Local Browser Notifications
async function sendBrowserNotification(title, body) {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      new Notification(title, {
        body,
        icon: "/alert-icon.png", // Optional icon in /public folder
      });
    } else {
      console.log("Notification permission not granted.");
    }
  } catch (err) {
    console.error("Error showing browser notification:", err);
  }
}

// Firebase Push Notifications (optional fallback)
async function sendPushNotification(title, body) {
  try {
    const token = await getToken(messaging, {
      vapidKey: "BD4aa6pDKIdmKtUwtwJvmUSmgt42B5s_MsdjtJKHxG9ALymDi5-A8ikSo40eoNFBuLER6t5IaSU0uc6Km6Rpfbg", 
    });

    if (!token) {
      console.warn("No FCM token found for this device.");
      return;
    }

    // Normally you'd send this token to your backend to trigger a push
    console.log("Firebase Push Token:", token);
    console.log(`Would send push: ${title} — ${body}`);
  } catch (error) {
    console.error("Error with FCM:", error);
  }
}

export default client;


