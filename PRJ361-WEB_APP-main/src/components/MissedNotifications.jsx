import React from "react";
import { Bell, AlertCircle } from "lucide-react";

const MissedNotifications = ({ notifications }) => {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="bg-card rounded-lg p-4 border border-border text-center text-muted-foreground shadow-sm">
        <Bell className="w-6 h-6 mx-auto mb-2" />
        <p>No missed notifications</p>
      </div>
    );
  }

  const getNotificationStyle = (type) => {
    switch (type) {
      case "emergency":
        return "border-red-500 bg-red-50 text-red-700";
      case "motion":
        return "border-blue-500 bg-blue-50 text-blue-700";
      default:
        return "border-gray-300 bg-gray-50 text-gray-700";
    }
  };

  return (
    <div className="space-y-3">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          role="alert"
          aria-live="polite"
          className={`
            bg-card rounded-lg p-4 border-l-4 border border-border shadow-sm
            ${getNotificationStyle(notification.type)}
          `}
        >
          <div className="flex items-center gap-2">
            {notification.type === "emergency" ? (
              <AlertCircle className="w-5 h-5" />
            ) : (
              <Bell className="w-5 h-5" />
            )}
            <p className="text-sm">{notification.message}</p>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {notification.timestamp}
          </p>
        </div>
      ))}
    </div>
  );
};

export default MissedNotifications;
