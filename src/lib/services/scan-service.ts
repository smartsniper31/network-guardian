
'use client';

import type { Device } from '@/lib/types';
import mockData from './mock-scan-data.json';

// =================================================================================
// SERVICE DE SCAN RÉSEAU (SIMULÉ)
// =================================================================================
// NOTE IMPORTANTE :
// Ce service simule un scan réseau en lisant des données depuis un fichier JSON.
// Dans une application réelle (ex: Electron), cette fonction contiendrait la logique
// pour scanner le réseau local et retourner les appareils découverts.
// =================================================================================

/**
 * Simule un scan du réseau pour découvrir les appareils.
 * @param routerIp L'adresse IP du routeur, utilisée comme point de départ (non utilisée dans la simulation).
 * @returns Une promesse qui se résout avec une liste d'appareils découverts (sans le routeur).
 */
export async function performScan(routerIp: string): Promise<Device[]> {
  console.log(`[Simulation] Début du scan réseau depuis le routeur ${routerIp}...`);

  await new Promise(resolve => setTimeout(resolve, 1500)); // Simule la durée du scan

  const deviceTypes: Device['type'][] = ['Smartphone', 'TV', 'Camera', 'Laptop', 'IoT', 'Tablet'];

  const discoveredDevices = mockData.mockDevices.map((device, index): Device => ({
    ...device,
    id: `device-scanned-${index + 1}`,
    // Assign a type from the list, cycling through
    type: deviceTypes[index % deviceTypes.length],
  }));

  console.log(`[Simulation] Scan terminé. ${discoveredDevices.length} appareils découverts.`);
  return discoveredDevices;
}
