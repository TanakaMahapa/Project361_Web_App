import { useState } from "react";
import { Menu, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import MotionAlert from "@/components/MotionAlert";
import EmergencyAlert from "@/components/EmergencyAlert";
import MissedNotifications from "@/components/MissedNotifications";
import { useToast } from "@/hooks/use-toast";
import Dashboard from "@/components/Dashboard";




const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [motionActive, setMotionActive] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(true);

  const { success } = useToast();

  // Handle activating alarm
  const handleSetAlarm = () => {
    success("Motion detection alarm has been activated");
  };

  // Handle dismissing motion alert
  const handleMotionDismiss = () => {
    setMotionActive(false);
    success("Motion alert dismissed");
  };

  // Handle dismissing emergency alert
  const handleEmergencyDismiss = () => {
    setEmergencyActive(false);
    success("Emergency alert acknowledged and dismissed");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* ===== Sidebar ===== */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* ===== Main Content ===== */}
      <div className="flex-1 lg:ml-64">
        {/* ===== Header ===== */}
        <header className="bg-card border-b border-border p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden"
            >
              <Menu className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-card-foreground">Home</h1>
          </div>
        </header>

        {/* ===== Main Section ===== */}
        <main className="p-4 space-y-6 max-w-2xl mx-auto">
          {/* Real-time Motion Alert (via WebSocket) */}
          <Dashboard />
          {motionActive && <MotionAlert onDismiss={handleMotionDismiss} />}

          {/* Set Alarm Button */}
          <div className="flex justify-center">
            <Button
              variant="alarm"
              size="lg"
              onClick={handleSetAlarm}
              className="w-full max-w-sm h-14 text-lg"
            >
              <Clock className="w-5 h-5 mr-2" />
              SET AN ALARM
            </Button>
          </div>

          {/* Real-time Emergency Alert (if active) */}
          {emergencyActive && (
            <EmergencyAlert
              activeTime="7:45 AM"
              onDismiss={handleEmergencyDismiss}
            />
          )}

          {/* 🔔 Real-time Missed Notifications */}
          <MissedNotifications />
        </main>
      </div>
    </div>
  );
};

export default Index;

