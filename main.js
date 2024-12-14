const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 560,
    height: 870,
    title: 'TikLocal',
    autoHideMenuBar: true,
    menuBarVisible: false,
    webPreferences: {
      nodeIntegration: true,  // Enable nodeIntegration to allow access to Node.js APIs in the renderer process
      contextIsolation: false, // Disable context isolation so you can access node APIs directly in renderer process
    }
  });

  mainWindow.loadFile('index.html');
}

// Handle directory open dialog request from renderer process
ipcMain.handle('dialog:openDirectory', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  return result.filePaths;  // Return the selected directory path
});

app.whenReady().then(() => {
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Listen for resize toggle from renderer
ipcMain.on('toggle-landscape', (event, isHorizontal) => {
  // The logic for window resizing based on the video orientation state.
  if (isHorizontal) {
    // Adjust window size to horizontal dimensions
    mainWindow.setBounds({ width: 1280, height: 800 }); // Example for landscape
  } else {
    // Revert to default dimensions
    mainWindow.setBounds({ width: 560, height: 870 }); // Default dimensions
  }
});
