
import { contextBridge, ipcRenderer } from 'electron';

export type ScannedDevice = {
  ip: string;
  mac: string;
  name: string;
};

// Expose a safe, limited API to the renderer process (our Next.js app)
// This is the secure bridge between the web content and the Electron main process.
contextBridge.exposeInMainWorld('electronAPI', {
  // We now expect the router's IP to be passed from the frontend.
  scanNetwork: (routerIp: string): Promise<ScannedDevice[]> => ipcRenderer.invoke('perform-scan', routerIp),
});
