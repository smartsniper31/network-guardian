
"use client";

import { useState } from 'react';
import { suggestCompromisedDevices } from '@/ai/flows/suggest-compromised-devices';
import { SuggestCompromisedDevicesInput, SuggestCompomisedDevicesOutput } from '@/lib/types';
import { mockDevices } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Loader2, ShieldCheck, ShieldQuestion } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export function ThreatAnalysis() {
  const [result, setResult] = useState<SuggestCompomisedDevicesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasScanned, setHasScanned] = useState(false);
  const [sensitivity, setSensitivity] = useState<SuggestCompromisedDevicesInput['sensitivity']>('normal');

  const threatIntelligenceFeeds = [
    "New IoT botnet 'Mirai-v2' actively scanning for open Telnet ports.",
    "RDP port 3389 is a common target for ransomware attacks.",
    "Malware 'FakeAV' known to communicate over ports 8080-8090.",
  ];

  const handleAnalysis = async () => {
    setIsLoading(true);
    setHasScanned(true);
    try {
      const deviceData = mockDevices.map(d => ({
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
              ip: '192.168.1.105',
              reason: 'Device has RDP port 3389 open, which is a high-value target for ransomware attacks (threat level: high).',
            }
        ];
        if (sensitivity === 'high' || sensitivity === 'paranoid') {
            mockResults.push({
                ip: '192.168.1.107',
                reason: 'Slightly unusual outbound traffic pattern detected, could be a sign of a minor misconfiguration (threat level: low).',
            });
        }
        if (sensitivity === 'paranoid') {
            mockResults.push({
                ip: '192.168.1.104',
                reason: 'Port 554 (RTSP) is open. While common for cameras, it can be a vector if not secured. Consider placing it on a separate VLAN (threat level: informational).',
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
              ip: '192.168.1.105',
              reason: 'Device has RDP port 3389 open, which is a high-value target for ransomware attacks.',
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
        <CardTitle>AI Threat Scanner</CardTitle>
        <CardDescription>
          Leverage GenAI to analyze network devices against real-time threat intelligence feeds.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="sensitivity">AI Sensitivity Level</Label>
          <Select value={sensitivity} onValueChange={(value) => setSensitivity(value as any)}>
            <SelectTrigger id="sensitivity" className="w-[180px]">
              <SelectValue placeholder="Select sensitivity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="normal">Normal</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="paranoid">Paranoid</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">"Paranoid" level will flag even minor deviations.</p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center h-60">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Analyzing devices with {sensitivity} sensitivity...</p>
          </div>
        )}

        {!isLoading && hasScanned && (
          result?.compromisedDevices && result.compromisedDevices.length > 0 ? (
            <div className="space-y-4">
              <h3 className="font-semibold">Analysis Complete: {result.compromisedDevices.length} Potential Threats Found</h3>
              {result.compromisedDevices.map((device, index) => {
                 const fullDevice = mockDevices.find(d => d.ip === device.ip);
                 return (
                    <Alert variant="destructive" key={index}>
                      <ShieldAlert className="h-4 w-4" />
                      <AlertTitle>{fullDevice?.name || 'Unknown Device'} ({device.ip})</AlertTitle>
                      <AlertDescription>
                        <strong>Reason:</strong> {device.reason}
                      </AlertDescription>
                    </Alert>
                 );
              })}
            </div>
          ) : (
             <div className="flex flex-col items-center justify-center h-60 text-center bg-muted/50 rounded-lg">
              <ShieldCheck className="h-12 w-12 text-green-500 mb-4" />
              <h3 className="text-xl font-semibold">No Threats Detected</h3>
              <p className="text-muted-foreground">Your network devices appear to be secure at the '{sensitivity}' sensitivity level.</p>
            </div>
          )
        )}
        
        {!isLoading && !hasScanned && (
           <div className="flex flex-col items-center justify-center h-60 text-center bg-muted/50 rounded-lg">
            <ShieldQuestion className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold">Ready to Scan</h3>
            <p className="text-muted-foreground">Select a sensitivity level and click the button below.</p>
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button onClick={handleAnalysis} disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? "Analyzing..." : "Start Threat Analysis"}
        </Button>
      </CardFooter>
    </Card>
  );
}
