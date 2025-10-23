import { Device, LogEntry, User } from '@/lib/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Admin User',
  avatar: '/user-avatar.png',
  role: 'Admin',
};


// =================================================================================
// DONNÉES DE SIMULATION
// =================================================================================
// NOTE IMPORTANTE :
// Ce fichier contient les données de simulation pour l'application.
// Dans une application réelle, ces données proviendraient d'un agent local
// qui scanne le réseau et envoie les informations à une base de données
// (comme Firebase Firestore). Notre application lirait ensuite ces données
// depuis la base de données via une API.
//
// Pour la simulation, nous utilisons cette liste pré-remplie.
// =================================================================================
export const mockDevices: Device[] = [
  {
    id: 'device-1',
    ip: '192.168.1.25',
    mac: 'A8:DB:03:CE:9B:A1',
    name: "Admin's MacBook Pro",
    type: 'Laptop',
    status: 'Online',
    bandwidthUsage: 5.2,
    dataUsage: { download: 1204, upload: 345 },
    lastSeen: new Date(Date.now() - 60000 * 2).toISOString(),
    openPorts: [80, 443],
    dns: '8.8.8.8',
    dhcp: true,
    firewallRules: [],
    blockedCategories: [],
  },
  {
    id: 'device-2',
    ip: '192.168.1.30',
    mac: 'B1:A2:C3:D4:E5:F6',
    name: "Living Room TV",
    type: 'TV',
    status: 'Online',
    bandwidthUsage: 15.8,
    dataUsage: { download: 8201, upload: 102 },
    lastSeen: new Date(Date.now() - 60000 * 5).toISOString(),
    openPorts: [443, 8080],
    dns: '8.8.8.8',
    dhcp: true,
    firewallRules: [],
    blockedCategories: ['Gaming'],
  },
  {
    id: 'device-3',
    ip: '192.168.1.103',
    mac: 'C3:D4:E5:F6:A1:B2',
    name: "Guest iPhone",
    type: 'Smartphone',
    status: 'Paused',
    bandwidthUsage: 0,
    dataUsage: { download: 50, upload: 12 },
    lastSeen: new Date(Date.now() - 60000 * 60 * 2).toISOString(),
    openPorts: [],
    dns: '8.8.8.8',
    dhcp: true,
    firewallRules: [],
    blockedCategories: [],
  },
   {
    id: 'device-4',
    ip: '192.168.1.104',
    mac: 'D4:E5:F6:A1:B2:C3',
    name: "Security Camera 1",
    type: 'Camera',
    status: 'Online',
    bandwidthUsage: 2.1,
    dataUsage: { download: 450, upload: 450 },
    lastSeen: new Date(Date.now() - 60000 * 10).toISOString(),
    openPorts: [554],
    dns: '1.1.1.1',
    dhcp: true,
    firewallRules: [],
    blockedCategories: [],
  },
  {
    id: 'device-5',
    ip: '192.168.1.105',
    mac: 'E5:F6:A1:B2:C3:D4',
    name: "Workstation-Dev",
    type: 'Laptop',
    status: 'Blocked',
    bandwidthUsage: 0,
    dataUsage: { download: 2300, upload: 800 },
    lastSeen: new Date(Date.now() - 60000 * 30).toISOString(),
    openPorts: [22, 3389],
    dns: '8.8.8.8',
    dhcp: true,
    firewallRules: [],
    blockedCategories: [],
  },
  {
    id: 'device-6',
    ip: '192.168.1.106',
    mac: 'F6:A1:B2:C3:D4:E5',
    name: "Kitchen Tablet",
    type: 'Tablet',
    status: 'Offline',
    bandwidthUsage: 0,
    dataUsage: { download: 600, upload: 50 },
    lastSeen: new Date(Date.now() - 60000 * 60 * 24 * 2).toISOString(),
    openPorts: [],
    dns: '8.8.8.8',
    dhcp: true,
    firewallRules: [],
    blockedCategories: ['Social Media', 'Gaming'],
  },
  {
    id: 'device-7',
    ip: '192.168.1.107',
    mac: 'A1:B2:C3:D4:E5:F6',
    name: "Smart Thermostat",
    type: 'IoT',
    status: 'Online',
    bandwidthUsage: 0.1,
    dataUsage: { download: 5, upload: 5 },
    lastSeen: new Date(Date.now() - 60000 * 1).toISOString(),
    openPorts: [8883],
    dns: '1.1.1.1',
    dhcp: true,
    firewallRules: [],
    blockedCategories: [],
  },
];


export const mockLogs: LogEntry[] = [
  {
    id: 'log-1',
    timestamp: new Date(Date.now() - 60000 * 15).toISOString(),
    user: 'Admin User',
    action: 'Block Device',
    target: 'Unknown Device (192.168.1.105)',
    details: 'User blocked the device due to suspicious activity on port 3389.',
  },
  {
    id: 'log-2',
    timestamp: new Date(Date.now() - 60000 * 45).toISOString(),
    user: 'Admin User',
    action: 'Pause Device',
    target: 'Guest iPhone (192.168.1.103)',
    details: 'Paused internet access for guest device.',
  },
    {
    id: 'log-3',
    timestamp: new Date(Date.now() - 60000 * 2).toISOString(),
    user: 'SYSTEM',
    action: 'AI Anomaly Detected',
    target: 'Workstation-Dev (192.168.1.105)',
    details: 'High-Severity Anomaly: Unauthorized Port Access. Device attempted to access a blocked RDP port (3389).',
  },
];
