import { useEffect, useState } from "react";
<<<<<<< Updated upstream:client/src/hooks/useSocket.js
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


=======
import { io } from "socket.io-client";

const SOCKET_URL = "http://localhost:4000"; // backend server

export default function useSocket() {
  const [socket, setSocket] = useState(null);
  const [motionAlert, setMotionAlert] = useState(null);
  const [gasAlert, setGasAlert] = useState(null);

  useEffect(() => {
    const s = io(SOCKET_URL);
    setSocket(s);

    s.on("motion-alert", (data) => {
      console.log("🚨 Motion Alert:", data);
      setMotionAlert(data.motion);
    });

    s.on("gas-alert", (data) => {
      console.log("🔥 Gas Alert:", data);
      setGasAlert(data.gas);
    });

    return () => {
      s.disconnect();
    };
  }, []);

  // Functions to send commands to backend → Arduino
  const controlArduino = (state) => {
    socket?.emit("control-arduino", JSON.stringify({ power: state }));
  };

  const controlVibration = (state) => {
    socket?.emit("control-vibration", JSON.stringify({ vibration: state }));
  };

  return { motionAlert, gasAlert, controlArduino, controlVibration };
}
>>>>>>> Stashed changes:PRJ361-WEB_APP-main/src/hooks/useSocket.js
