import { z } from 'zod';

export const DeviceSchema = z.object({
  id: z.string(),
  ip: z.string(),
  mac: z.string(),
  name: z.string(),
  type: z.enum(['Laptop', 'Smartphone', 'Tablet', 'IoT', 'Camera', 'TV', 'Router', 'Unknown']),
  status: z.enum(['Online', 'Offline', 'Blocked', 'Paused']),
  bandwidthUsage: z.number(),
  dataUsage: z.object({
    download: z.number(),
    upload: z.number(),
  }),
  lastSeen: z.string(),
  openPorts: z.array(z.number()),
  dns: z.string(),
  dhcp: z.boolean(),
  firewallRules: z.array(z.string()),
  blockedCategories: z.array(z.string()).optional(),
});
export type Device = z.infer<typeof DeviceSchema>;

export type LogEntry = {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  details: string;
  target: string;
};

export type User = {
  id: string;
  name: string;
  avatar: string;
  role: 'Admin' | 'User';
};