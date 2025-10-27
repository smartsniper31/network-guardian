
'use client';

import type { Device } from '@/lib/types';

// =================================================================================
// SERVICE DE SCAN RÉSEAU (HYBRIDE)
// =================================================================================
// NOTE IMPORTANTE :
// Ce service est le point de connexion entre l'interface utilisateur et le moteur
// de scan natif (via Electron).
// =================================================================================

// Déclare l'API Electron potentiellement disponible sur l'objet window
declare global {
  interface Window {
    electronAPI?: {
      scanNetwork: (routerIp: string) => Promise<{ ip: string; mac: string; name: string }[]>;
    };
  }
}

/**
 * Exécute un scan du réseau pour découvrir les appareils.
 * - En mode Electron, il appelle la fonction native exposée via le script de pré-chargement.
 * @param routerIp L'adresse IP du routeur, nécessaire pour déterminer le sous-réseau à scanner.
 * @returns Une promesse qui se résout avec une liste d'appareils découverts.
 */
export async function performScan(routerIp: string): Promise<Omit<Device, 'id'>[]> {
  // Vérifie si l'API Electron est disponible.
  if (window.electronAPI && typeof window.electronAPI.scanNetwork === 'function') {
    console.log("[Scan Service] Détection de l'environnement Electron. Appel du scan natif...");
    try {
      // On passe l'IP du routeur au processus principal
      const nativeDevices = await window.electronAPI.scanNetwork(routerIp);
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
    // Si l'API n'est pas là, nous sommes dans un environnement non pris en charge.
    console.warn(`[Scan Service] API Electron non trouvée. Cette application est conçue pour fonctionner dans Electron.`);
    alert("Erreur de configuration : L'API de scan réseau n'est pas disponible. Veuillez lancer l'application via Electron.");
    return [];
  }
}
