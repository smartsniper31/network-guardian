"use client"

import React, { useState, useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { getDevices } from "@/lib/services/network-service";
import { Skeleton } from '../ui/skeleton';

const chartConfig = {
  usage: {
    label: "Usage (Mbps)",
    color: "hsl(var(--primary))",
  },
}

export function BandwidthChart() {
  const [chartData, setChartData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const devices = await getDevices();
      const data = devices
        .filter(d => d.status === 'Online')
        .map(device => ({
          name: device.name.split(' ')[0], // Shorten name for chart label
          usage: device.bandwidthUsage,
        }))
        .sort((a, b) => b.usage - a.usage)
        .slice(0, 5);
      setChartData(data);
      setIsLoading(false);
    }
    fetchData();
  }, []);

  if (isLoading) {
    return <Skeleton className="h-48 w-full" />
  }

  return (
    <div className="h-48 w-full">
      <ChartContainer config={chartConfig} className="h-full w-full">
        <BarChart 
          accessibilityLayer 
          data={chartData}
          layout="vertical"
          margin={{ left: 0, right: 10, top: 0, bottom: 0 }}
        >
          <CartesianGrid horizontal={false} />
          <YAxis
            dataKey="name"
            type="category"
            tickLine={false}
            axisLine={false}
            tickMargin={10}
            className="text-xs"
          />
          <XAxis dataKey="usage" type="number" hide />
          <Tooltip
            cursor={{ fill: 'hsl(var(--accent) / 0.1)' }}
            content={<ChartTooltipContent />}
          />
          <Bar dataKey="usage" fill="var(--color-usage)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  )
}
