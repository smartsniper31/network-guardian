
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { AddDeviceDialog } from "@/components/dashboard/add-device-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addDevice } from "@/lib/services/network-service";
import { useToast } from "@/hooks/use-toast";
import type { Device } from "@/lib/types";

export default function SetupPage() {
    const [isAddRouterOpen, setIsAddRouterOpen] = useState(false);
    const router = useRouter();
    const { toast } = useToast();

    const handleAddRouter = async (routerData: Omit<Device, 'id' | 'type'>) => {
        try {
            const newRouterData = { ...routerData, type: 'Router' as const };
            const newDevice = await addDevice(newRouterData);
            toast({
                title: "Routeur ajouté",
                description: `${newDevice.name} est maintenant configuré comme votre routeur principal.`,
            });
            router.push('/dashboard');
        } catch (error) {
            toast({
                title: "Erreur",
                description: "Impossible d'ajouter le routeur.",
                variant: "destructive",
            });
        }
    };
    
    return (
        <>
            <div className="relative flex min-h-screen flex-col items-center justify-center bg-background p-4">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-background"></div>
                <div className="relative z-10 flex w-full max-w-lg flex-col items-center gap-8">
                    <div className="flex flex-col items-center gap-3 text-center">
                        <Icons.logo className="h-12 w-12 text-primary" />
                        <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
                            Configuration Initiale
                        </h1>
                        <p className="text-lg text-muted-foreground">
                            Juste une étape avant de sécuriser votre réseau.
                        </p>
                    </div>

                    <Card className="w-full">
                        <CardHeader>
                            <CardTitle>Étape 1 : Enregistrez votre routeur</CardTitle>
                            <CardDescription>
                                Le routeur est le chef d'orchestre de votre réseau. Network Guardian a besoin de l'identifier pour fonctionner correctement. Veuillez ajouter votre routeur principal.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={() => setIsAddRouterOpen(true)}>
                                Ajouter le routeur principal
                            </Button>
                             <p className="text-xs text-muted-foreground mt-4 text-center">
                                Vous pouvez trouver ces informations (adresse IP, MAC) sur une étiquette collée sur votre routeur ou dans son interface d'administration web.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <AddDeviceDialog
                isOpen={isAddRouterOpen}
                onOpenChange={setIsAddRouterOpen}
                onSave={(deviceData) => handleAddRouter(deviceData as Omit<Device, 'id' | 'type'>)}
            />
        </>
    );
}
