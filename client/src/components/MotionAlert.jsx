
import { Activity, X } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useSocket from "../hooks/useSocket";
import { useState, useEffect } from "react";

const MotionAlert = ({ onDismiss }) => {
  const { alerts } = useSocket();
  const [lastDetected, setLastDetected] = useState(null);

  // Filter for motion events only
  useEffect(() => {
    const motionEvents = alerts.filter((a) => a.type === "motion");
    if (motionEvents.length > 0) {
      const latest = motionEvents[motionEvents.length - 1];
      setLastDetected(latest.timestamp);
    }
  }, [alerts]);

  if (!lastDetected) return null; // no motion yet

  return (
    <Card className="bg-yellow-50 border border-yellow-200 shadow-sm">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Activity className="text-yellow-600 w-6 h-6" />
          <div>
            <p className="font-semibold text-yellow-700">Motion Detected</p>
            <p className="text-sm text-yellow-600">
              Last detected at {lastDetected}
            </p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onDismiss}>
          <X className="w-5 h-5 mr-1" /> Dismiss
        </Button>
      </CardContent>
    </Card>
  );
};

export default MotionAlert;

