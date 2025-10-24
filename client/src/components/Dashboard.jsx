import { useState, useEffect } from "react";
import { Wind, Activity, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import useSocket from "../hooks/useSocket";

const Dashboard = () => {
  const { alerts } = useSocket();
  const [airStatus, setAirStatus] = useState("Clean");
  const [motionDetected, setMotionDetected] = useState(false);
  const [timestamp, setTimestamp] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setTimestamp(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Handle incoming alerts from backend (via socket)
  useEffect(() => {
    if (!alerts || alerts.length === 0) return;
  
    const latest = alerts[alerts.length - 1];
  
    switch (latest.eventType) {
      case "motionDetected":
        setMotionDetected(true);
        break;
  
      case "motionCleared":
        setMotionDetected(false);
        break;
  
      case "gasDetected":
        setAirStatus(latest.payload);
        break;
  
      default:
        console.log("Unknown event type:", latest.eventType);
    }
  }, [alerts]);
  
  return (
    <Card className="bg-card border border-border shadow-md rounded-xl">
      <CardContent className="p-6 space-y-4">
        <h2 className="text-xl font-semibold text-card-foreground">
          Smart Door Dashboard
        </h2>

        {/* Air Quality */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Wind className="text-blue-500 w-5 h-5" />
            <span className="font-medium">Air Quality:</span>
          </div>
          <span
            className={`text-sm px-2 py-1 rounded ${
              airStatus === "Clean"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {airStatus}
          </span>
        </div>

        {/* Motion Status */}
        <div className="flex items-center justify-between border-b border-border pb-3">
          <div className="flex items-center gap-2">
          <Activity
  className={`w-5 h-5 ${
    motionDetected ? "text-red-500" : "text-gray-400"
  }`}
/>
            <span className="font-medium">Motion Status:</span>
          </div>
          <span className="text-sm px-2 py-1 rounded bg-red-100 text-red-700">
  {motionDetected ? "Motion Detected" : "No Motion Detected"}
</span>
        </div>

        {/* Timestamp */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="text-gray-500 w-5 h-5" />
            <span className="font-medium">Last Updated:</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {timestamp.toLocaleTimeString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default Dashboard;


