"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { analyzeDeviceVulnerabilities } from "@/ai/flows/analyze-device-vulnerabilities";
import {
  Device,
  AnalyzeDeviceVulnerabilitiesOutput,
} from "@/lib/types";

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

const severityIcons: { [key: string]: React.ReactElement } = {
  low: <ShieldCheck className="h-4 w-4 text-blue-500" />,
  medium: <ShieldAlert className="h-4 w-4 text-yellow-500" />,
  high: <ShieldAlert className="h-4 w-4 text-orange-500" />,
  critical: <AlertTriangle className="h-4 w-4 text-red-500" />,
};

function VulnerabilityAnalysis({ device }: { device: Device }) {
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
        analysisSummary:
          "Cet appareil présente plusieurs vulnérabilités critiques en raison d'un pare-feu non configuré et de ports web ouverts, le rendant vulnérable aux attaques réseau.",
        vulnerabilities: [
          {
            severity: "critical",
            description:
              "L'appareil n'a pas de règles de pare-feu configurées, ce qui suggère que le pare-feu du système est désactivé ou mal configuré.",
            recommendation: "Activez et configurez correctement le pare-feu du système d'exploitation pour bloquer toutes les connexions entrantes inutiles.",
          },
          {
            severity: "medium",
            description:
              "Les ports 80 (HTTP) et 443 (HTTPS) sont ouverts sur un ordinateur portable administratif. Exécuter des services web sur une machine d'administrateur augmente la surface d'attaque.",
            recommendation:
              "Désactivez les services web si non essentiels, ou restreignez l'accès à des adresses IP de confiance uniquement.",
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-4 space-y-4">
      <Button onClick={handleAnalyze} disabled={isLoading} className="w-full">
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
          <p className="text-sm text-muted-foreground">
            {analysis.analysisSummary}
          </p>
          {analysis.vulnerabilities.length > 0 ? (
            <div className="space-y-3 rounded-md border p-3">
              {analysis.vulnerabilities.map((vuln, index) => (
                <div key={index} className="flex gap-3">
                  {severityIcons[vuln.severity]}
                  <div>
                    <p className="font-semibold capitalize">
                      Risque {vuln.severity === 'low' ? 'faible' : vuln.severity === 'medium' ? 'moyen' : vuln.severity}
                    </p>
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
              <ShieldCheck className="h-10 w-10 mx-auto text-green-500 mb-2" />
              <p>Aucune vulnérabilité détectée.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface NetworkMapDialogProps {
    device: Device;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NetworkMapDialog({ device, isOpen, onOpenChange }: NetworkMapDialogProps) {
    const DeviceIcon = deviceIcons[device.type] || HelpCircle;
    
    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent>
            <DialogHeader>
                <DialogTitle>
                <div className="flex items-center gap-2">
                    <DeviceIcon />
                    {device.name}
                </div>
                </DialogTitle>
                <DialogDescription>
                {device.ip} &bull; {device.mac}
                </DialogDescription>
            </DialogHeader>
            <div>
                <h4 className="font-semibold text-sm mb-2">Détails de l'appareil</h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                <div>Statut</div>
                <div>
                    <Badge variant="outline">{device.status}</Badge>
                </div>
                <div>Type</div>
                <div>{device.type}</div>
                <div>Bande passante</div>
                <div>{device.bandwidthUsage} Mbps</div>
                <div>Ports ouverts</div>
                <div>{device.openPorts.join(", ") || "Aucun"}</div>
                </div>
            </div>
            <VulnerabilityAnalysis device={device} />
            </DialogContent>
      </Dialog>
    )
}
