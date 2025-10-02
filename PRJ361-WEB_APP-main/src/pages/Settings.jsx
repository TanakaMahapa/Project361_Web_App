import { useEffect, useState } from "react";
import { Menu, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Sidebar } from "@/components/Sidebar";
import { fetchLatestRecord } from "@/api/client";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

const Settings = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vibrationStrength, setVibrationStrength] = useState("Mid");
  const [flashingDuration, setFlashingDuration] = useState("3s");
  const [missedAlerts, setMissedAlerts] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const vibrationOptions = ["Low", "Mid", "High"];
  const durationOptions = ["1s", "3s", "5s"];

  const handleVibrationChange = (strength) => {
    setVibrationStrength(strength);
    toast({
      title: "Vibration Updated",
      description: `Vibration strength set to ${strength}`,
    });
  };

  const handleDurationChange = (duration) => {
    setFlashingDuration(duration);
    toast({
      title: "LED Duration Updated",
      description: `Flashing duration set to ${duration}`,
    });
  };

  const [latest, setLatest] = useState(null);
  useEffect(() => {
    fetchLatestRecord().then(setLatest).catch(() => {});
  }, []);

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
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-2xl font-bold text-card-foreground">Setting</h1>
          </div>
        </header>

        {/* Settings Content */}
        <main className="p-4 space-y-6 max-w-2xl mx-auto">
          {/* Vibration Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Vibration</CardTitle>
              <CardDescription>
                Configure vibration strength for alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium text-card-foreground mb-3 block">
                  Strength
                </Label>
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
              </div>
            </CardContent>
          </Card>

          {/* LED Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">LED</CardTitle>
              <CardDescription>
                Configure LED flash settings for visual alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div>
                <Label className="text-sm font-medium text-card-foreground mb-3 block">
                  Flashing duration
                </Label>
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
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">Notification</CardTitle>
              <CardDescription>
                Manage your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="missed-alerts" className="text-sm font-medium text-card-foreground">
                    Missed Alerts
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    Show notifications for missed alerts
                  </p>
                </div>
                <Switch
                  id="missed-alerts"
                  checked={missedAlerts}
                  onCheckedChange={(checked) => {
                    setMissedAlerts(checked);
                    toast({
                      title: checked ? "Missed Alerts Enabled" : "Missed Alerts Disabled",
                      description: checked 
                        ? "You will receive notifications for missed alerts" 
                        : "Missed alert notifications have been disabled",
                    });
                  }}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Info */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-card-foreground">System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Device:</span>
                <span className="text-card-foreground">{latest?.device ?? '—'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">User:</span>
                <span className="text-card-foreground">{latest?.username ?? '—'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Motion detected:</span>
                <span className="text-card-foreground">{latest?.motionDetectedAt ? new Date(latest.motionDetectedAt).toLocaleString() : '—'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">LED (alert):</span>
                <span className="text-card-foreground">{latest?.ledAlertAt ? new Date(latest.ledAlertAt).toLocaleString() : '—'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gas detected:</span>
                <span className="text-card-foreground">{latest?.gasDetectedAt ? new Date(latest.gasDetectedAt).toLocaleString() : '—'}</span>
              </div>
              <Separator />
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vibration (alert):</span>
                <span className="text-card-foreground">{latest?.vibrationAlertAt ? new Date(latest.vibrationAlertAt).toLocaleString() : '—'}</span>
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default Settings;
