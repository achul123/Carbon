const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const axios = require('axios');

const API_BASE_URL = 'http://us2-p.plutonodes.net:25000/wallet';

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadFile('index.html');
  // mainWindow.webContents.openDevTools();
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

// IPC handlers for wallet operations
ipcMain.handle('create-wallet', async () => {
  try {
    const response = await axios.post(`${API_BASE_URL}/external/create`);
    return response.data;
  } catch (error) {
    console.error('Error creating wallet:', error);
    throw error;
  }
});

ipcMain.handle('get-wallet', async (event, address) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/external/${address}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching wallet:', error);
    throw error;
  }
});

ipcMain.handle('get-transactions', async (event, address) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/external/${address}/transactions`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
});

ipcMain.handle('transfer', async (event, transferData) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/external/transfer`, transferData);
    return response.data;
  } catch (error) {
    console.error('Error transferring funds:', error);
    throw error;
  }
});