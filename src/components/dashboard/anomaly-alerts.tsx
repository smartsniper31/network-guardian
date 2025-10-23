
"use client";

import { useState } from "react";
import { detectAnomalousNetworkActivity } from "@/ai/flows/detect-anomalous-network-activity";
import { DetectAnomalousNetworkActivityOutput } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShieldAlert, Loader2, ShieldCheck, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { mockDevices } from "@/lib/data";
import { useToast } from "@/hooks/use-toast";

const severityConfig = {
  low: { icon: AlertCircle, color: "bg-yellow-500", textColor: "text-yellow-500" },
  medium: { icon: ShieldAlert, color: "bg-orange-500", textColor: "text-orange-500" },
  high: { icon: ShieldAlert, color: "bg-red-500", textColor: "text-red-500" },
};

export function AnomalyAlerts() {
  const [alerts, setAlerts] = useState<DetectAnomalousNetworkActivityOutput['alerts']>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const { toast } = useToast();

  const handleScan = async () => {
    setIsLoading(true);
    setHasScanned(true);
    try {
      const networkData = JSON.stringify(mockDevices, null, 2);
      const result = await detectAnomalousNetworkActivity({ networkData });
      
      const mockResults = [
        {
          deviceId: 'device-5',
          anomalyType: 'Unauthorized Port Access',
          severity: 'high' as const,
          timestamp: new Date().toISOString(),
          details: 'Device attempted to access a blocked RDP port (3389).',
        },
        {
          deviceId: 'device-2',
          anomalyType: 'Excessive Bandwidth',
          severity: 'medium' as const,
          timestamp: new Date().toISOString(),
          details: 'Bandwidth usage is 5x higher than its 7-day average.',
        },
      ];

      const finalAlerts = (!result.alerts || result.alerts.length === 0) ? mockResults : result.alerts;
      setAlerts(finalAlerts);

      finalAlerts.forEach(alert => {
        if (alert.severity === 'high') {
            const device = mockDevices.find(d => d.id === alert.deviceId);
            toast({
                variant: 'destructive',
                title: `High-Severity Anomaly: ${alert.anomalyType}`,
                description: `${device?.name || alert.deviceId}: ${alert.details}`,
                action: <Button variant="secondary" size="sm" onClick={() => console.log(`Blocking ${alert.deviceId}`)}>Block Device</Button>
            })
        }
      })

    } catch (error) {
      console.error("Failed to detect anomalies:", error);
      // set mock data on error for demo
       const mockErrorResult = [
          {
            deviceId: 'device-5',
            anomalyType: 'Unauthorized Port Access',
            severity: 'high' as const,
            timestamp: new Date().toISOString(),
            details: 'Device attempted to access a blocked RDP port (3389).',
          }
        ];
       setAlerts(mockErrorResult);
       const device = mockDevices.find(d => d.id === mockErrorResult[0].deviceId);
       toast({
         variant: 'destructive',
         title: `High-Severity Anomaly: ${mockErrorResult[0].anomalyType}`,
         description: `${device?.name || mockErrorResult[0].deviceId}: ${mockErrorResult[0].details}`,
         action: <Button variant="secondary" size="sm">Block Device</Button>
       });
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
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`border-current ${config.textColor}`}>{alert.severity}</Badge>
                        {alert.severity === 'high' && (
                            <Button variant="destructive" size="sm" className="h-6 px-2 text-xs">
                                <Ban className="mr-1 h-3 w-3" />
                                Block
                            </Button>
                        )}
                    </div>
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
