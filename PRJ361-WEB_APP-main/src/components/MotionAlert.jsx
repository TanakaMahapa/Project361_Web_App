import React from "react";
import { AlertTriangle, Activity } from "lucide-react";

const MotionAlert = ({ isActive }) => {
  return (
    <div
      role="alert"
      className={`rounded-lg p-4 border shadow-sm ${
        isActive
          ? "bg-red-50 border-red-500 text-red-700 animate-pulse"
          : "bg-card border-border text-muted-foreground"
      }`}
    >
      <div className="flex items-center gap-2">
        {isActive ? (
          <AlertTriangle className="w-6 h-6 text-red-600" />
        ) : (
          <Activity className="w-6 h-6 text-muted-foreground" />
        )}
        <h3 className="text-lg font-semibold text-card-foreground mb-1">
          {isActive ? "Motion Detected!" : "No Motion Detected"}
        </h3>
      </div>
      <p className="text-sm">
        {isActive
          ? "The PIR sensor has detected movement near the door."
          : "Monitoring is active. No movement detected recently."}
      </p>
    </div>
  );
};

export default MotionAlert;
