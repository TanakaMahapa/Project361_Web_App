import { useEffect, useState } from "react";
import { Menu, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Sidebar from "@/components/Sidebar";
import MotionAlert from "@/components/MotionAlert";
import EmergencyAlert from "@/components/EmergencyAlert";
import MissedNotifications from "@/components/MissedNotifications";
import { useToast } from "@/hooks/use-toast";
import { fetchLatestRecord } from "@/api/client";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [latest, setLatest] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchLatestRecord();
        if (!cancelled) {
          setLatest(data);
          setEmergencyActive(Boolean(data?.motionDetectedAt));
        }
      } catch (e) {
        // ignore for now, toast optional
      }
    };
    load();
    const t = setInterval(load, 5000);
    return () => {
      cancelled = true;
      clearInterval(t);
    };
  }, []);

  // Mock data
  const missedNotifications = [
    {
      id: "1",
      type: "motion",
      message: "Motion detected at front door",
      time: "2 hours ago"
    },
    {
      id: "2", 
      type: "system",
      message: "System maintenance completed",
      time: "1 day ago"
    }
  ];

  const handleSetAlarm = () => {
    toast({
      title: "Alarm Set",
      description: "Motion detection alarm has been activated",
    });
  };

  const handleEmergencyDismiss = () => {
    setEmergencyActive(false);
    toast({
      title: "Emergency Alert Acknowledged",
      description: "Alert has been dismissed",
    });
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
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

        {/* Dashboard Content */}
        <main className="p-4 space-y-6 max-w-2xl mx-auto">
          {/* Motion Detection */}
          <MotionAlert isActive={!!emergencyActive} />
          
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

          {/* Emergency Alert */}
          {emergencyActive && (
            <EmergencyAlert 
              activeTime="7:45 AM" 
              onDismiss={handleEmergencyDismiss}
            />
          )}

          {/* Missed Notifications */}
          <MissedNotifications notifications={missedNotifications} />
        </main>
      </div>
    </div>
  );
};

export default Index;
