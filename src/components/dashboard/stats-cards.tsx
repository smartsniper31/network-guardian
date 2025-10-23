"use client";

import { Wifi, ShieldAlert, ArrowDownUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mockDevices } from "@/lib/data";
import { cn } from "@/lib/utils";

export function StatsCards() {
  const onlineDevices = mockDevices.filter(
    (d) => d.status === "Online"
  ).length;
  const totalDevices = mockDevices.length;
  
  const totalData = mockDevices.reduce(
    (acc, dev) => acc + dev.dataUsage.download + dev.dataUsage.upload,
    0
  );
  const formattedData = (totalData / 1024).toFixed(2); // Convert MB to GB

  const stats = [
    {
      title: "Devices Online",
      value: `${onlineDevices} / ${totalDevices}`,
      icon: Wifi,
      color: "text-green-500",
    },
    {
      title: "Threats Detected",
      value: "2",
      icon: ShieldAlert,
      color: "text-red-500",
    },
    {
      title: "Total Data Usage",
      value: `${formattedData} GB`,
      icon: ArrowDownUp,
      color: "text-blue-500",
    },
     {
      title: "Connected Users",
      value: "4",
      icon: Users,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className={cn("h-5 w-5 text-muted-foreground", stat.color)} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.title === "Threats Detected" && "in last 24h"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
