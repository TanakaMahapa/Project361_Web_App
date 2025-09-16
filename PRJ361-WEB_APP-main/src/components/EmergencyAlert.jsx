import { AlertTriangle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const EmergencyAlert = ({ activeTime, onDismiss }) => {
  return (
    <div className="bg-gradient-emergency rounded-lg p-6 shadow-xl border border-app-emergency/50 relative overflow-hidden">
      {/* Animated background pulse */}
      <div className="absolute inset-0 bg-app-emergency/20 animate-pulse" />
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-white" />
          </div>
          
          <div className="flex-1">
            <h3 className="text-lg font-bold text-white mb-1">
              Emergency Alert
            </h3>
            <div className="flex items-center gap-2 text-sm text-white/80">
              <Clock className="w-4 h-4" />
              <span>Active {activeTime}</span>
            </div>
          </div>

          <div className="w-3 h-3 bg-white rounded-full animate-ping" />
        </div>

        {onDismiss && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={onDismiss}
            className="bg-white/10 border-white/30 text-white hover:bg-white/20"
          >
            Acknowledge
          </Button>
        )}
      </div>
    </div>
  );
};

