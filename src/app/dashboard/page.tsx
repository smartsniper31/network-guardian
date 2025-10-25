
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { StatsCards } from '@/components/dashboard/stats-cards';
import { DeviceTable } from '@/components/dashboard/device-table';
import { AnomalyAlerts } from '@/components/dashboard/anomaly-alerts';
import { NetworkMap } from '@/components/dashboard/network-map';
import { BandwidthChart } from '@/components/dashboard/bandwidth-chart';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { hasConfiguredRouter } from "@/lib/services/network-service";
import { Loader2 } from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkConfiguration() {
      const isConfigured = await hasConfiguredRouter();
      if (!isConfigured) {
        router.replace('/setup');
      } else {
        setIsLoading(false);
      }
    }
    checkConfiguration();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="grid gap-8">
      <StatsCards />
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 grid gap-8 auto-rows-min">
          <DeviceTable />
          <NetworkMap />
          <Card id="bandwidth-card">
            <CardHeader>
              <CardTitle>Utilisation de la bande passante</CardTitle>
              <CardDescription>Top 5 des appareils consommant de la bande passante.</CardDescription>
            </CardHeader>
            <CardContent>
              <BandwidthChart />
            </CardContent>
          </Card>
        </div>
        <div className="space-y-8 flex flex-col">
          <AnomalyAlerts />
        </div>
      </div>
      
    </div>
  );
}
