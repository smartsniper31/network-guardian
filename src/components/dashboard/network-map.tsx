"use client"

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Device } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { analyzeDeviceVulnerabilities } from "@/ai/flows/analyze-device-vulnerabilities";
import { AnalyzeDeviceVulnerabilitiesOutput } from "@/lib/types";
import {
  Laptop,
  Smartphone,
  Tablet,
  Tv,
  Camera,
  Router,
  HelpCircle,
  Server,
  Shield,
  Loader2,
  AlertTriangle,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { getDevices } from "@/lib/services/network-service";
import { Skeleton } from "../ui/skeleton";

const deviceIcons: { [key: string]: React.ElementType } = {
  Laptop,
  Smartphone,
  Tablet,
  TV: Tv,
  Camera,
  Router,
  IoT: Server,
  Unknown: HelpCircle,
};

const statusColors: { [key: string]: string } = {
  Online: "border-green-500",
  Offline: "border-gray-500",
  Blocked: "border-red-500",
  Paused: "border-yellow-500",
};

const severityIcons = {
  low: <ShieldCheck className="h-4 w-4 text-blue-500" />,
  medium: <ShieldAlert className="h-4 w-4 text-yellow-500" />,
  high: <ShieldAlert className="h-4 w-4 text-orange-500" />,
  critical: <AlertTriangle className="h-4 w-4 text-red-500" />,
};

function VulnerabilityAnalysis({
  device,
}: {
  device: Device;
}) {
  const [analysis, setAnalysis] =
    React.useState<AnalyzeDeviceVulnerabilitiesOutput | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAnalyze = async () => {
    setIsLoading(true);
    try {
      const result = await analyzeDeviceVulnerabilities(device);
      setAnalysis(result);
    } catch (error) {
      console.error("Failed to analyze device:", error);
      // Mock data for demo purposes
      setAnalysis({
        analysisSummary: "Cet appareil présente de multiples vulnérabilités critiques.",
        vulnerabilities: [
          {
            severity: "critical",
            description: "Les identifiants par défaut du panneau d'administration sont utilisés.",
            recommendation: "Changez immédiatement le mot de passe par défaut.",
          },
          {
            severity: "medium",
            description: "Le micrologiciel est obsolète et des correctifs de sécurité sont manquants.",
            recommendation: "Mettez à jour le micrologiciel de l'appareil vers la dernière version.",
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <Button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Analyse en cours...
          </>
        ) : (
          <>
            <ShieldQuestion className="mr-2 h-4 w-4" />
            Analyser les vulnérabilités
          </>
        )}
      </Button>

      {analysis && (
        <div className="space-y-4 pt-4">
          <h4 className="font-semibold">Résultats de l'analyse</h4>
          <p className="text-sm text-muted-foreground">{analysis.analysisSummary}</p>
          {analysis.vulnerabilities.length > 0 ? (
            <div className="space-y-3 rounded-md border p-3">
              {analysis.vulnerabilities.map((vuln, index) => (
                <div key={index} className="flex gap-3">
                  {severityIcons[vuln.severity]}
                  <div>
                    <p className="font-semibold capitalize">Risque {vuln.severity}</p>
                    <p className="text-sm">{vuln.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      <strong>Recommandation :</strong> {vuln.recommendation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
             <div className="text-center text-muted-foreground py-8">
                <ShieldCheck className="h-10 w-10 mx-auto text-green-500 mb-2"/>
                <p>Aucune vulnérabilité détectée.</p>
             </div>
          )}
        </div>
      )}
    </div>
  );
}

export function NetworkMap() {
  const routerPosition = { x: 50, y: 50 }; // Center in percentage
  const radius = 35; // Radius in percentage
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getDevices();
      setDevices(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Topologie interactive du réseau</CardTitle>
          <CardDescription>Cliquez sur un appareil pour voir les détails et effectuer une analyse de sécurité.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <TooltipProvider>
              <div className="relative w-full h-96 rounded-lg bg-muted/30 overflow-hidden">
                {/* Router */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                      style={{ left: `${routerPosition.x}%`, top: `${routerPosition.y}%` }}
                    >
                      <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center">
                        <Router className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-xs font-semibold mt-1">Routeur Principal</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>192.168.1.1</p>
                  </TooltipContent>
                </Tooltip>

                {/* Devices */}
                {devices.map((device, index) => {
                  const angle = (index / devices.length) * 2 * Math.PI;
                  const x = routerPosition.x + radius * Math.cos(angle);
                  const y = routerPosition.y + radius * Math.sin(angle);
                  const Icon = deviceIcons[device.type] || HelpCircle;

                  return (
                    <React.Fragment key={device.id}>
                      {/* Connection Line */}
                      <svg className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                        <line
                          x1={`${routerPosition.x}%`}
                          y1={`${routerPosition.y}%`}
                          x2={`${x}%`}
                          y2={`${y}%`}
                          className="stroke-border"
                          strokeWidth="1"
                          strokeDasharray={device.status === 'Online' ? "0" : "4 2"}
                        />
                      </svg>

                      {/* Device Icon */}
                      <Tooltip>
                        <TooltipTrigger
                          asChild
                          onClick={() => setSelectedDevice(device)}
                          className="cursor-pointer"
                        >
                          <div
                            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                            style={{ left: `${x}%`, top: `${y}%` }}
                          >
                            <div className={`h-12 w-12 rounded-full bg-card border-2 flex items-center justify-center ${statusColors[device.status]}`}>
                                <Icon className="h-6 w-6 text-foreground" />
                            </div>
                            <p className="text-xs text-center mt-1 w-20 truncate">{device.name}</p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{device.name}</p>
                          <p>{device.ip}</p>
                          <p>Statut: {device.status}</p>
                        </TooltipContent>
                      </Tooltip>
                    </React.Fragment>
                  );
                })}
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={!!selectedDevice} onOpenChange={(open) => !open && setSelectedDevice(null)}>
        <DialogContent>
          {selectedDevice && (
            <>
            <DialogHeader>
              <DialogTitle>
                <div className="flex items-center gap-2">
                  {React.createElement(deviceIcons[selectedDevice.type] || HelpCircle)}
                  {selectedDevice.name}
                </div>
              </DialogTitle>
              <DialogDescription>
                {selectedDevice.ip} &bull; {selectedDevice.mac}
              </DialogDescription>
            </DialogHeader>
            <div>
              <h4 className="font-semibold text-sm mb-2">Détails de l'appareil</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Statut</div>
                <div><Badge variant="outline">{selectedDevice.status}</Badge></div>
                <div>Type</div>
                <div>{selectedDevice.type}</div>
                <div>Bande passante</div>
                <div>{selectedDevice.bandwidthUsage} Mbps</div>
                 <div>Ports ouverts</div>
                <div>{selectedDevice.openPorts.join(', ') || 'Aucun'}</div>
              </div>
            </div>
            <VulnerabilityAnalysis device={selectedDevice} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
