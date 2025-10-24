"use client";

import { useAtom } from "jotai";
import { useTheme } from "next-themes";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BrainCircuit, Languages, Sun, Moon, Laptop, Bell, UserCog, Scan, AlertCircle } from "lucide-react";
import { aiSensitivityAtom } from "@/lib/state/settings";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SettingsPage() {
  const [sensitivity, setSensitivity] = useAtom(aiSensitivityAtom);
  const { setTheme, theme } = useTheme();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Paramètres</h1>
        <p className="text-muted-foreground">
          Gérez les paramètres globaux, les préférences et la configuration du compte.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
          {/* General & Appearance Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                Paramètres généraux et apparence
              </CardTitle>
              <CardDescription>
                Personnalisez l'apparence et la langue de l'application.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="grid w-full items-center gap-4">
                  <Label>Thème</Label>
                  <RadioGroup defaultValue={theme} onValueChange={setTheme} className="flex space-x-2 md:space-x-4">
                    <div>
                      <RadioGroupItem value="light" id="light" className="peer sr-only" />
                      <Label htmlFor="light" className="flex h-16 w-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Sun className="h-6 w-6" />
                        Clair
                      </Label>
                    </div>
                     <div>
                      <RadioGroupItem value="dark" id="dark" className="peer sr-only" />
                      <Label htmlFor="dark" className="flex h-16 w-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Moon className="h-6 w-6" />
                        Sombre
                      </Label>
                    </div>
                     <div>
                      <RadioGroupItem value="system" id="system" className="peer sr-only" />
                      <Label htmlFor="system" className="flex h-16 w-16 flex-col items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary">
                        <Laptop className="h-6 w-6" />
                        Système
                      </Label>
                    </div>
                  </RadioGroup>
               </div>
               <div className="grid w-full items-center gap-4">
                  <Label htmlFor="language">Langue</Label>
                  <Select defaultValue="fr">
                      <SelectTrigger id="language" className="w-full md:w-[180px]">
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

           {/* Account Management Card */}
           <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCog />
                Gestion du compte
              </CardTitle>
              <CardDescription>
                Mettez à jour vos informations de profil et votre mot de passe.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="name">Nom</Label>
                      <Input id="name" defaultValue="Admin User" />
                  </div>
                  <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="admin@networkguardian.com" disabled />
                  </div>
               </div>
               <div className="space-y-2">
                    <Label htmlFor="password">Nouveau mot de passe</Label>
                    <Input id="password" type="password" placeholder="Laissez vide pour ne pas changer" />
                </div>
            </CardContent>
            <CardFooter className="border-t px-6 py-4">
                <Button>Sauvegarder les modifications</Button>
            </CardFooter>
          </Card>
        </div>

        <div className="space-y-8">
            {/* AI & Automation Card */}
            <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                <BrainCircuit />
                IA & Automatisation
                </CardTitle>
                <CardDescription>
                Ajustez le comportement des fonctionnalités intelligentes et des tâches automatisées.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="sensitivity">Niveau de sensibilité de l'IA pour la détection</Label>
                <Select value={sensitivity} onValueChange={(value) => setSensitivity(value as any)}>
                    <SelectTrigger id="sensitivity">
                    <SelectValue placeholder="Sélectionnez la sensibilité" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="normal">Normale</SelectItem>
                    <SelectItem value="high">Élevée</SelectItem>
                    <SelectItem value="paranoid">Paranoïaque</SelectItem>
                    </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">"Paranoïaque" signalera même les écarts mineurs.</p>
                </div>
                 <div className="grid w-full items-center gap-1.5">
                <Label htmlFor="auto-scan">Analyses de sécurité automatiques</Label>
                <Select defaultValue="weekly">
                    <SelectTrigger id="auto-scan">
                        <SelectValue placeholder="Sélectionnez la fréquence" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="daily">Journalière</SelectItem>
                        <SelectItem value="weekly">Hebdomadaire</SelectItem>
                        <SelectItem value="never">Jamais</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </CardContent>
            </Card>

            {/* Notifications Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Bell />
                    Notifications
                    </CardTitle>
                    <CardDescription>
                    Choisissez comment et quand vous souhaitez être notifié.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                            <Label htmlFor="email-notifications" className="text-base">
                                Alertes par e-mail
                            </Label>
                            <p className="text-xs text-muted-foreground">
                                Recevez les alertes importantes par e-mail.
                            </p>
                        </div>
                        <Switch id="email-notifications" />
                    </div>
                    <div>
                        <Label>Notifier pour :</Label>
                        <div className="space-y-3 mt-2">
                            <div className="flex items-center gap-2">
                                <Checkbox id="notify-threat" defaultChecked />
                                <Label htmlFor="notify-threat" className="font-normal">Menace de sécurité détectée</Label>
                            </div>
                             <div className="flex items-center gap-2">
                                <Checkbox id="notify-new-device" defaultChecked />
                                <Label htmlFor="notify-new-device" className="font-normal">Nouvel appareil connecté</Label>
                            </div>
                             <div className="flex items-center gap-2">
                                <Checkbox id="notify-offline" />
                                <Label htmlFor="notify-offline" className="font-normal">Appareil important hors ligne</Label>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
