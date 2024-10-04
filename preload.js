const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('wallet', {
  create: () => ipcRenderer.invoke('create-wallet'),
  get: (address) => ipcRenderer.invoke('get-wallet', address),
  getTransactions: (address) => ipcRenderer.invoke('get-transactions', address),
  transfer: (transferData) => ipcRenderer.invoke('transfer', transferData)
});