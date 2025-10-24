"use client";

import { useAtom } from "jotai";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrainCircuit, Languages, SunMoon } from "lucide-react";
import { aiSensitivityAtom } from "@/lib/state/settings";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export default function SettingsPage() {
  const [sensitivity, setSensitivity] = useAtom(aiSensitivityAtom);
  // State for theme and language would be added here
  // const [theme, setTheme] = useAtom(themeAtom);
  // const [language, setLanguage] = useAtom(languageAtom);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres globaux de l'application.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
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
              <p className="text-xs text-muted-foreground">Le niveau "Paranoïaque" signalera même les écarts mineurs.</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <SunMoon />
              Apparence
            </CardTitle>
            <CardDescription>
              Personnalisez l'apparence de l'application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label>Thème</Label>
                <RadioGroup defaultValue="system" className="flex space-x-4">
                  <div>
                    <RadioGroupItem value="light" id="light" className="peer sr-only" />
                    <Label htmlFor="light" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      Clair
                    </Label>
                  </div>
                   <div>
                    <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                    <Label htmlFor="dark" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      Sombre
                    </Label>
                  </div>
                   <div>
                    <RadioGroupItem value="system" id="system" className="peer sr-only" />
                    <Label htmlFor="system" className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                      Système
                    </Label>
                  </div>
                </RadioGroup>
             </div>
             <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="language">Langue</Label>
                <Select defaultValue="fr">
                    <SelectTrigger id="language" className="w-[180px]">
                        <SelectValue placeholder="Sélectionnez la langue" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                    </SelectContent>
                </Select>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}