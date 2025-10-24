import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5001"; // backend port

export default function useSocket() {
  const [alerts, setAlerts] = useState([]);
  const [arduinoStatus, setArduinoStatus] = useState("disconnected");

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });

    socket.on("alertUpdate", (data) => {
      console.log("New alert received:", data);
      setAlerts((prev) => [...prev, data]);
    });

    // Listen for Arduino status
    socket.on("arduinoStatus", (status) => {
      console.log("Arduino status:", status);
      setArduinoStatus(status);

      // Dispatch event for Settings.jsx
      const event = new CustomEvent("arduino-status", { detail: status });
      window.dispatchEvent(event);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => socket.disconnect();
  }, []);

  return { alerts, arduinoStatus };
}



