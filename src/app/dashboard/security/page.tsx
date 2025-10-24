"use client";

import { ThreatAnalysis } from "@/components/security/threat-analysis";

export default function SecurityPage() {
  return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight font-headline">مركز الأمان</h1>
          <p className="text-muted-foreground">
            فحص شبكتك بحثًا عن التهديدات ومراجعة الأجهزة التي يُحتمل تعرضها للاختراق.
          </p>
        </div>
        <ThreatAnalysis />
      </div>
  );
}
