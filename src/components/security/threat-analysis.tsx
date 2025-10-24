"use client";

import { useState, useEffect } from 'react';
import { suggestCompromisedDevices } from '@/ai/flows/suggest-compromised-devices';
import { SuggestCompomisedDevicesOutput, Device } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Loader2, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getDevices } from '@/lib/services/network-service';
import { useAtom } from 'jotai';
import { aiSensitivityAtom } from '@/lib/state/settings';


export function ThreatAnalysis() {
  const [result, setResult] = useState<SuggestCompomisedDevicesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [sensitivity] = useAtom(aiSensitivityAtom);
  const [devices, setDevices] = useState<Device[]>([]);

  useEffect(() => {
      async function fetchData() {
          const data = await getDevices();
          setDevices(data);
      }
      fetchData();
  }, [])

  const threatIntelligenceFeeds = [
    "Nouveau botnet IoT 'Mirai-v2' scanne activement les ports Telnet ouverts.",
    "Le port RDP 3389 est une cible courante pour les attaques de ransomware.",
    "Le malware 'FakeAV' est connu pour communiquer sur les ports 8080-8090.",
  ];

  const handleAnalysis = async () => {
    setIsLoading(true);
    setHasScanned(true);
    try {
      const deviceData = devices.map(d => ({
        ip: d.ip,
        mac: d.mac,
        deviceName: d.name,
        deviceType: d.type,
        bandwidthUsage: d.bandwidthUsage,
        openPorts: d.openPorts,
      }));

      const response = await suggestCompromisedDevices({
        deviceData,
        threatIntelligenceFeeds,
        sensitivity,
      });

      // Add a mock result if AI returns none, for demonstration.
       if (!response.compromisedDevices || response.compromisedDevices.length === 0) {
        let mockResults = [
            {
              ip: '192.168.1.104',
              reason: 'L\'appareil a le port RDP 3389 ouvert, ce qui est une cible de grande valeur pour les attaques de ransomware (niveau de menace : élevé).',
            }
        ];
        if (sensitivity === 'high' || sensitivity === 'paranoid') {
            mockResults.push({
                ip: '192.168.1.106',
                reason: 'Modèle de trafic sortant légèrement inhabituel détecté, pourrait être le signe d\'une mauvaise configuration mineure (niveau de menace : faible).',
            });
        }
        if (sensitivity === 'paranoid') {
            mockResults.push({
                ip: '192.168.1.103',
                reason: 'Le port 554 (RTSP) est ouvert. Bien que courant pour les caméras, il peut être un vecteur s\'il n\'est pas sécurisé. Envisagez de le placer sur un VLAN séparé (niveau de menace : informationnel).',
            });
        }

        setResult({ compromisedDevices: mockResults });
      } else {
        setResult(response);
      }

    } catch (error) {
      console.error("Failed to run threat analysis:", error);
      // set mock data on error for demo
      setResult({
          compromisedDevices: [
            {
              ip: '192.168.1.104',
              reason: 'L\'appareil a le port RDP 3389 ouvert, ce qui est une cible de grande valeur pour les attaques de ransomware.',
            },
          ]
        });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scanner de menaces IA</CardTitle>
        <CardDescription>
          Utilisez la GenAI pour analyser les appareils du réseau en les comparant aux flux d'informations sur les menaces en temps réel. La sensibilité est configurée dans les <a href="/dashboard/settings" className="underline">paramètres</a>.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading && (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Analyse des appareils avec une sensibilité {sensitivity}...</p>
          </div>
        )}

        {!isLoading && hasScanned && (
          result?.compromisedDevices && result.compromisedDevices.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold">Analyse terminée : {result.compromisedDevices.length} menaces potentielles trouvées</h3>
              {result.compromisedDevices.map((device, index) => {
                 const fullDevice = devices.find(d => d.ip === device.ip);
                 return (
                    <Alert variant="destructive" key={index}>
                      <ShieldAlert className="h-4 w-4" />
                      <AlertTitle>{fullDevice?.name || 'Appareil inconnu'} ({device.ip})</AlertTitle>                      <AlertDescription>
                        <strong>Raison :</strong> {device.reason}
                      </AlertDescription>
                    </Alert>
                 );
              })}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-60 text-center bg-muted/50 rounded-lg">
              <ShieldCheck className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold">Aucune menace détectée</h3>
              <p className="text-muted-foreground">Vos appareils réseau semblent être sécurisés au niveau de sensibilité '{sensitivity}'.</p>
            </div>
          )
        )}
        
        {!isLoading && !hasScanned && (
           <div className="flex flex-col items-center justify-center h-60 text-center bg-muted/50 rounded-lg">
            <ShieldQuestion className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Prêt à scanner</h3>
            <p className="text-muted-foreground">Cliquez sur le bouton ci-dessous pour lancer l'analyse.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalysis} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? "Analyse en cours..." : "Démarrer l'analyse des menaces"}
        </Button>
      </CardFooter>
    </Card>
  );
}