import { Device, LogEntry, User } from '@/lib/types';

export const mockUser: User = {
  id: 'user-1',
  name: 'Admin User',
  avatar: '/user-avatar.png',
  role: 'Admin',
};


// =================================================================================
// DONNÉES DE SIMULATION - VOTRE POINT D'ENTRÉE POUR LES TESTS RÉELS
// =================================================================================
// NOTE IMPORTANTE :
// Pour tester l'application avec les appareils de VOTRE réseau WiFi,
// modifiez la liste `mockDevices` ci-dessous avec les informations réelles
// que vous avez trouvées dans l'interface de votre routeur.
//
// C'est l'étape qui simule le scan automatique du réseau.
// =================================================================================
export const mockDevices: Device[] = [
  // === EXEMPLE D'APPAREIL ===
  // Remplacez cet exemple par vos propres appareils. Copiez et collez ce bloc
  // pour chaque appareil que vous voulez ajouter.
  {
    id: 'device-1', // Gardez un id unique pour chaque appareil
    ip: '192.168.1.25', // Mettez l'adresse IP de votre appareil ici
    mac: 'A8:DB:03:CE:9B:A1', // Mettez l'adresse MAC ici
    name: "MacBook Pro de l'Admin", // Donnez-lui un nom facile à reconnaître
    type: 'Laptop', // Choisissez parmi : 'Laptop', 'Smartphone', 'Tablet', 'IoT', 'Camera', 'TV', 'Router', 'Unknown'
    status: 'Online', // Laissez 'Online' pour les appareils connectés
    bandwidthUsage: 5.2, // Vous pouvez laisser une valeur approximative
    dataUsage: { download: 1204, upload: 345 }, // Vous pouvez laisser une valeur approximative
    lastSeen: new Date().toISOString(), // Laissez cette ligne telle quelle
    openPorts: [80, 443], // Vous pouvez laisser ce champ vide : []
    dns: '8.8.8.8', // Laissez cette valeur par défaut
    dhcp: true, // Laissez cette valeur par défaut
    firewallRules: [], // Laissez ce champ vide
    blockedCategories: [], // Laissez ce champ vide
  },
  // Ajoutez d'autres appareils ici en copiant le bloc ci-dessus...
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
