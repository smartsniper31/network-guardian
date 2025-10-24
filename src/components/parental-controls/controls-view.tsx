"use client";

import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Laptop, Smartphone, Tablet, Tv, Camera, Router, HelpCircle, Server,
  Ban, Pause, Play, Clock, Filter
} from "lucide-react";
import { Device } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { AccessScheduleDialog } from './access-schedule-dialog';
import { ContentFilterDialog } from './content-filter-dialog';
import { getDevices, updateDeviceStatus } from '@/lib/services/network-service';
import { Skeleton } from '../ui/skeleton';

const deviceIcons = {
  Laptop: <Laptop className="h-5 w-5" />,
  Smartphone: <Smartphone className="h-5 w-5" />,
  Tablet: <Tablet className="h-5 w-5" />,
  TV: <Tv className="h-5 w-5" />,
  Camera: <Camera className="h-5 w-5" />,
  Router: <Router className="h-5 w-5" />,
  IoT: <Server className="h-5 w-5" />,
  Unknown: <HelpCircle className="h-5 w-5" />,
};

const statusColors = {
  Online: "bg-green-500",
  Offline: "bg-gray-500",
  Blocked: "bg-red-500",
  Paused: "bg-yellow-500",
};

export function ControlsView() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getDevices();
      setDevices(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  const handleStatusChange = async (deviceId: string, newStatus: Device['status']) => {
    try {
      await updateDeviceStatus(deviceId, newStatus);
      setDevices(devices.map(d => d.id === deviceId ? { ...d, status: newStatus } : d));
      toast({
        title: `Appareil mis à jour`,
        description: `Le statut de l'appareil est maintenant '${newStatus}'.`,
      });
    } catch (error) {
       toast({
        title: "Erreur",
        description: "Échec de la mise à jour du statut de l'appareil.",
        variant: "destructive"
      });
    }
  };

  const openScheduleDialog = (device: Device) => {
    setSelectedDevice(device);
    setIsScheduleDialogOpen(true);
  };
  
  const handleScheduleSave = (schedule: any) => {
    // In a real app, this would be an API call to the backend/router.
    // For now, we just show a success toast.
    console.log("Saving schedule for", selectedDevice?.id, schedule);
    toast({
      title: 'Planning enregistré',
      description: `Le planning d'accès a été mis à jour pour ${selectedDevice?.name}.`
    });
  };

  const openFilterDialog = (device: Device) => {
    setSelectedDevice(device);
    setIsFilterDialogOpen(true);
  };

  const handleFilterSave = (deviceId: string, blockedCategories: string[]) => {
    setDevices(devices.map(d => d.id === deviceId ? { ...d, blockedCategories } : d));
    // Toast is handled in the dialog
  };

  return (
    <>
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Appareil</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Filtres actifs</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-36" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-48" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-24" /></TableCell>
                  </TableRow>
                ))
              ) : (
                devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="text-muted-foreground">{deviceIcons[device.type]}</div>
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-muted-foreground hidden sm:block">{device.ip}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="flex items-center gap-2 w-24 justify-center">
                         <span className={`h-2 w-2 rounded-full ${statusColors[device.status]}`}></span>
                         {device.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {device.blockedCategories?.map(cat => <Badge key={cat} variant="secondary">{cat}</Badge>)}
                         {(!device.blockedCategories || device.blockedCategories.length === 0) && (
                           <span className="text-xs text-muted-foreground">Aucun</span>
                         )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      {device.status === 'Online' && (
                          <Button variant="outline" size="sm" onClick={() => handleStatusChange(device.id, 'Paused')}>
                              <Pause className="mr-2 h-4 w-4" /> Pause
                          </Button>
                      )}
                      {(device.status === 'Paused' || device.status === 'Blocked') && (
                          <Button variant="outline" size="sm" onClick={() => handleStatusChange(device.id, 'Online')}>
                              <Play className="mr-2 h-4 w-4" /> Activer
                          </Button>
                      )}
                      {device.status !== 'Blocked' && (
                          <Button variant="destructive" size="sm" onClick={() => handleStatusChange(device.id, 'Blocked')}>
                              <Ban className="mr-2 h-4 w-4" /> Bloquer
                          </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => openScheduleDialog(device)}>
                          <Clock className="mr-2 h-4 w-4" /> Planning
                      </Button>
                       <Button variant="outline" size="sm" onClick={() => openFilterDialog(device)}>
                          <Filter className="mr-2 h-4 w-4" /> Filtrer
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>

    {selectedDevice && (
        <AccessScheduleDialog 
            isOpen={isScheduleDialogOpen}
            onOpenChange={setIsScheduleDialogOpen}
            device={selectedDevice}
            onSave={handleScheduleSave}
        />
    )}

    {selectedDevice && (
      <ContentFilterDialog
        isOpen={isFilterDialogOpen}
        onOpenChange={setIsFilterDialogOpen}
        device={selectedDevice}
        onSave={handleFilterSave}
      />
    )}
    </>
  );
}
