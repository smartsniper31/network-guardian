"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"
import {
  ChartContainer,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { mockDevices } from "@/lib/data"

const chartData = mockDevices
  .filter(d => d.status === 'Online')
  .map(device => ({
    name: device.name.split(' ')[0], // Shorten name for chart label
    usage: device.bandwidthUsage,
  }))
  .sort((a, b) => b.usage - a.usage)
  .slice(0, 5);

const chartConfig = {
  usage: {
    label: "Usage (Mbps)",
    color: "hsl(var(--primary))",
  },
}

export function BandwidthChart() {
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
