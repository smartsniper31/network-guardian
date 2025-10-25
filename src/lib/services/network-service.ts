
'use client';

import { Device, LogEntry } from '@/lib/types';
import { mockDevices, mockLogs } from '@/lib/data';

// =================================================================================
// COUCHE DE SERVICE RÉSEAU (PERSISTANTE CÔTÉ CLIENT)
// =================================================================================
// NOTE IMPORTANTE :
// Ce service utilise le `localStorage` du navigateur pour simuler une base de données
// persistante. Les modifications (ajout, blocage, etc.) sont sauvegardées et
// restaurées entre les sessions.
// =================================================================================

const STORAGE_KEY = 'network-guardian-devices';

// Fonction pour initialiser les données si elles n'existent pas dans le localStorage
const initializeStorage = (): Device[] => {
  try {
    const storedData = window.localStorage.getItem(STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      // Si aucune donnée n'est stockée, on utilise les données de simulation initiales
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(mockDevices));
      return mockDevices;
    }
  } catch (error) {
    console.error("Could not access localStorage. Using mock data for this session.", error);
    // En cas d'erreur (ex: navigation privée), on utilise les données de base
    return mockDevices;
  }
};

// Fonction pour récupérer tous les appareils depuis le localStorage
const getStoredDevices = (): Device[] => {
  try {
    const storedData = window.localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : initializeStorage();
  } catch (error) {
    console.error("Could not access localStorage. Using mock data for this session.", error);
    return mockDevices;
  }
};

// Fonction pour sauvegarder les appareils dans le localStorage
const saveStoredDevices = (devices: Device[]) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(devices));
  } catch (error) {
     console.error("Could not save to localStorage.", error);
  }
};


export async function getDevices(): Promise<Device[]> {
  await new Promise(resolve => setTimeout(resolve, 200));
  return getStoredDevices();
}

export async function getLogs(): Promise<LogEntry[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  return mockLogs; // Les journaux ne sont pas rendus persistants pour cette démo
}

export async function updateDeviceStatus(deviceId: string, status: Device['status']): Promise<Device> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const devices = getStoredDevices();
    const deviceIndex = devices.findIndex(d => d.id === deviceId);

    if (deviceIndex === -1) {
        throw new Error("Device not found");
    }

    devices[deviceIndex].status = status;
    saveStoredDevices(devices);
    return { ...devices[deviceIndex] };
}

export async function addDevice(deviceData: Omit<Device, 'id'>): Promise<Device> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const devices = getStoredDevices();
    const newDevice: Device = {
        ...deviceData,
        id: `device-${Math.random().toString(36).substr(2, 9)}`,
    };
    const newDevices = [...devices, newDevice];
    saveStoredDevices(newDevices);
    return newDevice;
}

export async function updateDeviceBlockedCategories(deviceId: string, categories: string[]): Promise<Device> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const devices = getStoredDevices();
    const deviceIndex = devices.findIndex(d => d.id === deviceId);

    if (deviceIndex === -1) {
        throw new Error("Device not found");
    }

    devices[deviceIndex].blockedCategories = categories;
    saveStoredDevices(devices);
    return { ...devices[deviceIndex] };
}

export async function getDevice(id: string): Promise<Device | undefined> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const devices = getStoredDevices();
    return devices.find(d => d.id === id);
}
