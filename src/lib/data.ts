import { Device, LogEntry, User } from '@/lib/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Admin User',
  avatar: '/user-avatar.png',
  role: 'Admin',
};

// =================================================================================
// DONNÉES DE SIMULATION - GUIDE POUR LE TEST EN CONDITIONS "RÉELLES"
// =================================================================================
// NOTE IMPORTANTE :
// Ce fichier simule les données qui, dans une application de production, proviendraient
// d'un "agent local" scannant votre réseau. L'application web elle-même NE PEUT PAS
// scanner votre WiFi directement pour des raisons de sécurité.
//
// POUR TESTER AVEC VOS APPAREILS :
// 1. Connectez-vous à l'interface d'administration de votre routeur (ex: 192.168.1.1).
// 2. Trouvez la section "Appareils connectés" ou "Clients DHCP".
// 3. Récupérez l'adresse IP et l'adresse MAC de vos appareils.
// 4. Remplacez les informations ci-dessous par celles de vos appareils.
// =================================================================================

export const mockDevices: Device[] = [
  {
    id: 'device-1', // ID unique, laissez-le tel quel
    ip: '192.168.1.25', // Remplacez par l'adresse IP de votre appareil
    mac: 'A8:DB:03:CE:9B:A1', // Remplacez par l'adresse MAC
    name: "Mon Ordinateur", // Remplacez par le nom de votre appareil
    type: 'Laptop', // Type : 'Laptop', 'Smartphone', 'Tablet', 'TV', 'Camera', 'IoT', 'Router', 'Unknown'
    status: 'Online', // Statut actuel
    bandwidthUsage: 5.2, // Valeur arbitraire
    dataUsage: { download: 1204, upload: 345 }, // Valeur arbitraire
    lastSeen: new Date().toISOString(),
    openPorts: [80, 443], // Ports ouverts, laissez vide si inconnu : []
    dns: '8.8.8.8',
    dhcp: true,
    firewallRules: [],
    blockedCategories: [],
  },
  {
    id: 'device-2',
    ip: '192.168.1.30', // Remplacez par l'IP d'un autre appareil (ex: votre téléphone)
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
