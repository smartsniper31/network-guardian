"use client";

import React, { useState } from 'react';
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
import { mockDevices as initialDevices } from "@/lib/data";
import { Device } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { AccessScheduleDialog } from './access-schedule-dialog';

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
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleStatusChange = (deviceId: string, newStatus: Device['status']) => {
    setDevices(devices.map(d => d.id === deviceId ? { ...d, status: newStatus } : d));
    toast({
      title: `Device ${newStatus}`,
      description: `Device with ID ${deviceId} has been ${newStatus.toLowerCase()}.`,
    });
  };

  const openScheduleDialog = (device: Device) => {
    setSelectedDevice(device);
    setIsScheduleDialogOpen(true);
  };
  
  const handleScheduleSave = (schedule: any) => {
    console.log("Saving schedule for", selectedDevice?.id, schedule);
    toast({
      title: 'Schedule Saved',
      description: `Access schedule updated for ${selectedDevice?.name}.`
    });
  };

  return (
    <>
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {devices.map((device) => (
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
                  <TableCell className="text-right space-x-2">
                    {device.status === 'Online' && (
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(device.id, 'Paused')}>
                            <Pause className="mr-2 h-4 w-4" /> Pause
                        </Button>
                    )}
                    {(device.status === 'Paused' || device.status === 'Blocked') && (
                        <Button variant="outline" size="sm" onClick={() => handleStatusChange(device.id, 'Online')}>
                            <Play className="mr-2 h-4 w-4" /> Resume
                        </Button>
                    )}
                    {device.status !== 'Blocked' && (
                        <Button variant="destructive" size="sm" onClick={() => handleStatusChange(device.id, 'Blocked')}>
                            <Ban className="mr-2 h-4 w-4" /> Block
                        </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => openScheduleDialog(device)}>
                        <Clock className="mr-2 h-4 w-4" /> Schedule
                    </Button>
                     <Button variant="outline" size="sm" disabled>
                        <Filter className="mr-2 h-4 w-4" /> Filter
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
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
    </>
  );
}
