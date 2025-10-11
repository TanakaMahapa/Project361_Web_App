import { useState } from "react";
import { Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import Sidebar from "@/components/Sidebar";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vibrationStrength, setVibrationStrength] = useState("Mid");
  const [flashingDuration, setFlashingDuration] = useState("3s");
  const [missedAlerts, setMissedAlerts] = useState(true);
  const navigate = useNavigate();
  const { success } = useToast();

  const vibrationOptions = ["Low", "Mid", "High"];
  const durationOptions = ["1s", "3s", "5s"];

  const handleVibrationChange = (strength) => {
    setVibrationStrength(strength);
    success(`Vibration strength set to ${strength}`);
  };

  const handleDurationChange = (duration) => {
    setFlashingDuration(duration);
    success(`Flashing duration set to ${duration}`);
  };

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex-1 lg:ml-64">
        <header className="bg-card border-b border-border p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(true)} className="lg:hidden">
              <Menu className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => navigate("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-card-foreground">Setting</h1>
          </div>
        </header>

        <main className="p-4 space-y-6 max-w-2xl mx-auto">
          {/* Vibration */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Vibration</CardTitle>
              <CardDescription>Configure vibration strength for alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <Label className="mb-3 block">Strength</Label>
              <div className="flex gap-2">
                {vibrationOptions.map((option) => (
                  <Button
                    key={option}
                    variant={vibrationStrength === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleVibrationChange(option)}
                    className="flex-1"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* LED */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>LED</CardTitle>
              <CardDescription>Configure LED flash settings for visual alerts</CardDescription>
            </CardHeader>
            <CardContent>
              <Label className="mb-3 block">Flashing duration</Label>
              <div className="flex gap-2">
                {durationOptions.map((option) => (
                  <Button
                    key={option}
                    variant={flashingDuration === option ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleDurationChange(option)}
                    className="flex-1"
                  >
                    {option}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Notification</CardTitle>
              <CardDescription>Manage your notification preferences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="missed-alerts">Missed Alerts</Label>
                  <p className="text-sm text-muted-foreground">Show notifications for missed alerts</p>
                </div>
                <Switch
                  id="missed-alerts"
                  checked={missedAlerts}
                  onCheckedChange={(checked) => {
                    setMissedAlerts(checked);
                    success(checked ? "Missed Alerts Enabled" : "Missed Alerts Disabled");
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
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
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-green-500">Connected</span>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;
