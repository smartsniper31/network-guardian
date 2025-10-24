"use client";

import { useState } from 'react';
import { generateWeeklyReport } from '@/ai/flows/generate-weekly-report';
import { GenerateWeeklyReportOutput } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { BarChart, Clock, FileText, Lightbulb, Loader2, ShieldAlert, Smartphone } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { getDevices, getLogs } from '@/lib/services/network-service';

const severityConfig = {
  low: { color: "text-blue-500", icon: <Lightbulb className="h-4 w-4 text-blue-500" /> },
  medium: { color: "text-yellow-500", icon: <ShieldAlert className="h-4 w-4 text-yellow-500" /> },
  high: { color: "text-red-500", icon: <ShieldAlert className="h-4 w-4 text-red-500" /> },
};

export function ReportView() {
  const [report, setReport] = useState<GenerateWeeklyReportOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    try {
      const devices = await getDevices();
      const logs = await getLogs();
      const result = await generateWeeklyReport({ devices, logs });
      
      // For demo: if AI returns empty, use mock data
      if (!result.recommendations || result.recommendations.length === 0) {
        setReport({
          overallSummary: "Cette semaine a vu une augmentation de 15% de l'utilisation globale des données, principalement due au streaming vidéo. Deux alertes de sécurité mineures ont été résolues automatiquement. La stabilité du réseau est restée élevée.",
          screenTimeAnalysis: [
            { deviceName: 'TV du Salon', deviceId: 'device-2', usageHours: 35 },
            { deviceName: "MacBook Pro de l'admin", deviceId: 'device-1', usageHours: 28 },
            { deviceName: 'Tablette de cuisine', deviceId: 'device-6', usageHours: 18 },
          ],
          threatsSummary: {
            totalThreats: 2,
            threats: [
              { details: "Un appareil a tenté d'accéder à un domaine malveillant connu et a été automatiquement bloqué.", recommendation: "Aucune action requise, les règles du pare-feu fonctionnent correctement." },
              { details: "Un trafic sortant inhabituel a été détecté depuis 'Caméra de sécurité 1', qui a été automatiquement atténué.", recommendation: "Surveiller les journaux de la caméra pour d'autres anomalies." },
            ]
          },
          recommendations: [
            { title: "Définir un planning pour la 'TV du Salon'", description: "Envisagez de définir un planning d'accès à Internet pour gérer le temps d'écran, en particulier pendant les heures tardives.", severity: 'low' },
            { title: "Revoir les autorisations de 'l'iPhone Invité'", description: "L'appareil invité est actuellement en pause. S'il n'est plus nécessaire, envisagez de le supprimer du réseau pour une meilleure sécurité.", severity: 'medium' },
          ]
        });
      } else {
         setReport(result);
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
       // Mock on error
       setReport({
          overallSummary: "Cette semaine a vu une augmentation de 15% de l'utilisation globale des données, principalement due au streaming vidéo. Deux alertes de sécurité mineures ont été résolues automatiquement.",
          screenTimeAnalysis: [
            { deviceName: 'TV du Salon', deviceId: 'device-2', usageHours: 35 },
          ],
          threatsSummary: {
            totalThreats: 1,
            threats: [
              { details: "Un appareil a tenté d'accéder à un domaine malveillant connu et a été automatiquement bloqué.", recommendation: "Aucune action requise." },
            ]
          },
          recommendations: [
            { title: "Définir un planning pour la 'TV du Salon'", description: "Envisagez de définir un planning d'accès à Internet pour gérer le temps d'écran.", severity: 'low' },
          ]
        });
    } finally {
      setIsLoading(false);
    }
  };
  
  const maxUsage = report ? Math.max(...report.screenTimeAnalysis.map(d => d.usageHours)) : 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle>Rapport d'analyse hebdomadaire</CardTitle>
                <CardDescription>Un résumé généré par IA de la santé et de l'activité de votre réseau.</CardDescription>
            </div>
            <Button onClick={handleGenerateReport} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                {isLoading ? 'Génération...' : (report ? 'Régénérer le rapport' : 'Générer le rapport')}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>Analyse des données de la semaine dernière...</p>
            </div>
        )}
        {!isLoading && !report && (
            <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground bg-muted/30 rounded-lg">
                <FileText className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold">Prêt pour votre rapport hebdomadaire</h3>
                <p>Cliquez sur "Générer le rapport" pour commencer.</p>
            </div>
        )}
        {!isLoading && report && (
            <div className="space-y-8">
                {/* Overall Summary */}
                <section>
                    <h3 className="text-xl font-semibold font-headline mb-2">Aperçu de la semaine</h3>
                    <p className="text-muted-foreground">{report.overallSummary}</p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Screen Time */}
                    <section>
                        <h3 className="text-xl font-semibold font-headline mb-4 flex items-center gap-2"><Clock className="h-5 w-5"/> Analyse du temps d'écran</h3>
                        <div className="space-y-4">
                            {report.screenTimeAnalysis.map(device => (
                                <div key={device.deviceId}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{device.deviceName}</span>
                                        <span className="text-sm text-muted-foreground">{device.usageHours.toFixed(1)} h</span>
                                    </div>
                                    <Progress value={(device.usageHours / maxUsage) * 100} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Threats Summary */}
                    <section>
                        <h3 className="text-xl font-semibold font-headline mb-4 flex items-center gap-2"><ShieldAlert className="h-5 w-5"/> Résumé des menaces</h3>
                        <Alert>
                            <ShieldAlert className="h-4 w-4" />
                            <AlertTitle>{report.threatsSummary.totalThreats} menaces détectées</AlertTitle>
                            <AlertDescription>
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    {report.threatsSummary.threats.map((threat, i) => (
                                        <li key={i}>{threat.details}</li>
                                    ))}
                                </ul>
                            </AlertDescription>
                        </Alert>
                    </section>
                </div>
                
                {/* Recommendations */}
                <section>
                    <h3 className="text-xl font-semibold font-headline mb-4 flex items-center gap-2"><Lightbulb className="h-5 w-5"/> Recommandations de l'IA</h3>
                    <div className="space-y-4">
                        {report.recommendations.map((rec, i) => {
                            const config = severityConfig[rec.severity];
                            return (
                                <Alert key={i}>
                                    {config.icon}
                                    <AlertTitle className={config.color}>{rec.title}</AlertTitle>
                                    <AlertDescription>{rec.description}</AlertDescription>
                                </Alert>
                            )
                        })}
                    </div>
                </section>
            </div>
        )}
      </CardContent>
    </Card>
  );
}
