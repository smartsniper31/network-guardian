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
  // L'application commence avec une liste vide pour une meilleure expérience.
  // Décommentez cet appareil pour voir un exemple ou ajoutez les vôtres.
  /*
  {
    id: 'device-1',
    ip: '192.168.1.25',
    mac: 'A8:DB:03:CE:9B:A1',
    name: "MacBook Pro de l'Admin",
    type: 'Laptop',
    status: 'Online',
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
