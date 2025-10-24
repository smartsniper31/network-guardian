"use client";

import { atom, Provider, useAtom } from "jotai";
import { SuggestCompromisedDevicesInput } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrainCircuit } from "lucide-react";

export const aiSensitivityAtom = atom<SuggestCompromisedDevicesInput['sensitivity']>('normal');

function SettingsContent() {
  const [sensitivity, setSensitivity] = useAtom(aiSensitivityAtom);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres globaux de l'application.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit />
            Paramètres de l'IA
          </CardTitle>
          <CardDescription>
            Ajustez le comportement des fonctionnalités basées sur l'intelligence artificielle.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="sensitivity">Niveau de sensibilité de l'IA pour la détection de menaces</Label>
            <Select value={sensitivity} onValueChange={(value) => setSensitivity(value as any)}>
              <SelectTrigger id="sensitivity" className="w-[180px]">
                <SelectValue placeholder="Sélectionnez la sensibilité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normale</SelectItem>
                <SelectItem value="high">Élevée</SelectItem>
                <SelectItem value="paranoid">Paranoïaque</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Le niveau "Paranoïaque" signalera même les écarts mineurs lors de l'analyse des menaces.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


export default function SettingsPage() {
  return (
    <Provider>
      <SettingsContent />
    </Provider>
  )
}
