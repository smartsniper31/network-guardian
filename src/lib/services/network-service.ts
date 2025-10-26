
'use client';

import { Device, LogEntry, User } from '@/lib/types';
import { performScan } from '@/lib/services/scan-service';

// =================================================================================
// COUCHE DE SERVICE RÉSEAU (PERSISTANTE CÔTÉ CLIENT)
// =================================================================================
// NOTE IMPORTANTE :
// Ce service utilise le `localStorage` du navigateur comme source de vérité unique
// pour garantir la cohérence des données entre les sessions et les onglets.
// =================================================================================

const DEVICES_STORAGE_KEY = 'network-guardian-devices';
const USER_STORAGE_KEY = 'network-guardian-user';

// ======================================================
// Gestion des appareils
// ======================================================

const getStoredDevices = (): Device[] => {
  try {
    const storedData = window.localStorage.getItem(DEVICES_STORAGE_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    } else {
      return [];
    }
  } catch (error) {
    console.error("Could not access localStorage. Using in-memory data for devices.", error);
    return [];
  }
};

export const saveStoredDevices = (devices: Device[]) => {
  try {
    window.localStorage.setItem(DEVICES_STORAGE_KEY, JSON.stringify(devices));
  } catch (error) {
     console.error("Could not save devices to localStorage.", error);
  }
};

export async function hasConfiguredRouter(): Promise<boolean> {
  await new Promise(resolve => setTimeout(resolve, 50));
  const devices = getStoredDevices();
  return devices.some(d => d.type === 'Router');
}

/**
 * Lit et retourne la liste des appareils depuis le localStorage.
 * Cette fonction a une seule responsabilité : lire les données. Elle ne déclenche aucun scan.
 */
export async function getDevices(): Promise<Device[]> {
  await new Promise(resolve => setTimeout(resolve, 50)); // Fast read
  return getStoredDevices();
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

// ======================================================
// Gestion des logs (non persistants pour la démo)
// ======================================================
export async function getLogs(): Promise<LogEntry[]> {
  await new Promise(resolve => setTimeout(resolve, 300));
  // Retourne un tableau de logs vide car les données mock ont été supprimées.
  // Dans une vraie application, cela pourrait interroger une API ou IndexedDB.
  return [];
}


// ======================================================
// Gestion de l'utilisateur (authentification locale)
// ======================================================

type StoredUser = Omit<User, 'id' | 'avatar'> & { password?: string };

const getStoredUser = (): StoredUser | null => {
    try {
        const storedData = window.localStorage.getItem(USER_STORAGE_KEY);
        return storedData ? JSON.parse(storedData) : null;
    } catch (error) {
        console.error("Could not access localStorage for user.", error);
        return null;
    }
}

export async function loginUser(email: string, password: string):Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));
    const storedUser = getStoredUser();

    if (!storedUser) {
        throw new Error("Aucun compte administrateur trouvé. Veuillez vous inscrire.");
    }

    if (storedUser.email !== email || storedUser.password !== password) {
        throw new Error("Email ou mot de passe incorrect.");
    }

    const { password: _, ...userWithoutPassword } = storedUser;
    const finalUser = {
      ...userWithoutPassword,
      id: 'local-user',
      avatar: '/user-avatar.png'
    };
    
    return finalUser;
}

export async function signupUser(name: string, email:string, password: string):Promise<User> {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    // Cette approche garantit que l'inscription fonctionne toujours comme une "réinitialisation".
    // Elle supprime tout utilisateur ou appareil précédent pour éviter les conflits.
    try {
        window.localStorage.removeItem(USER_STORAGE_KEY);
        window.localStorage.removeItem(DEVICES_STORAGE_KEY);
    } catch (error) {
        console.error("Could not clear previous user data from localStorage.", error);
    }

    const newUser: StoredUser = {
        name,
        email,
        password,
        role: 'Admin',
    };

    try {
        window.localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } catch (error) {
        console.error("Could not save user to localStorage.", error);
        throw new Error("Impossible de créer le compte.");
    }
    
    const { password: _, ...userWithoutPassword } = newUser;
    return {
        ...userWithoutPassword,
        id: 'local-user',
        avatar: '/user-avatar.png'
    };
}


export async function getUser(): Promise<User | null> {
    await new Promise(resolve => setTimeout(resolve, 50));
    const storedUser = getStoredUser();
    if (!storedUser) return null;
    
    const { password, ...userWithoutPassword } = storedUser;
    
    return {
        id: 'local-user',
        avatar: '/user-avatar.png',
        ...userWithoutPassword
    };
}

export async function getStoredUserPassword(email: string): Promise<string | null> {
    await new Promise(resolve => setTimeout(resolve, 100));
    const storedUser = getStoredUser();
    if (storedUser && storedUser.email === email) {
        return storedUser.password || null;
    }
    return null;
}
