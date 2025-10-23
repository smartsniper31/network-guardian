"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { mockDevices } from "@/lib/data"
import { Laptop, Smartphone, Tablet, Tv, Camera, Router, HelpCircle, Server } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const deviceIcons: { [key: string]: React.ElementType } = {
  Laptop,
  Smartphone,
  Tablet,
  TV: Tv,
  Camera,
  Router,
  IoT: Server,
  Unknown: HelpCircle,
}

const statusColors: { [key: string]: string } = {
  Online: "border-green-500",
  Offline: "border-gray-500",
  Blocked: "border-red-500",
  Paused: "border-yellow-500",
}

export function NetworkMap() {
  const routerPosition = { x: 50, y: 50 }; // Center in percentage
  const radius = 35; // Radius in percentage

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Topology</CardTitle>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
          <div className="relative w-full h-80 rounded-lg bg-muted/30 overflow-hidden">
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
                  <p className="text-xs font-semibold mt-1">Main Router</p>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>192.168.1.1</p>
              </TooltipContent>
            </Tooltip>

            {/* Devices */}
            {mockDevices.map((device, index) => {
              const angle = (index / mockDevices.length) * 2 * Math.PI;
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
                    <TooltipTrigger asChild>
                      <div
                        className="absolute -translate-x-1/2 -translate-y-1/2 flex flex-col items-center cursor-pointer"
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
                      <p>Status: {device.status}</p>
                    </TooltipContent>
                  </Tooltip>
                </React.Fragment>
              );
            })}
          </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
