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
// Dans un produit réel, ces données proviendraient d'un scan automatique du réseau.
// Ici, nous utilisons une liste vide pour commencer, et l'utilisateur peut
// ajouter ses propres appareils manuellement via l'interface de l'application.
//
// Pour pré-remplir la liste à des fins de test, vous pouvez ajouter des objets ici
// en suivant le format ci-dessous.
// =================================================================================

export const mockDevices: Device[] = [
  // Exemple d'un appareil. Décommentez pour le voir dans l'application.
  /*
  {
    id: 'device-1', // ID unique
    ip: '192.168.1.25', // Adresse IP de votre appareil
    mac: 'A8:DB:03:CE:9B:A1', // Adresse MAC de votre appareil
    name: "Mon Ordinateur", // Nom de l'appareil
    type: 'Laptop', // Type : 'Laptop', 'Smartphone', 'Tablet', 'TV', 'Camera', 'IoT', 'Router', 'Unknown'
    status: 'Online', // Statut actuel
    bandwidthUsage: 5.2,
    dataUsage: { download: 1204, upload: 345 },
    lastSeen: new Date().toISOString(),
    openPorts: [80, 443],
    dns: '8.8.8.8',
    dhcp: true,
    firewallRules: [],
    blockedCategories: [],
  },
  */
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
