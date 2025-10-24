"use client";

import { ThreatAnalysis } from "@/components/security/threat-analysis";
import { Provider } from "jotai";

export default function SecurityPage() {
  return (
    <Provider>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">Centre de sécurité</h1>
          <p className="text-muted-foreground">
            Analysez votre réseau à la recherche de menaces et examinez les appareils potentiellement compromis.
          </p>
        </div>
        <ThreatAnalysis />
      </div>
    </Provider>
  );
}
