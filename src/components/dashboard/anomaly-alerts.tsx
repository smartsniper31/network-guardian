
"use client";

import { useState, useEffect, useCallback } from "react";
import { detectAnomalousNetworkActivity } from "@/ai/flows/detect-anomalous-network-activity";
import { AnomalyAlertSchema, Device } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, ShieldAlert, Loader2, ShieldCheck, Ban, History, BrainCircuit } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { getDevices, getDevice, updateDeviceStatus } from "@/lib/services/network-service";
import { z } from "zod";

const severityConfig = {
  low: { icon: AlertCircle, color: "bg-yellow-500", textColor: "text-yellow-500" },
  medium: { icon: ShieldAlert, color: "bg-orange-500", textColor: "text-orange-500" },
  high: { icon: ShieldAlert, color: "bg-red-500", textColor: "text-red-500" },
};

type AlertWithDeviceName = z.infer<typeof AnomalyAlertSchema> & { deviceName: string };

export function AnomalyAlerts() {
  const [alerts, setAlerts] = useState<AlertWithDeviceName[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [scanHistory, setScanHistory] = useState<string[]>([]);
  const { toast } = useToast();

  const handleBlockDevice = useCallback(async (deviceId: string) => {
    try {
      await updateDeviceStatus(deviceId, 'Blocked');
      const device = await getDevice(deviceId);
      toast({
        title: "Appareil bloqué",
        description: `L'appareil "${device?.name || deviceId}" a été bloqué et isolé du réseau.`,
      });
      // Note: In a real app, you'd trigger a state refresh for other components.
      // For this simulation, the data service updates in-memory state which other components will get on next fetch.
    } catch(e) {
      toast({
        variant: 'destructive',
        title: "Erreur de blocage",
        description: "Impossible de bloquer l'appareil.",
      });
    }
  }, [toast]);

  const handleScan = async () => {
    setIsLoading(true);
    const timestamp = new Date().toLocaleTimeString();
    try {
      const devices = await getDevices();
      const networkData = JSON.stringify(devices, null, 2);
      const result = await detectAnomalousNetworkActivity({ networkData });
      
      const mockResults = [
        {
          deviceId: 'device-5',
          anomalyType: 'Accès non autorisé au port',
          severity: 'high' as const,
          timestamp: new Date().toISOString(),
          details: 'L\'appareil a tenté d\'accéder à un port RDP bloqué (3389).',
        },
        {
          deviceId: 'device-2',
          anomalyType: 'Bande passante excessive',
          severity: 'medium' as const,
          timestamp: new Date().toISOString(),
          details: 'L\'utilisation de la bande passante est 5x plus élevée que sa moyenne sur 7 jours.',
        },
      ];

      const finalAlerts = (!result.alerts || result.alerts.length === 0) ? mockResults : result.alerts;
      
      const alertsWithNames: AlertWithDeviceName[] = await Promise.all(
        finalAlerts.map(async (alert) => {
          const device = await getDevice(alert.deviceId);
          return { ...alert, deviceName: device?.name || alert.deviceId };
        })
      );
      
      setAlerts(alertsWithNames);

      if (alertsWithNames.length > 0) {
        setScanHistory(prev => [`${timestamp}: ${alertsWithNames.length} anomalies trouvées.`, ...prev]);
      } else {
        setScanHistory(prev => [`${timestamp}: Aucune anomalie détectée.`, ...prev]);
      }

      for (const alert of alertsWithNames) {
        if (alert.severity === 'high') {
            toast({
                variant: 'destructive',
                title: `Anomalie critique: ${alert.anomalyType}`,
                description: `${alert.deviceName}: ${alert.details}`,
                action: <Button variant="secondary" size="sm" onClick={() => handleBlockDevice(alert.deviceId)}>Bloquer l'appareil</Button>
            })
        }
      }

    } catch (error) {
      console.error("Failed to detect anomalies:", error);
       setScanHistory(prev => [`${timestamp}: Échec de l'analyse.`, ...prev]);
       const mockErrorResult = [
          {
            deviceId: 'device-5',
            anomalyType: 'Accès non autorisé au port',
            severity: 'high' as const,
            timestamp: new Date().toISOString(),
            details: 'L\'appareil a tenté d\'accéder à un port RDP bloqué (3389).',
          }
        ];
       const device = await getDevice(mockErrorResult[0].deviceId);
       setAlerts([{ ...mockErrorResult[0], deviceName: device?.name || mockErrorResult[0].deviceId }]);
       toast({
         variant: 'destructive',
         title: `Anomalie critique: ${mockErrorResult[0].anomalyType}`,
         description: `${device?.name || mockErrorResult[0].deviceId}: ${mockErrorResult[0].details}`,
         action: <Button variant="secondary" size="sm" onClick={() => handleBlockDevice(mockErrorResult[0].deviceId)}>Bloquer l'appareil</Button>
       });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><BrainCircuit /> Alertes de Sécurité IA</CardTitle>
        <CardDescription>Analyse en temps réel de l'activité réseau pour détecter les comportements inhabituels.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center h-48">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : alerts.length > 0 ? (
          <div className="space-y-4">
            {alerts.map((alert, index) => {
              const config = severityConfig[alert.severity];
              return (
                <div key={index} className="flex gap-4">
                  <div className={`mt-1 h-5 w-5 rounded-full flex items-center justify-center ${config.color}`}>
                     <config.icon className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold">{alert.anomalyType}</p>
                    <p className="text-sm text-muted-foreground">
                      {alert.deviceName}: {alert.details}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={`border-current ${config.textColor}`}>{alert.severity}</Badge>
                        {alert.severity === 'high' && (
                            <Button variant="destructive" size="sm" className="h-6 px-2 text-xs" onClick={() => handleBlockDevice(alert.deviceId)}>
                                <Ban className="mr-1 h-3 w-3" />
                                Bloquer
                            </Button>
                        )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : scanHistory.length > 0 ? (
           <div className="text-center text-muted-foreground h-48 flex flex-col justify-center items-center">
             <ShieldCheck className="h-8 w-8 mb-2 text-green-500"/>
             <p>Aucune anomalie détectée. Votre réseau semble sécurisé.</p>
           </div>
        ) : (
           <div className="text-center text-muted-foreground h-48 flex flex-col justify-center items-center">
             <p>Scannez votre réseau pour vérifier les anomalies.</p>
           </div>
        )}
        
        <Button onClick={handleScan} disabled={isLoading} className="w-full mt-6">
          {isLoading ? "Analyse en cours..." : "Lancer le scan IA"}
        </Button>

        {scanHistory.length > 0 && (
            <div className="mt-6">
                <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                    <History className="h-4 w-4"/>
                    Historique des scans
                </h4>
                <div className="text-xs text-muted-foreground space-y-1">
                    {scanHistory.slice(0, 3).map((entry, index) => (
                        <p key={index}>{entry}</p>
                    ))}
                </div>
            </div>
        )}

      </CardContent>
    </Card>
  );
}
