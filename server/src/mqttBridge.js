import mqtt from "mqtt";

export function startMqttBridge({ mqttUrl, topics, onMotion }) {
  const client = mqtt.connect(mqttUrl);

  client.on("connect", () => {
    console.log("[MQTT] Connected", mqttUrl);
    if (Array.isArray(topics) && topics.length) {
      client.subscribe(topics, { qos: 1 }, (err) => {
        if (err) console.error("[MQTT] subscribe error", err);
        else console.log("[MQTT] subscribed:", topics.join(", "));
      });
    }
  });

  client.on("message", (topic, payloadBuf) => {
    const payload = payloadBuf.toString();
    console.log("[MQTT] message", topic, payload);
    if (typeof onMotion === "function") onMotion(topic, payload);
  });

  return client;
}
