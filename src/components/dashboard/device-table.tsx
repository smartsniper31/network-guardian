
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
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Laptop, Smartphone, Tablet, Tv, Camera, Router, HelpCircle, Server,
  MoreHorizontal, Ban, Pause, Play, Settings2, ShieldCheck, Clock, PlusCircle
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Device } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { AddDeviceDialog } from './add-device-dialog';
import { getDevices, addDevice as addDeviceService, updateDeviceStatus } from '@/lib/services/network-service';
import { Skeleton } from '../ui/skeleton';
import { AccessScheduleDialog } from '../parental-controls/access-schedule-dialog';
import { NetworkMapDialog } from './network-map-dialog';


const deviceIcons: { [key: string]: React.ElementType } = {
  Laptop,
  Smartphone,
  Tablet,
  TV: Tv,
  Camera,
  Router,
  IoT: Server,
  Unknown: HelpCircle,
};

const statusColors = {
  Online: "bg-green-500",
  Offline: "bg-gray-500",
  Blocked: "bg-red-500",
  Paused: "bg-yellow-500",
};

export function DeviceTable() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
  const { toast } = useToast();

  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isSettingsDialogOpen, setIsSettingsDialogOpen] = useState(false);


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
        title: `Erreur`,
        description: `La mise à jour a échoué.`,
        variant: "destructive",
      });
    }
  };

  const handleAddDevice = async (newDeviceData: Omit<Device, 'id'>) => {
    try {
        const newDevice = await addDeviceService(newDeviceData);
        setDevices(prev => [...prev, newDevice]);
        toast({
            title: "Appareil Ajouté",
            description: `${newDevice.name} a été ajouté à votre réseau.`,
        });
    } catch (error) {
        toast({
            title: "Erreur",
            description: "Impossible d'ajouter l'appareil.",
            variant: "destructive",
        });
    }
  }

  const openScheduleDialog = (device: Device) => {
    setSelectedDevice(device);
    setIsScheduleDialogOpen(true);
  };
  
  const handleScheduleSave = (schedule: any) => {
    console.log("Saving schedule for", selectedDevice?.id, schedule);
    toast({
      title: 'Planning enregistré',
      description: `Le planning d'accès a été mis à jour pour ${selectedDevice?.name}.`
    });
  };

  const openSettingsDialog = (device: Device) => {
    setSelectedDevice(device);
    setIsSettingsDialogOpen(true);
  }

  const renderDeviceActions = (device: Device) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {device.status !== 'Blocked' && device.status !== 'Paused' &&
          <DropdownMenuItem onClick={() => handleStatusChange(device.id, 'Paused')}>
            <Pause className="mr-2 h-4 w-4" /> Mettre en pause
          </DropdownMenuItem>
        }
        {(device.status === 'Paused' || device.status === 'Blocked') &&
          <DropdownMenuItem onClick={() => handleStatusChange(device.id, 'Online')}>
            <Play className="mr-2 h-4 w-4" /> Réactiver
          </DropdownMenuItem>
        }
         {device.status !== 'Blocked' &&
          <DropdownMenuItem className="text-red-500" onClick={() => handleStatusChange(device.id, 'Blocked')}>
            <Ban className="mr-2 h-4 w-4" /> Bloquer
          </DropdownMenuItem>
         }
        <DropdownMenuItem onClick={() => openSettingsDialog(device)}>
           <Settings2 className="mr-2 h-4 w-4" /> Paramètres
        </DropdownMenuItem>
         <DropdownMenuItem onClick={() => openScheduleDialog(device)}>
           <Clock className="mr-2 h-4 w-4" /> Planifier l'accès
        </DropdownMenuItem>
         <DropdownMenuItem disabled>
           <ShieldCheck className="mr-2 h-4 w-4" /> Règles de pare-feu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
    <Card>
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <CardTitle>Appareils Connectés</CardTitle>
            <CardDescription>Gérez tous les appareils sur votre réseau.</CardDescription>
        </div>
        <Button onClick={() => setIsAddDeviceOpen(true)} className="w-full sm:w-auto">
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un appareil
        </Button>
      </CardHeader>
      <CardContent>
        {/* Mobile View: Card List */}
        <div className="space-y-4 md:hidden">
          {isLoading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          ) : (
            devices.map((device) => {
              const Icon = deviceIcons[device.type] || HelpCircle;
              return (
                <div key={device.id} className="flex items-center gap-4 rounded-lg border p-3">
                  <Icon className="h-5 w-5 text-muted-foreground" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium truncate">{device.name}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="flex items-center gap-2">
                        <span className={`h-2 w-2 rounded-full ${statusColors[device.status]}`}></span>
                        {device.status}
                      </Badge>
                      <p className="text-sm text-muted-foreground">{device.ip}</p>
                    </div>
                  </div>
                  <div className="ml-auto">
                    {renderDeviceActions(device)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop View: Table */}
        <div className="hidden overflow-x-auto md:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Appareil</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden md:table-cell">Adresse IP</TableHead>
                <TableHead className="hidden lg:table-cell">Bande passante</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                [...Array(5)].map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="hidden md:table-cell"><Skeleton className="h-6 w-24" /></TableCell>
                    <TableCell className="hidden lg:table-cell"><Skeleton className="h-6 w-16" /></TableCell>
                    <TableCell className="text-right"><Skeleton className="h-8 w-8" /></TableCell>
                  </TableRow>
                ))
              ) : (
                devices.map((device) => {
                  const Icon = deviceIcons[device.type] || HelpCircle;
                  return (
                    <TableRow key={device.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="text-muted-foreground">
                            <Icon />
                          </div>
                          <div>
                            <p className="font-medium">{device.name}</p>
                            <p className="text-sm text-muted-foreground">{device.mac}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="flex items-center gap-2">
                          <span className={`h-2 w-2 rounded-full ${statusColors[device.status]}`}></span>
                          {device.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="hidden md:table-cell">{device.ip}</TableCell>
                      <TableCell className="hidden lg:table-cell">{device.bandwidthUsage} Mbps</TableCell>
                      <TableCell className="text-right">
                        {renderDeviceActions(device)}
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </div>
          {!isLoading && devices.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
                <p>Aucun appareil trouvé. Cliquez sur "Ajouter un appareil" pour commencer.</p>
            </div>
        )}
      </CardContent>
    </Card>
    <AddDeviceDialog 
        isOpen={isAddDeviceOpen}
        onOpenChange={setIsAddDeviceOpen}
        onSave={handleAddDevice}
    />
     {selectedDevice && (
        <AccessScheduleDialog 
            isOpen={isScheduleDialogOpen}
            onOpenChange={setIsScheduleDialogOpen}
            device={selectedDevice}
            onSave={handleScheduleSave}
        />
    )}
    {selectedDevice && (
        <NetworkMapDialog
            device={selectedDevice}
            isOpen={isSettingsDialogOpen}
            onOpenChange={setIsSettingsDialogOpen}
        />
    )}
    </>
  );
}

    