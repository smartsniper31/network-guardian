"use client";

import { ThreatAnalysis } from "@/components/security/threat-analysis";

export default function SecurityPage() {
  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Centre de Sécurité</h1>
          <p className="text-muted-foreground">
            Scannez votre réseau à la recherche de menaces et examinez les appareils potentiellement compromis.
          </p>
        </div>
        <ThreatAnalysis />
      </div>
  );
}
