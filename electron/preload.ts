
import { contextBridge, ipcRenderer } from 'electron';

// Expose a safe, limited API to the renderer process (our Next.js app)
// This is the secure bridge between the web content and the Electron main process.
contextBridge.exposeInMainWorld('electronAPI', {
  scanNetwork: () => ipcRenderer.invoke('perform-scan'),
  // We can add more functions here as needed, e.g., for file system access, etc.
});
