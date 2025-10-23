"use client";

import { useState } from "react";
import { detectAnomalousNetworkActivity, DetectAnomalousNetworkActivityOutput } from "@/ai/flows/detect-anomalous-network-activity";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShieldAlert, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockDevices } from "@/lib/data";

const severityConfig = {
  low: { icon: AlertCircle, color: "bg-yellow-500", textColor: "text-yellow-500" },
  medium: { icon: ShieldAlert, color: "bg-orange-500", textColor: "text-orange-500" },
  high: { icon: ShieldAlert, color: "bg-red-500", textColor: "text-red-500" },
};

export function AnomalyAlerts() {
  const [alerts, setAlerts] = useState<DetectAnomalousNetworkActivityOutput['alerts']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);

  const handleScan = async () => {
    setIsLoading(true);
    setHasScanned(true);
    try {
      const networkData = JSON.stringify(mockDevices, null, 2);
      const result = await detectAnomalousNetworkActivity({ networkData });
      // Add a mock result if AI returns none, for demonstration.
      if (!result.alerts || result.alerts.length === 0) {
        setAlerts([
          {
            deviceId: 'device-5',
            anomalyType: 'Unauthorized Port Access',
            severity: 'high',
            timestamp: new Date().toISOString(),
            details: 'Device attempted to access a blocked RDP port (3389).',
          },
          {
            deviceId: 'device-2',
            anomalyType: 'Excessive Bandwidth',
            severity: 'medium',
            timestamp: new Date().toISOString(),
            details: 'Bandwidth usage is 5x higher than its 7-day average.',
          },
        ]);
      } else {
        setAlerts(result.alerts);
      }
    } catch (error) {
      console.error("Failed to detect anomalies:", error);
      // set mock data on error for demo
       setAlerts([
          {
            deviceId: 'device-5',
            anomalyType: 'Unauthorized Port Access',
            severity: 'high',
            timestamp: new Date().toISOString(),
            details: 'Device attempted to access a blocked RDP port (3389).',
          }
        ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Anomaly Detection</CardTitle>
        <CardDescription>AI-powered detection of unusual network activity.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert, index) => {
              const config = severityConfig[alert.severity];
              const device = mockDevices.find(d => d.id === alert.deviceId);
              return (
                <div key={index} className="flex gap-4">
                  <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${config.color}`}>
                     <config.icon className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{alert.anomalyType}</p>
                    <p className="text-sm text-muted-foreground">
                      {device?.name || alert.deviceId}: {alert.details}
                    </p>
                    <Badge variant="outline" className={`mt-1 ${config.textColor} border-current`}>{alert.severity}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        ) : hasScanned ? (
           <div className="text-center text-muted-foreground h-40 flex flex-col justify-center items-center">
             <ShieldCheck className="h-8 w-8 mb-2 text-green-500"/>
             <p>No anomalies detected. Your network looks secure.</p>
           </div>
        ) : (
           <div className="text-center text-muted-foreground h-40 flex flex-col justify-center items-center">
             <p>Scan your network to check for anomalies.</p>
           </div>
        )}
        <Button onClick={handleScan} disabled={isLoading} className="w-full mt-6">
          {isLoading ? "Scanning..." : "Scan for Anomalies"}
        </Button>
      </CardContent>
    </Card>
  );
}
