import { Bell, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import useSocket from "../hooks/useSocket";

const Notifications = ({ onClear }) => {
  const { alerts } = useSocket();

  // Show only meaningful alerts: motion detected, gas detected, or vibration off
  const missed = alerts.filter((alert) => {
    const type = alert.eventType?.toLowerCase();
    const payload = alert.payload?.toLowerCase();

    // Only show when motion, gas, or vibration triggered
    return (
      type === "motiondetected" ||
      (type === "gasdetected" && payload !== "clear" && payload !== "clean air") ||
      (type === "vibrationdetected" && payload === "off")
    );
  });

  return (
    <Card className="bg-card border-border shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" /> Missed Notifications
        </CardTitle>
      </CardHeader>

      <CardContent>
        {missed.length === 0 ? (
          <p className="text-sm text-muted-foreground">No missed notifications</p>
        ) : (
          <ul className="space-y-2">
            {missed.map((n, i) => (
              <li
                key={i}
                className="flex items-center justify-between border-b pb-2"
              >
                <div>
                  <p className="text-sm font-medium">
                    {n.payload || "Alert Triggered"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(n.time).toLocaleString()}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onClear && onClear(n.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
};

export default Notifications;

