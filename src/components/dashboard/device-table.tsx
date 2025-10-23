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

export function DeviceTable() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddDeviceOpen, setIsAddDeviceOpen] = useState(false);
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
        title: `Appareil ${newStatus}`,
        description: `L'appareil a été mis à jour.`,
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

  return (
    <>
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
            <CardTitle>Appareils Connectés</CardTitle>
            <CardDescription>Gérez tous les appareils sur votre réseau.</CardDescription>
        </div>
        <Button onClick={() => setIsAddDeviceOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Ajouter un appareil
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
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
                devices.map((device) => (
                  <TableRow key={device.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="text-muted-foreground">{deviceIcons[device.type]}</div>
                        <div>
                          <p className="font-medium">{device.name}</p>
                          <p className="text-sm text-muted-foreground hidden sm:block">{device.mac}</p>
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
                          <DropdownMenuItem>
                             <Settings2 className="mr-2 h-4 w-4" /> Paramètres
                          </DropdownMenuItem>
                           <DropdownMenuItem>
                             <Clock className="mr-2 h-4 w-4" /> Planifier l'accès
                          </DropdownMenuItem>
                           <DropdownMenuItem>
                             <ShieldCheck className="mr-2 h-4 w-4" /> Règles de pare-feu
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
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
    </>
  );
}
