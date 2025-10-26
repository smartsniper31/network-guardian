
'use client';

import type { Device } from '@/lib/types';
import mockData from './mock-scan-data.json';

// =================================================================================
// SERVICE DE SCAN RÉSEAU (HYBRIDE)
// =================================================================================
// NOTE IMPORTANTE :
// Ce service est le point de connexion entre l'interface utilisateur et le moteur
// de scan natif (via Electron). Il est conçu pour être "hybride".
// =================================================================================

// Déclare l'API Electron potentiellement disponible sur l'objet window
declare global {
  interface Window {
    electronAPI?: {
      scanNetwork: () => Promise<{ ip: string; mac: string; name: string }[]>;
    };
  }
}

/**
 * Exécute un scan du réseau pour découvrir les appareils.
 * - En mode Electron, il appelle la fonction native exposée via le script de pré-chargement.
 * - En mode navigateur web simple, il retourne des données simulées pour le développement de l'UI.
 * @param routerIp L'adresse IP du routeur (utilisée potentiellement par le scan natif).
 * @returns Une promesse qui se résout avec une liste d'appareils découverts.
 */
export async function performScan(routerIp: string): Promise<Omit<Device, 'id'>[]> {
  // Vérifie si l'API Electron est disponible.
  if (window.electronAPI && typeof window.electronAPI.scanNetwork === 'function') {
    console.log('[Scan Service] Détection de l'environnement Electron. Appel du scan natif...');
    try {
      const nativeDevices = await window.electronAPI.scanNetwork();
      console.log(`[Scan Service] Scan natif terminé. ${nativeDevices.length} appareils reçus.`);
      
      // Nous devons mapper les données brutes du scan natif vers le type complet `Device`.
      const formattedDevices = nativeDevices.map((d, index) => {
        const deviceTypes: Device['type'][] = ['Smartphone', 'TV', 'Camera', 'Laptop', 'IoT', 'Tablet'];
        return {
          ...d,
          type: deviceTypes[index % deviceTypes.length], // Assignation de type pour la démo
          status: 'Online' as const,
          bandwidthUsage: Math.floor(Math.random() * 20),
          dataUsage: { download: 0, upload: 0 },
          lastSeen: new Date().toISOString(),
          openPorts: [],
          dns: 'native',
          dhcp: true,
          firewallRules: [],
          blockedCategories: [],
        };
      });
      return formattedDevices;

    } catch (error) {
      console.error("[Scan Service] Erreur lors de l'appel du scan natif:", error);
      // En cas d'erreur du côté natif, on retourne un tableau vide pour éviter un crash.
      return [];
    }

  } else {
    // Si l'API n'est pas là, nous sommes dans un navigateur web standard.
    console.log(`[Scan Service] Environnement web détecté. Utilisation des données de simulation.`);
    
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simule la durée du scan

    const deviceTypes: Device['type'][] = ['Smartphone', 'TV', 'Camera', 'Laptop', 'IoT', 'Tablet'];

    const discoveredDevices = mockData.mockDevices.map((device, index): Omit<Device, 'id'> => ({
      ...device,
      type: deviceTypes[index % deviceTypes.length],
    }));

    console.log(`[Scan Service] Scan simulé terminé. ${discoveredDevices.length} appareils découverts.`);
    return discoveredDevices;
  }
}
