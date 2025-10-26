import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

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

// Example IPC handler - This is where future native functions will be exposed
ipcMain.handle('perform-scan', async () => {
  // In Chantier 2, this will call the native scan script.
  // For now, it returns a placeholder.
  console.log('[Electron Main] IPC "perform-scan" received.');
  return [{ ip: '192.168.1.254', mac: 'NATIVE-SCAN-SIM', name: 'Scanned from Electron' }];
});
