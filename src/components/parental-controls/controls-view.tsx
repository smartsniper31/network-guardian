
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
  Ban, Pause, Play, Clock, Filter, MoreHorizontal
} from "lucide-react";
import { Device } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { AccessScheduleDialog } from './access-schedule-dialog';
import { ContentFilterDialog } from './content-filter-dialog';
import { getDevices, updateDeviceStatus, updateDeviceBlockedCategories } from '@/lib/services/network-service';
import { Skeleton } from '../ui/skeleton';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '../ui/dropdown-menu';

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

export function ControlsView() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false);
  const { toast } = useToast();

  const fetchAndSetDevices = async () => {
    setIsLoading(true);
    const data = await getDevices();
    setDevices(data);
    setIsLoading(false);
  }

  useEffect(() => {
    fetchAndSetDevices();
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

  const handleFilterSave = async (deviceId: string, blockedCategories: string[]) => {
    try {
      await updateDeviceBlockedCategories(deviceId, blockedCategories);
      setDevices(devices.map(d => d.id === deviceId ? { ...d, blockedCategories } : d));
      // Toast is handled in the dialog
    } catch (error) {
       toast({
        title: "Erreur",
        description: "Échec de la mise à jour des filtres de contenu.",
        variant: "destructive"
      });
    }
  };

  const renderDesktopActions = (device: Device) => (
    <div className="text-right space-x-2">
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
    </div>
  );

  const renderMobileActions = (device: Device) => (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {device.status === 'Online' && (
            <DropdownMenuItem onClick={() => handleStatusChange(device.id, 'Paused')}>
                <Pause className="mr-2 h-4 w-4" /> Mettre en pause
            </DropdownMenuItem>
        )}
        {(device.status === 'Paused' || device.status === 'Blocked') && (
            <DropdownMenuItem onClick={() => handleStatusChange(device.id, 'Online')}>
                <Play className="mr-2 h-4 w-4" /> Réactiver
            </DropdownMenuItem>
        )}
        {device.status !== 'Blocked' && (
            <DropdownMenuItem className="text-red-500" onClick={() => handleStatusChange(device.id, 'Blocked')}>
                <Ban className="mr-2 h-4 w-4" /> Bloquer
            </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => openScheduleDialog(device)}>
            <Clock className="mr-2 h-4 w-4" /> Planning d'accès
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => openFilterDialog(device)}>
            <Filter className="mr-2 h-4 w-4" /> Filtrage de contenu
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  return (
    <>
    <Card>
      <CardContent className="p-0 md:p-6">
        {/* Mobile View */}
        <div className="space-y-4 md:hidden p-4">
          {isLoading ? (
            [...Array(3)].map((_, i) => <Skeleton key={i} className="h-24 w-full" />)
          ) : (
            devices.map((device) => {
              const Icon = deviceIcons[device.type as keyof typeof deviceIcons] || HelpCircle;
              return (
              <div key={device.id} className="flex items-start gap-4 rounded-lg border p-3">
                <div className="text-muted-foreground mt-1"><Icon /></div>
                <div className="flex-1 space-y-2">
                  <p className="font-medium truncate">{device.name}</p>
                  <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline" className="flex items-center gap-2">
                         <span className={`h-2 w-2 rounded-full ${statusColors[device.status]}`}></span>
                         {device.status}
                      </Badge>
                      <div className="flex flex-wrap gap-1">
                          {device.blockedCategories?.map(cat => <Badge key={cat} variant="secondary">{cat}</Badge>)}
                          {(!device.blockedCategories || device.blockedCategories.length === 0) && (
                            <span className="text-xs text-muted-foreground">Aucun filtre</span>
                          )}
                      </div>
                  </div>
                </div>
                <div className="ml-auto">
                  {renderMobileActions(device)}
                </div>
              </div>
            )})
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden overflow-x-auto md:block">
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
                devices.map((device) => {
                  const Icon = deviceIcons[device.type as keyof typeof deviceIcons] || HelpCircle;
                  return (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="text-muted-foreground"><Icon /></div>
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
                    <TableCell>
                      {renderDesktopActions(device)}
                    </TableCell>
                  </TableRow>
                )})
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
