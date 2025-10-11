import React from "react";
import useSocket from "../hooks/useSocket";
import { Card } from "@/components/ui/card";

const Notifications = () => {
  const { alerts } = useSocket();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Notifications</h1>

      {alerts.length === 0 ? (
        <p className="text-gray-500">No notifications yet.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {alerts.map((alert, idx) => (
            <Card key={idx} className="p-4">
              <p>{alert.message}</p>
              <small className="text-gray-400">{alert.timestamp}</small>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
