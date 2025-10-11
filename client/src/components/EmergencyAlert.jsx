import { AlertCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const EmergencyAlert = ({ activeTime, onDismiss }) => {
  return (
    <Card className="bg-red-100 border border-red-300 shadow-md">
      <CardContent className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-600 w-6 h-6" />
          <div>
            <p className="font-semibold text-red-700">Emergency Alert</p>
            <p className="text-sm text-red-600">Active since {activeTime}</p>
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          <X className="w-5 h-5" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmergencyAlert;

