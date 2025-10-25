import { Device, LogEntry, User } from '@/lib/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Admin User',
  avatar: '/user-avatar.png',
  role: 'Admin',
};


// =================================================================================
// DONNÉES DE SIMULATION - POINT D'ENTRÉE POUR LES TESTS
// =================================================================================
// NOTE IMPORTANTE :
// Dans un environnement de développement, ce fichier agit comme une base de données
// simulée. Pour tester l'application avec des appareils réels, vous pouvez
// remplir cette liste manuellement avec les informations trouvées sur votre routeur.
//
// Dans une application de production réelle, ce fichier ne serait pas utilisé.
// À la place, les données proviendraient d'un "agent de scan local" qui
// enverrait les informations à une base de données cloud (ex: Firestore),
// et le service `network-service.ts` lirait ces données depuis le cloud.
// =================================================================================
export const mockDevices: Device[] = [
    {
        "id": "device-0",
        "ip": "192.168.1.1",
        "mac": "00:1A:2B:3C:4D:FF",
        "name": "Routeur Principal",
        "type": "Router",
        "status": "Online",
        "bandwidthUsage": 0.5,
        "dataUsage": { "download": 15000, "upload": 2000 },
        "lastSeen": new Date().toISOString(),
        "openPorts": [],
        "dns": "1.1.1.1",
        "dhcp": true,
        "firewallRules": [],
        "blockedCategories": []
    },
    {
        "id": "device-1",
        "ip": "192.168.1.100",
        "mac": "A8:DB:03:CE:9B:A1",
        "name": "Admin's MacBook Pro",
        "type": "Laptop",
        "status": "Online",
        "bandwidthUsage": 15.2,
        "dataUsage": { "download": 1204, "upload": 345 },
        "lastSeen": new Date(Date.now() - 60000 * 2).toISOString(),
        "openPorts": [80, 443],
        "dns": "1.1.1.1",
        "dhcp": true,
        "firewallRules": [],
        "blockedCategories": []
    },
    {
        "id": "device-2",
        "ip": "192.168.1.101",
        "mac": "B8:27:EB:4D:9F:E6",
        "name": "Living Room TV",
        "type": "TV",
        "status": "Online",
        "bandwidthUsage": 25.8,
        "dataUsage": { "download": 8201, "upload": 150 },
        "lastSeen": new Date(Date.now() - 60000 * 5).toISOString(),
        "openPorts": [8008, 8009],
        "dns": "1.1.1.1",
        "dhcp": true,
        "firewallRules": [],
        "blockedCategories": []
    },
    {
        "id": "device-3",
        "ip": "192.168.1.102",
        "mac": "C0:25:E9:1A:2B:3C",
        "name": "Guest iPhone",
        "type": "Smartphone",
        "status": "Paused",
        "bandwidthUsage": 0,
        "dataUsage": { "download": 302, "upload": 88 },
        "lastSeen": new Date(Date.now() - 60000 * 60 * 2).toISOString(),
        "openPorts": [],
        "dns": "1.1.1.1",
        "dhcp": true,
        "firewallRules": [],
        "blockedCategories": ["Gaming", "Social Media"]
    },
    {
        "id": "device-4",
        "ip": "192.168.1.103",
        "mac": "D4:F5:13:A9:B3:F1",
        "name": "Security Camera 1",
        "type": "Camera",
        "status": "Online",
        "bandwidthUsage": 1.5,
        "dataUsage": { "download": 540, "upload": 540 },
        "lastSeen": new Date(Date.now() - 60000 * 1).toISOString(),
        "openPorts": [554],
        "dns": "1.1.1.1",
        "dhcp": true,
        "firewallRules": [],
        "blockedCategories": []
    },
    {
        "id": "device-5",
        "ip": "192.168.1.104",
        "mac": "E8:48:B8:C3:D7:0A",
        "name": "Workstation-Dev",
        "type": "Laptop",
        "status": "Blocked",
        "bandwidthUsage": 0,
        "dataUsage": { "download": 2500, "upload": 1200 },
        "lastSeen": new Date(Date.now() - 60000 * 10).toISOString(),
        "openPorts": [22, 3389],
        "dns": "1.1.1.1",
        "dhcp": true,
        "firewallRules": ["block_all_inbound"],
        "blockedCategories": []
    },
    {
        "id": "device-6",
        "ip": "192.168.1.105",
        "mac": "F0:EF:86:1E:C6:B9",
        "name": "Kitchen Tablet",
        "type": "Tablet",
        "status": "Online",
        "bandwidthUsage": 3.1,
        "dataUsage": { "download": 950, "upload": 210 },
        "lastSeen": new Date(Date.now() - 60000 * 20).toISOString(),
        "openPorts": [],
        "dns": "1.1.1.1",
        "dhcp": true,
        "firewallRules": [],
        "blockedCategories": []
    },
    {
        "id": "device-7",
        "ip": "192.168.1.106",
        "mac": "00:1A:2B:3C:4D:5E",
        "name": "Smart Thermostat",
        "type": "IoT",
        "status": "Offline",
        "bandwidthUsage": 0,
        "dataUsage": { "download": 15, "upload": 30 },
        "lastSeen": new Date(Date.now() - 60000 * 60 * 24 * 3).toISOString(),
        "openPorts": [],
        "dns": "1.1.1.1",
        "dhcp": true,
        "firewallRules": [],
        "blockedCategories": []
    }
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
