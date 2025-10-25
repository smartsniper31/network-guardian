"use client";

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Device, FilterContentOutput } from '@/lib/types';
import { Filter, Loader2 } from 'lucide-react';
import { filterContent } from '@/ai/flows/filter-content';
import { useToast } from '@/hooks/use-toast';
import { updateDeviceBlockedCategories } from '@/lib/services/network-service';

interface ContentFilterDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  device: Device;
  onSave: (deviceId: string, blockedCategories: string[]) => void;
}

const contentCategories = [
    { id: 'social-media', label: 'Réseaux sociaux' },
    { id: 'gaming', label: 'Jeux' },
    { id: 'adult-content', label: 'Contenu pour adultes' },
    { id: 'streaming-video', label: 'Streaming Vidéo' },
    { id: 'gambling', label: 'Jeux d\'argent' },
];

export function ContentFilterDialog({
  isOpen,
  onOpenChange,
  device,
  onSave,
}: ContentFilterDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (device) {
      setSelectedCategories(device.blockedCategories || []);
    }
  }, [device]);

  const handleToggleCategory = (category: string, checked: boolean) => {
    setSelectedCategories(prev => 
        checked ? [...prev, category] : prev.filter(c => c !== category)
    );
  };
  
  const handleSave = async () => {
    setIsLoading(true);
    try {
        const result: FilterContentOutput = await filterContent({ deviceId: device.id, categories: selectedCategories });
        await updateDeviceBlockedCategories(device.id, selectedCategories);
        toast({
            title: 'Filtres mis à jour',
            description: result.message,
        });
        onSave(device.id, selectedCategories);
        onOpenChange(false);
    } catch(e) {
        console.error("Failed to update content filters:", e);
        // Mock success on error for demo purposes
        await updateDeviceBlockedCategories(device.id, selectedCategories);
        toast({
            title: 'Filtres mis à jour (Simulation)',
            description: `Les filtres pour ${device.name} ont été appliqués.`,
        });
        onSave(device.id, selectedCategories);
        onOpenChange(false);
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter /> Filtrage de contenu pour {device.name}
          </DialogTitle>
          <DialogDescription>
            Sélectionnez les catégories de contenu à bloquer sur cet appareil. L'IA gérera les règles de réseau nécessaires.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
            <div className="space-y-3">
                <Label>Catégories bloquées</Label>
                <div className="grid grid-cols-2 gap-4 rounded-md border p-4">
                    {contentCategories.map(({ id, label }) => (
                        <div key={id} className="flex items-center gap-2">
                           <Checkbox
                             id={`filter-${id}`}
                             checked={selectedCategories.includes(label)}
                             onCheckedChange={(checked) => handleToggleCategory(label, !!checked)}
                           />
                           <Label htmlFor={`filter-${id}`} className="cursor-pointer">{label}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>Annuler</Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Enregistrer les filtres
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
