
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import arpscan from 'arpscan';

const isDev = process.env.NODE_ENV !== 'production';

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    // Port 9002 is used by the next dev server
    mainWindow.loadURL('http://localhost:9002');
    mainWindow.webContents.openDevTools();
  } else {
    const filePath = path.join(__dirname, '..', '.next', 'server', 'app', 'index.html');
    mainWindow.loadFile(filePath);
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// IPC handler for network scanning
ipcMain.handle('perform-scan', async () => {
  console.log('[Electron Main] IPC "perform-scan" received. Starting native ARP scan...');
  
  return new Promise((resolve, reject) => {
    arpscan({ command: 'arp-scan', args: ['-l', '--plain'] }, (err, data) => {
      if (err) {
        console.error('[Electron Main] Native scan failed:', err);
        // On error (e.g., arp-scan not installed or permissions issue),
        // we can either reject or return a specific error structure.
        // For now, we resolve with an empty array to prevent the frontend from crashing.
        resolve([]);
        return;
      }

      console.log(`[Electron Main] Native scan successful. Found ${data.length} devices.`);
      
      const formattedData = data.map(device => ({
        ip: device.ip,
        mac: device.mac.toUpperCase(),
        // Use vendor as name, or a placeholder if vendor is not available
        name: device.vendor || `Appareil Inconnu (${device.ip})`,
      }));

      resolve(formattedData);
    });
  });
});
