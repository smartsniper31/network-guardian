
import { Device, LogEntry } from '@/lib/types';
import { mockDevices, mockLogs } from '@/lib/data';

// =================================================================================
// COUCHE DE SERVICE RÉSEAU (SIMULÉE)
// =================================================================================
// NOTE IMPORTANTE :
// Ce fichier simule une API ou une couche de service qui interagirait
// avec une base de données (comme Firestore) dans une application réelle.
// Les composants React appellent ces fonctions pour obtenir des données,
// ce qui les découple de la source de données réelle.
//
// Pour passer à une application réelle, il suffirait de remplacer
// le contenu de ces fonctions pour qu'elles appellent une véritable base de données
// au lieu de retourner des données de simulation.
// =================================================================================

// Simule un état en mémoire pour les appareils, pour permettre les mises à jour.
let inMemoryDevices: Device[] = [...mockDevices];

export async function getDevices(): Promise<Device[]> {
  // Simule une latence réseau
  await new Promise(resolve => setTimeout(resolve, 200));
  
  // Dans une vraie app, on ferait : return db.collection('devices').get();
  return JSON.parse(JSON.stringify(inMemoryDevices)); // Retourne une copie pour éviter les mutations directes
}

export async function getLogs(): Promise<LogEntry[]> {
  // Simule une latence réseau
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Dans une vraie app, on ferait : return db.collection('logs').get();
  return mockLogs;
}

export async function updateDeviceStatus(deviceId: string, status: Device['status']): Promise<Device> {
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const deviceIndex = inMemoryDevices.findIndex(d => d.id === deviceId);
    if (deviceIndex === -1) {
        throw new Error("Device not found");
    }

    inMemoryDevices[deviceIndex].status = status;
    return { ...inMemoryDevices[deviceIndex] };
}

export async function addDevice(deviceData: Omit<Device, 'id'>): Promise<Device> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const newDevice: Device = {
        ...deviceData,
        id: `device-${Math.random().toString(36).substr(2, 9)}`,
    };
    inMemoryDevices.push(newDevice);
    return newDevice;
}

export async function updateDeviceBlockedCategories(deviceId: string, categories: string[]): Promise<Device> {
    await new Promise(resolve => setTimeout(resolve, 100));

    const deviceIndex = inMemoryDevices.findIndex(d => d.id === deviceId);
    if (deviceIndex === -1) {
        throw new Error("Device not found");
    }

    inMemoryDevices[deviceIndex].blockedCategories = categories;
    return { ...inMemoryDevices[deviceIndex] };
}

export async function getDevice(id: string): Promise<Device | undefined> {
    await new Promise(resolve => setTimeout(resolve, 50));
    return inMemoryDevices.find(d => d.id === id);
}
