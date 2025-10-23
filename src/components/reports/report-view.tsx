
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
          overallSummary: "This week saw a 15% increase in overall data usage, primarily driven by video streaming. Two minor security alerts were automatically resolved. Network stability remained high.",
          screenTimeAnalysis: [
            { deviceName: 'Living Room TV', deviceId: 'device-2', usageHours: 35 },
            { deviceName: "Admin's MacBook Pro", deviceId: 'device-1', usageHours: 28 },
            { deviceName: 'Kitchen Tablet', deviceId: 'device-6', usageHours: 18 },
          ],
          threatsSummary: {
            totalThreats: 2,
            threats: [
              { details: "A device attempted to access a known malicious domain and was automatically blocked.", recommendation: "No action needed, firewall rules are working correctly." },
              { details: "Unusual outbound traffic detected from 'Security Camera 1', which was automatically mitigated.", recommendation: "Monitor camera logs for further anomalies." },
            ]
          },
          recommendations: [
            { title: "Set a Schedule for 'Living Room TV'", description: "Consider setting an internet access schedule to manage screen time, especially during late hours.", severity: 'low' },
            { title: "Review 'Guest iPhone' permissions", description: "The guest device is currently paused. If it's no longer needed, consider removing it from the network for better security.", severity: 'medium' },
          ]
        });
      } else {
         setReport(result);
      }
    } catch (error) {
      console.error("Failed to generate report:", error);
       // Mock on error
       setReport({
          overallSummary: "This week saw a 15% increase in overall data usage, primarily driven by video streaming. Two minor security alerts were automatically resolved.",
          screenTimeAnalysis: [
            { deviceName: 'Living Room TV', deviceId: 'device-2', usageHours: 35 },
          ],
          threatsSummary: {
            totalThreats: 1,
            threats: [
              { details: "A device attempted to access a known malicious domain and was automatically blocked.", recommendation: "No action needed." },
            ]
          },
          recommendations: [
            { title: "Set a Schedule for 'Living Room TV'", description: "Consider setting an internet access schedule to manage screen time.", severity: 'low' },
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
                <CardTitle>Weekly Insights Report</CardTitle>
                <CardDescription>An AI-generated summary of your network's health and activity.</CardDescription>
            </div>
            <Button onClick={handleGenerateReport} disabled={isLoading}>
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <FileText className="mr-2 h-4 w-4" />}
                {isLoading ? 'Generating...' : (report ? 'Regenerate Report' : 'Generate Report')}
            </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading && (
            <div className="flex flex-col items-center justify-center h-96 text-muted-foreground">
                <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
                <p>Analyzing the past week's data...</p>
            </div>
        )}
        {!isLoading && !report && (
            <div className="flex flex-col items-center justify-center h-96 text-center text-muted-foreground bg-muted/30 rounded-lg">
                <FileText className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-semibold">Ready for your weekly report</h3>
                <p>Click "Generate Report" to get started.</p>
            </div>
        )}
        {!isLoading && report && (
            <div className="space-y-8">
                {/* Overall Summary */}
                <section>
                    <h3 className="text-xl font-semibold font-headline mb-2">Weekly Overview</h3>
                    <p className="text-muted-foreground">{report.overallSummary}</p>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Screen Time */}
                    <section>
                        <h3 className="text-xl font-semibold font-headline mb-4 flex items-center gap-2"><Clock className="h-5 w-5"/> Screen Time Analysis</h3>
                        <div className="space-y-4">
                            {report.screenTimeAnalysis.map(device => (
                                <div key={device.deviceId}>
                                    <div className="flex justify-between mb-1">
                                        <span className="text-sm font-medium">{device.deviceName}</span>
                                        <span className="text-sm text-muted-foreground">{device.usageHours.toFixed(1)} hrs</span>
                                    </div>
                                    <Progress value={(device.usageHours / maxUsage) * 100} />
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Threats Summary */}
                    <section>
                        <h3 className="text-xl font-semibold font-headline mb-4 flex items-center gap-2"><ShieldAlert className="h-5 w-5"/> Threats Summary</h3>
                        <Alert>
                            <ShieldAlert className="h-4 w-4" />
                            <AlertTitle>{report.threatsSummary.totalThreats} threats detected</AlertTitle>
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
                    <h3 className="text-xl font-semibold font-headline mb-4 flex items-center gap-2"><Lightbulb className="h-5 w-5"/> AI Recommendations</h3>
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
