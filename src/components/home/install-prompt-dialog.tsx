"use client";

import { Download, Globe } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Icons } from "../icons";

interface InstallPromptDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  onDismiss: () => void;
}

export function InstallPromptDialog({
  isOpen,
  onOpenChange,
  onConfirm,
  onDismiss,
}: InstallPromptDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader className="text-center items-center">
            <Icons.logo className="h-12 w-12 text-primary mb-2" />
          <DialogTitle className="text-2xl font-bold font-headline">
            Passez à l'Application pour une Protection Complète
          </DialogTitle>
          <DialogDescription className="text-base">
            La version web est une excellente démonstration, mais la véritable puissance de Network Guardian se débloque avec l'application de bureau.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4 text-sm">
            <div className="flex items-start gap-4">
                <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <Download className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-semibold">Fonctionnalités complètes</h4>
                    <p className="text-muted-foreground">Scannez votre réseau en temps réel, bloquez des appareils et recevez des alertes natives.</p>
                </div>
            </div>
            <div className="flex items-start gap-4">
                 <div className="bg-primary/10 text-primary p-2 rounded-full">
                    <Globe className="h-5 w-5" />
                </div>
                <div>
                    <h4 className="font-semibold">Version Web Limitée</h4>
                    <p className="text-muted-foreground">La version web utilise des données de démonstration et ne peut pas scanner votre réseau local pour des raisons de sécurité.</p>
                </div>
            </div>
        </div>
        <DialogFooter className="flex-col sm:flex-col sm:space-x-0 gap-2">
          <Button onClick={onConfirm} size="lg">
            <Download className="mr-2 h-4 w-4" />
            Télécharger l'Application
          </Button>
          <Button onClick={onDismiss} variant="ghost">
            Continuer sur la version web
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
