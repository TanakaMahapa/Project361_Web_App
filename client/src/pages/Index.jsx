import { useState } from "react";
import { Menu, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import MotionAlert from "@/components/MotionAlert";
import EmergencyAlert from "@/components/EmergencyAlert";
import MissedNotifications from "@/components/MissedNotifications";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Alerts state
  const [motionActive, setMotionActive] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(true);

  // Missed notifications state
  const [missedNotifications, setMissedNotifications] = useState([
    { id: "1", type: "motion", message: "Motion detected at front door", time: "2 hours ago" },
    { id: "2", type: "system", message: "System maintenance completed", time: "1 day ago" }
  ]);

  const { success } = useToast();

  const handleSetAlarm = () => {
    success("Motion detection alarm has been activated");
  };

  const handleMotionDismiss = () => {
    setMotionActive(false);
    success("Motion alert dismissed");
  };

  const handleEmergencyDismiss = () => {
    setEmergencyActive(false);
    success("Emergency alert acknowledged and dismissed");
  };

  const handleClearNotification = (id) => {
    setMissedNotifications((prev) => prev.filter((n) => n.id !== id));
    success("Notification cleared");
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64">
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

        <main className="p-4 space-y-6 max-w-2xl mx-auto">
          {motionActive && (
            <MotionAlert lastDetected="10:00AM" onDismiss={handleMotionDismiss} />
          )}

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

          {emergencyActive && (
            <EmergencyAlert activeTime="7:45 AM" onDismiss={handleEmergencyDismiss} />
          )}

          <MissedNotifications 
            notifications={missedNotifications} 
            onClear={handleClearNotification} 
          />
        </main>
      </div>
    </div>
  );
};

export default Index;
