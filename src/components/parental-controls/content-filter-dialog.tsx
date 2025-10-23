
"use client";

import { useState } from 'react';
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
    { id: 'social-media', label: 'Social Media' },
    { id: 'gaming', label: 'Gaming' },
    { id: 'adult-content', label: 'Adult Content' },
    { id: 'streaming-video', label: 'Streaming Video' },
    { id: 'gambling', label: 'Gambling' },
];

export function ContentFilterDialog({
  isOpen,
  onOpenChange,
  device,
  onSave,
}: ContentFilterDialogProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>(device.blockedCategories || []);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
            title: 'Filters Updated',
            description: result.message,
        });
        onSave(device.id, selectedCategories);
        onOpenChange(false);
    } catch(e) {
        console.error("Failed to update content filters:", e);
        toast({
            variant: "destructive",
            title: "Update Failed",
            description: "Could not save the new filter settings.",
        });
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Filter /> Content Filtering for {device.name}
          </DialogTitle>
          <DialogDescription>
            Select content categories to block on this device. The AI will manage the necessary network rules.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
            <div className="space-y-3">
                <Label>Blocked Categories</Label>
                <div className="grid grid-cols-2 gap-4 rounded-md border p-4">
                    {contentCategories.map(({ id, label }) => (
                        <div key={id} className="flex items-center gap-2">
                           <Checkbox
                             id={id}
                             checked={selectedCategories.includes(label)}
                             onCheckedChange={(checked) => handleToggleCategory(label, !!checked)}
                           />
                           <Label htmlFor={id} className="cursor-pointer">{label}</Label>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            Save Filters
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
