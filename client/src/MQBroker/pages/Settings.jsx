import { useState, useEffect } from "react";
import { Menu, ArrowLeft, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import useSocket from "../hooks/useSocket"; // import your socket hook

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [missedAlerts, setMissedAlerts] = useState(true);
  const [arduinoConnected, setArduinoConnected] = useState(false); // new state
  const navigate = useNavigate();
  const { success } = useToast();
  const { socket } = useSocket(); // access socket instance


  // listen for connection/disconnection events
  useEffect(() => {
    if (!socket) return;

    const handleConnect = () => {
      setArduinoConnected(true);
      success("Arduino connected");
    };

    const handleDisconnect = () => {
      setArduinoConnected(false);
      success("Arduino disconnected");
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);

    // Clean up listeners on unmount
    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
    };
  }, [socket, success]);

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
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-card-foreground">
              Settings
            </h1>
          </div>
        </header>

        <main className="p-4 space-y-6 max-w-2xl mx-auto">      
          
          {/* Notifications */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Notification</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="missed-alerts">Missed Alerts</Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications for missed alerts
                  </p>
                </div>
                <Switch
                  id="missed-alerts"
                  checked={missedAlerts}
                  onCheckedChange={(checked) => {
                    setMissedAlerts(checked);
                    success(
                      checked
                        ? "Missed Alerts Enabled"
                        : "Missed Alerts Disabled"
                    );
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/*System Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span>Device:</span>
                <span>Smart Door Motion Sensor</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span>Version:</span>
                <span>v2.1.0</span>
              </div>
              <Separator />
              <div className="flex justify-between items-center">
                <span>Status:</span>
                <span
                  className={`flex items-center gap-2 font-medium ${
                    arduinoConnected ? "text-green-500" : "text-red-500"
                  }`}
                >
                  <Wifi className="w-4 h-4" />
                  {arduinoConnected ? "Connected" : "Disconnected"}
                </span>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;

