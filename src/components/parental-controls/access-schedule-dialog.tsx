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
import { Input } from "@/components/ui/input";
import { Device } from '@/lib/types';
import { Clock } from 'lucide-react';

interface AccessScheduleDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  device: Device;
  onSave: (schedule: any) => void;
}

const daysOfWeek = [
    { id: 'Mon', label: 'Lun' }, 
    { id: 'Tue', label: 'Mar' }, 
    { id: 'Wed', label: 'Mer' }, 
    { id: 'Thu', label: 'Jeu' }, 
    { id: 'Fri', label: 'Ven' }, 
    { id: 'Sat', label: 'Sam' }, 
    { id: 'Sun', label: 'Dim' }
];

export function AccessScheduleDialog({
  isOpen,
  onOpenChange,
  device,
  onSave,
}: AccessScheduleDialogProps) {
  const [schedule, setSchedule] = useState({
    days: { Mon: true, Tue: true, Wed: true, Thu: true, Fri: false, Sat: false, Sun: true },
    startTime: '07:00',
    endTime: '21:00',
  });

  const handleDayToggle = (day: string) => {
    setSchedule(prev => ({
      ...prev,
      days: { ...prev.days, [day]: !prev.days[day as keyof typeof prev.days] },
    }));
  };
  
  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSchedule(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };
  
  const handleSave = () => {
    onSave(schedule);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Clock /> Planning d'accès pour {device.name}
          </DialogTitle>
          <DialogDescription>
            Définissez les heures pendant lesquelles cet appareil est autorisé à accéder à Internet.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <Label>Jours actifs</Label>
                <div className="flex flex-wrap gap-2">
                    {daysOfWeek.map(day => (
                        <Button
                            key={day.id}
                            variant={schedule.days[day.id as keyof typeof schedule.days] ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleDayToggle(day.id)}
                        >
                            {day.label}
                        </Button>
                    ))}
                </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="startTime">Heure de début</Label>
                    <Input id="startTime" name="startTime" type="time" value={schedule.startTime} onChange={handleTimeChange} />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="endTime">Heure de fin</Label>
                    <Input id="endTime" name="endTime" type="time" value={schedule.endTime} onChange={handleTimeChange} />
                </div>
            </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Annuler</Button>
          <Button onClick={handleSave}>Enregistrer le planning</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
