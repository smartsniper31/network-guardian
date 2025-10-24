import { StatsCards } from '@/components/dashboard/stats-cards';
import { DeviceTable } from '@/components/dashboard/device-table';
import { AnomalyAlerts } from '@/components/dashboard/anomaly-alerts';
import { NetworkMap } from '@/components/dashboard/network-map';
import { BandwidthChart } from '@/components/dashboard/bandwidth-chart';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="grid gap-8">
      <StatsCards />
      
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <DeviceTable />
        </div>
        <div className="space-y-8">
          <AnomalyAlerts />
          <Card id="bandwidth-card">
            <CardHeader>
              <CardTitle>Utilisation de la bande passante</CardTitle>
              <CardDescription>Top 5 des appareils les plus gourmands en bande passante.</CardDescription>
            </CardHeader>
            <CardContent>
              <BandwidthChart />
            </CardContent>
          </Card>
        </div>
      </div>
      
      <NetworkMap />
    </div>
  );
}
