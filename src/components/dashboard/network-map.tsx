"use client";

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
  Router as RouterIcon,
  HelpCircle,
  Server,
  Network,
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
import { cn } from "@/lib/utils";

const deviceIcons: { [key: string]: React.ElementType } = {
  Laptop,
  Smartphone,
  Tablet,
  TV: Tv,
  Camera,
  Router: RouterIcon,
  IoT: Server,
  Unknown: HelpCircle,
};

const statusColors: { [key: string]: string } = {
  Online: "border-green-500",
  Offline: "border-gray-500",
  Blocked: "border-red-500",
  Paused: "border-yellow-500",
};

const statusBgColors: { [key: string]: string } = {
  Online: "bg-green-500",
  Offline: "bg-gray-500",
  Blocked: "bg-red-500",
  Paused: "bg-yellow-500",
};

export function NetworkMap() {
  const routerPosition = { x: 50, y: 50 };
  const radius = 35;
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

  const routerDevice = devices.find((d) => d.type === "Router");
  const otherDevices = devices.filter((d) => d.type !== "Router");

  return (
    <>
      <Card id="network-map">
        <CardHeader>
          <CardTitle>Topologie du réseau</CardTitle>
          <CardDescription>
            Visualisation interactive de vos appareils connectés.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <TooltipProvider>
              {/* Desktop View */}
              <div className="relative w-full h-96 rounded-lg bg-muted/30 overflow-hidden hidden md:block">
                {routerDevice ? (
                  <>
                    {/* Router */}
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div
                          className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
                          style={{
                            left: `${routerPosition.x}%`,
                            top: `${routerPosition.y}%`,
                          }}
                          onClick={() => setSelectedDevice(routerDevice)}
                        >
                          <div className="h-16 w-16 rounded-full bg-primary/10 border-2 border-dashed border-primary flex items-center justify-center">
                            <RouterIcon className="h-8 w-8 text-primary" />
                          </div>
                          <p className="text-xs font-semibold mt-1 w-24 text-center truncate">
                            {routerDevice.name}
                          </p>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p className="font-semibold">{routerDevice.name}</p>
                        <p>{routerDevice.ip}</p>
                        <p>Statut: {routerDevice.status}</p>
                      </TooltipContent>
                    </Tooltip>

                    {/* Other Devices */}
                    {otherDevices.map((device, index) => {
                      const angle = (index / otherDevices.length) * 2 * Math.PI;
                      const x = routerPosition.x + radius * Math.cos(angle);
                      const y = routerPosition.y + radius * Math.sin(angle);
                      const Icon = deviceIcons[device.type] || HelpCircle;

                      return (
                        <React.Fragment key={device.id}>
                          {/* Connection Line */}
                          <svg
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ pointerEvents: "none" }}
                          >
                            <line
                              x1={`${routerPosition.x}%`}
                              y1={`${routerPosition.y}%`}
                              x2={`${x}%`}
                              y2={`${y}%`}
                              className="stroke-border"
                              strokeWidth="1"
                              strokeDasharray={
                                device.status === "Online" ? "0" : "4 2"
                              }
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
                                <div
                                  className={cn(
                                    "h-12 w-12 rounded-full bg-card border-2 flex items-center justify-center",
                                    statusColors[device.status]
                                  )}
                                >
                                  <Icon className="h-6 w-6 text-foreground" />
                                </div>
                                <p className="text-xs text-center mt-1 w-20 truncate">
                                  {device.name}
                                </p>
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
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                    <Network className="h-12 w-12 mb-4" />
                    <p className="font-semibold">
                      Routeur principal introuvable
                    </p>
                    <p className="text-sm">
                      Impossible de visualiser la topologie sans appareil de type
                      'Routeur'.
                    </p>
                  </div>
                )}
              </div>

              {/* Mobile View */}
              <div className="space-y-2 md:hidden">
                {devices.map((device) => {
                  const Icon = deviceIcons[device.type] || HelpCircle;
                  return (
                    <div
                      key={device.id}
                      onClick={() => setSelectedDevice(device)}
                      className="flex items-center gap-4 rounded-lg border p-3 cursor-pointer hover:bg-muted/50"
                    >
                      <Icon className="h-6 w-6 text-muted-foreground" />
                      <div className="flex-1">
                        <p className="font-semibold">{device.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {device.ip}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{device.status}</span>
                        <div
                          className={cn(
                            "h-3 w-3 rounded-full",
                            statusBgColors[device.status]
                          )}
                        />
                      </div>
                    </div>
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
