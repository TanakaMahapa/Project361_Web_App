import { useEffect, useState } from "react";
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000";

export default function useSocket() {
  const [socket, setSocket] = useState(null);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    s.on("alert", (data) => {
      console.log("New Alert:", data);
      setAlerts((prev) => [
        { ...data, timestamp: new Date().toLocaleTimeString() },
        ...prev,
      ]);
    });

    return () => s.disconnect();
  }, []);

  return { socket, alerts };
}

