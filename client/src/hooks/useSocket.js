import { useEffect, useState } from "react";
import io from "socket.io-client";

const SOCKET_URL = "http://localhost:5001"; // must match your backend port

export default function useSocket() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const socket = io(SOCKET_URL, { transports: ["websocket"] });

    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
    });

    // When backend emits new alert
    socket.on("alertUpdate", (data) => {
      console.log("New alert received:", data);
      setAlerts((prev) => [...prev, data]);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from server");
    });

    return () => socket.disconnect();
  }, []);

  return { alerts };
}


