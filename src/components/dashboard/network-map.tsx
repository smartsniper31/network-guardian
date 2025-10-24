"use client"

import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Device } from "@/lib/types";
import {
  Laptop,
  Smartphone,
  Tablet,
  Tv,
  Camera,
  Router,
  HelpCircle,
  Server,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getDevices } from "@/lib/services/network-service";
import { Skeleton } from "../ui/skeleton";
import { NetworkMapDialog } from "./network-map-dialog";

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

const statusColors: { [key: string]: string } = {
  Online: "border-green-500",
  Offline: "border-gray-500",
  Blocked: "border-red-500",
  Paused: "border-yellow-500",
};

export function NetworkMap() {
  const routerPosition = { x: 50, y: 50 }; // Center in percentage
  const radius = 35; // Radius in percentage
  const [selectedDevice, setSelectedDevice] = React.useState<Device | null>(null);
  const [devices, setDevices] = React.useState<Device[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      const data = await getDevices();
      setDevices(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Topologie interactive du réseau</CardTitle>
          <CardDescription>Cliquez sur un appareil pour voir les détails et effectuer une analyse de sécurité.</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <TooltipProvider>
              <div className="relative w-full h-96 rounded-lg bg-muted/30 overflow-hidden">
                {/* Router */}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div
                      className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                      style={{ left: `${routerPosition.x}%`, top: `${routerPosition.y}%` }}
                    >
                      <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center">
                        <Router className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-xs font-semibold mt-1">Routeur Principal</p>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>192.168.1.1</p>
                  </TooltipContent>
                </Tooltip>

                {/* Devices */}
                {devices.map((device, index) => {
                  const angle = (index / devices.length) * 2 * Math.PI;
                  const x = routerPosition.x + radius * Math.cos(angle);
                  const y = routerPosition.y + radius * Math.sin(angle);
                  const Icon = deviceIcons[device.type] || HelpCircle;

                  return (
                    <React.Fragment key={device.id}>
                      {/* Connection Line */}
                      <svg className="absolute top-0 left-0 w-full h-full" style={{ pointerEvents: 'none' }}>
                        <line
                          x1={`${routerPosition.x}%`}
                          y1={`${routerPosition.y}%`}
                          x2={`${x}%`}
                          y2={`${y}%`}
                          className="stroke-border"
                          strokeWidth="1"
                          strokeDasharray={device.status === 'Online' ? "0" : "4 2"}
                        />
                      </svg>

                      {/* Device Icon */}
                      <Tooltip>
                        <TooltipTrigger
                          asChild
                          onClick={() => setSelectedDevice(device)}
                          className="cursor-pointer"
                        >
                          <div
                            className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                            style={{ left: `${x}%`, top: `${y}%` }}
                          >
                            <div className={`h-12 w-12 rounded-full bg-card border-2 flex items-center justify-center ${statusColors[device.status]}`}>
                                <Icon className="h-6 w-6 text-foreground" />
                            </div>
                            <p className="text-xs text-center mt-1 w-20 truncate">{device.name}</p>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p className="font-semibold">{device.name}</p>
                          <p>{device.ip}</p>
                          <p>Statut: {device.status}</p>
                        </TooltipContent>
                      </Tooltip>
                    </React.Fragment>
                  );
                })}
              </div>
            </TooltipProvider>
          )}
        </CardContent>
      </Card>
      
      {selectedDevice && (
        <NetworkMapDialog
            isOpen={!!selectedDevice}
            onOpenChange={(open) => !open && setSelectedDevice(null)}
            device={selectedDevice}
        />
      )}
    </>
  );
}
