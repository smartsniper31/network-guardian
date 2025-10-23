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
  CardHeader,
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Laptop, Smartphone, Tablet, Tv, Camera, Router, HelpCircle, Server,
  MoreHorizontal, Ban, Pause, Play, Settings2, ShieldCheck, Clock
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { mockDevices as initialDevices } from "@/lib/data";
import { Device } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

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
  const [devices, setDevices] = useState<Device[]>(initialDevices);
  const { toast } = useToast();

  const handleStatusChange = (deviceId: string, newStatus: Device['status']) => {
    setDevices(devices.map(d => d.id === deviceId ? { ...d, status: newStatus } : d));
    toast({
      title: `Device ${newStatus}`,
      description: `Device with ID ${deviceId} has been ${newStatus.toLowerCase()}.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Connected Devices</CardTitle>
        <CardDescription>Manage all devices currently on your network.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Device</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="hidden md:table-cell">IP Address</TableHead>
                <TableHead className="hidden lg:table-cell">Bandwidth</TableHead>
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
                            <Pause className="mr-2 h-4 w-4" /> Pause
                          </DropdownMenuItem>
                        }
                        {(device.status === 'Paused' || device.status === 'Blocked') &&
                          <DropdownMenuItem onClick={() => handleStatusChange(device.id, 'Online')}>
                            <Play className="mr-2 h-4 w-4" /> Unpause/Unblock
                          </DropdownMenuItem>
                        }
                         {device.status !== 'Blocked' &&
                          <DropdownMenuItem className="text-red-500" onClick={() => handleStatusChange(device.id, 'Blocked')}>
                            <Ban className="mr-2 h-4 w-4" /> Block
                          </DropdownMenuItem>
                         }
                        <DropdownMenuItem>
                           <Settings2 className="mr-2 h-4 w-4" /> Device Settings
                        </DropdownMenuItem>
                         <DropdownMenuItem>
                           <Clock className="mr-2 h-4 w-4" /> Access Schedule
                        </DropdownMenuItem>
                         <DropdownMenuItem>
                           <ShieldCheck className="mr-2 h-4 w-4" /> Firewall Rules
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
