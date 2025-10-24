"use client";

import { useEffect, useState } from "react";
import NextLink from "next/link";
import { Wifi, ShieldAlert, ArrowDownUp, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { getDevices } from "@/lib/services/network-service";
import type { Device } from "@/lib/types";

export function StatsCards() {
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const data = await getDevices();
      setDevices(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-5 w-5 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-1/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const onlineDevices = devices.filter(
    (d) => d.status === "Online"
  ).length;
  const totalDevices = devices.length;
  
  const totalData = devices.reduce(
    (acc, dev) => acc + dev.dataUsage.download + dev.dataUsage.upload,
    0
  );
  const formattedData = (totalData / 1024).toFixed(2); // Convert MB to GB

  const stats = [
    {
      title: "Appareils en ligne",
      value: `${onlineDevices} / ${totalDevices}`,
      icon: Wifi,
      color: "text-green-500",
      href: "/dashboard#network-map"
    },
    {
      title: "Menaces détectées",
      value: "2",
      icon: ShieldAlert,
      color: "text-red-500",
      href: "/dashboard/security"
    },
    {
      title: "Données utilisées",
      value: `${formattedData} GB`,
      icon: ArrowDownUp,
      color: "text-blue-500",
      href: "/dashboard#bandwidth-card"
    },
     {
      title: "Utilisateurs connectés",
      value: "4",
      icon: Users,
      color: "text-purple-500",
      href: "/dashboard/parental-controls"
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const cardContent = (
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={cn("h-5 w-5 text-muted-foreground", stat.color)} />
            </CardHeader>
        );

        return (
          <Card key={stat.title} className="transition-all hover:shadow-md">
            <NextLink href={stat.href} className="block">
              {cardContent}
              <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground">
                  {stat.title === "Menaces détectées" && "dans les dernières 24h"}
                  </p>
              </CardContent>
            </NextLink>
          </Card>
        );
      })}
    </div>
  );
}
