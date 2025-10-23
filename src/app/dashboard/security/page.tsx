import { ThreatAnalysis } from "@/components/security/threat-analysis";

export default function SecurityPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Security Center</h1>
        <p className="text-muted-foreground">
          Analyze your network for threats and review potentially compromised devices.
        </p>
      </div>
      <ThreatAnalysis />
    </div>
  );
}
