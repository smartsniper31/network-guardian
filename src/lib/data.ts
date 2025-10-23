import { Device, LogEntry, User } from '@/lib/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Admin User',
  avatar: '/user-avatar.png',
  role: 'Admin',
};

// =================================================================================
// MODIFIEZ CETTE LISTE POUR TESTER AVEC VOS PROPRES APPAREILS
// =================================G================================================
// Vous pouvez trouver l'adresse IP et MAC de vos appareils dans
// l'interface d'administration de votre routeur WiFi.
// =================================================================================
export const mockDevices: Device[] = [
  {
    id: 'device-1', // ID unique, vous pouvez laisser tel quel
    ip: '192.168.1.25', // Remplacez par l'adresse IP de votre appareil
    mac: 'A8:DB:03:CE:9B:A1', // Remplacez par l'adresse MAC
    name: "Mon Ordinateur", // Remplacez par le nom de votre appareil
    type: 'Laptop', // Le type: 'Laptop', 'Smartphone', 'Tablet', 'TV', 'Camera', 'IoT', 'Router', 'Unknown'
    status: 'Online', // Statut actuel
    bandwidthUsage: 5.2, // Vous pouvez mettre une valeur arbitraire
    dataUsage: { download: 1204, upload: 345 }, // Vous pouvez mettre une valeur arbitraire
    lastSeen: new Date().toISOString(),
    openPorts: [80, 443], // Laissez vide si vous ne savez pas: []
    dns: '8.8.8.8',
    dhcp: true,
    firewallRules: [],
    blockedCategories: [],
  },
  {
    id: 'device-2',
    ip: '192.168.1.30', // Remplacez par l'adresse IP d'un autre appareil (ex: votre téléphone)
    mac: 'B8:27:EB:C3:5B:E2',
    name: 'Mon Téléphone',
    type: 'Smartphone',
    status: 'Online',
    bandwidthUsage: 2.1,
    dataUsage: { download: 823, upload: 102 },
    lastSeen: new Date().toISOString(),
    openPorts: [],
    dns: '8.8.8.8',
    dhcp: true,
    firewallRules: [],
    blockedCategories: ['Gaming'], // Exemple de catégorie bloquée
  },
];
// =================================================================================

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
];
